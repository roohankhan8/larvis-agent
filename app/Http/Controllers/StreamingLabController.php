<?php

namespace App\Http\Controllers;

use App\Ai\Agents\StreamingLabAgent;
use App\Http\Controllers\Concerns\InteractsWithContentProjects;
use App\Models\StreamingLabEntry;
use App\Support\ContentProjectWorkflow;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Ai\Responses\StreamableAgentResponse;
use Laravel\Ai\Responses\StreamedAgentResponse;

class StreamingLabController extends Controller
{
    use InteractsWithContentProjects;

    public function index(Request $request): Response
    {
        $project = $this->resolveProject($request);

        return Inertia::render('StreamingLab', [
            'project' => $this->projectPayload($project),
            'initialPrompt' => $project->current_draft ?? $project?->source_content,
        ]);
    }

    public function stream(Request $request): StreamableAgentResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'min:10', 'max:4000'],
            'project_id' => ['nullable', 'integer'],
        ]);

        $agent = new StreamingLabAgent;
        $project = $this->resolveProject($request);

        return $agent
            ->stream($validated['prompt'])
            ->then(function (StreamedAgentResponse $response) use ($agent, $project, $validated): void {
                $entry = StreamingLabEntry::create([
                    'prompt' => $validated['prompt'],
                    'response' => trim($response->text),
                    'provider' => 'groq',
                    'model' => $agent->resolvedModel(),
                ]);

                if ($project !== null) {
                    app(ContentProjectWorkflow::class)->saveFinal(
                        $project,
                        $entry->response,
                    );
                }
            });
    }
}
