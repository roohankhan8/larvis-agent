<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ConversationLabAgent;
use App\Http\Controllers\Concerns\InteractsWithContentProjects;
use App\Models\User;
use App\Support\ContentProjectWorkflow;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Ai\Models\Conversation;

class ConversationLabController extends Controller
{
    use InteractsWithContentProjects;

    public function index(Request $request): Response
    {
        $user = $this->conversationParticipant($request);
        $project = $this->resolveProject($request);
        $conversation = $project?->conversation_id !== null
            ? Conversation::query()
                ->whereKey($project->conversation_id)
                ->with(['messages' => fn ($query) => $query->oldest('created_at')])
                ->first()
            : $user->conversations()
                ->latest('updated_at')
                ->with(['messages' => fn ($query) => $query->oldest('created_at')])
                ->first();

        return Inertia::render('ConversationLab', [
            'participant' => [
                'name' => $user->name,
            ],
            'project' => $this->projectPayload($project),
            'conversation' => $conversation !== null ? $this->serializeConversation($conversation) : null,
        ]);
    }

    public function respond(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:2', 'max:4000'],
            'conversation_id' => ['nullable', 'string', 'uuid'],
            'project_id' => ['nullable', 'integer'],
        ]);

        $user = $this->conversationParticipant($request);
        $project = $this->resolveProject($request);
        $conversationId = $validated['conversation_id'] ?? $project?->conversation_id;

        $agent = new ConversationLabAgent;

        if ($conversationId !== null) {
            $agent->continue($conversationId, as: $user);
        } else {
            $agent->forUser($user);
        }

        $response = $agent->prompt($validated['message']);
        $conversationId = $response->conversationId ?? $conversationId;

        $conversation = Conversation::query()
            ->whereKey($conversationId)
            ->with(['messages' => fn ($query) => $query->oldest('created_at')])
            ->first();

        if ($project !== null && $conversationId !== null) {
            app(ContentProjectWorkflow::class)->attachConversation($project, $conversationId);

            if ($conversation !== null) {
                app(ContentProjectWorkflow::class)->saveDraft(
                    $project,
                    'Conversation revision',
                    trim($response->text),
                    'conversation-lab',
                    ['conversation_id' => $conversationId],
                );
            }
        }

        return response()->json([
            'status' => 'success',
            'project' => $this->projectPayload($project),
            'data' => [
                'conversation_id' => $conversationId,
                'reply' => trim($response->text),
                'messages' => $conversation !== null ? $this->serializeConversation($conversation)['messages'] : [],
            ],
        ]);
    }

    private function conversationParticipant(Request $request): User
    {
        if ($request->user() instanceof User) {
            return $request->user();
        }

        return User::query()->firstOrCreate(
            ['email' => 'conversation-lab@example.com'],
            ['name' => 'Conversation Lab', 'password' => 'conversation-lab'],
        );
    }

    /**
     * @return array{id: string, title: string|null, messages: array<int, array{role: string, content: string}>}
     */
    private function serializeConversation(Conversation $conversation): array
    {
        return [
            'id' => $conversation->id,
            'title' => $conversation->title,
            'messages' => $conversation->messages->map(
                fn ($message): array => [
                    'role' => $message->role,
                    'content' => $message->content,
                ],
            )->values()->all(),
        ];
    }
}
