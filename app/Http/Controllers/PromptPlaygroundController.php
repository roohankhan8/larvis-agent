<?php

namespace App\Http\Controllers;

use App\Ai\Agents\PromptPlaygroundAgent;
use App\Http\Controllers\Concerns\InteractsWithContentProjects;
use App\Models\PromptPlaygroundEntry;
use App\Support\ContentProjectWorkflow;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Ai\Ai;

class PromptPlaygroundController extends Controller
{
    use InteractsWithContentProjects;

    public function index(Request $request): Response
    {
        $project = $this->resolveProject($request);

        return Inertia::render('PromptPlayground', [
            'defaults' => [
                'tone' => in_array(strtolower($project->tone ?? ''), ['neutral', 'concise', 'persuasive', 'playful'])
                    ? strtolower($project->tone)
                    : 'neutral',
                'length' => 'standard',
                'temperature' => (float) ($project?->model_settings['temperature'] ?? 0.7),
                'top_p' => (float) ($project?->model_settings['top_p'] ?? 0.9),
                'model_profile' => $project?->model_settings['model_profile'] ?? 'default',
            ],
            'project' => $this->projectPayload($project),
            'initialPrompt' => $project->current_draft ?? $project?->source_content,
            'modelOptions' => $this->modelOptions(),
        ]);
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'min:10', 'max:4000'],
            'tone' => ['required', 'string', 'in:neutral,concise,persuasive,playful'],
            'length' => ['required', 'string', 'in:brief,standard,detailed'],
            'temperature' => ['required', 'numeric', 'between:0,1'],
            'top_p' => ['required', 'numeric', 'between:0,1'],
            'model_profile' => ['required', 'string', 'in:default,draft,deep'],
            'project_id' => ['nullable', 'integer'],
        ]);

        $selectedModel = collect($this->modelOptions())
            ->firstWhere('value', $validated['model_profile']);

        $agent = new PromptPlaygroundAgent(
            tone: $validated['tone'],
            length: $validated['length'],
            temperature: (float) $validated['temperature'],
            topP: (float) $validated['top_p'],
            model: $selectedModel['model'] ?? null,
        );

        $response = $agent->prompt($validated['prompt']);
        $entry = PromptPlaygroundEntry::create([
            'prompt' => $validated['prompt'],
            'response' => trim($response->text),
            'provider' => $response->meta->provider,
            'model' => $response->meta->model,
            'tone' => $validated['tone'],
            'length' => $validated['length'],
            'temperature' => (float) $validated['temperature'],
            'top_p' => (float) $validated['top_p'],
        ]);

        $project = $this->resolveProject($request);

        if ($project !== null) {
            app(ContentProjectWorkflow::class)->saveDraft(
                $project,
                'Prompt playground draft',
                $entry->response,
                'prompt-playground',
                [
                    'provider' => $entry->provider,
                    'model' => $entry->model,
                    'tone' => $validated['tone'],
                    'length' => $validated['length'],
                    'temperature' => (float) $validated['temperature'],
                    'top_p' => (float) $validated['top_p'],
                    'model_profile' => $validated['model_profile'],
                ],
            );
        }

        return response()->json([
            'status' => 'success',
            'project' => $this->projectPayload($project),
            'data' => [
                'prompt' => $validated['prompt'],
                'answer' => $entry->response,
                'settings' => [
                    'provider' => $entry->provider,
                    'tone' => $validated['tone'],
                    'length' => $validated['length'],
                    'temperature' => (float) $validated['temperature'],
                    'top_p' => (float) $validated['top_p'],
                    'model_profile' => $validated['model_profile'],
                    'model' => $entry->model,
                ],
            ],
        ]);
    }

    /**
     * @return array<int, array{value: string, label: string, description: string, model: string}>
     */
    private function modelOptions(): array
    {
        $provider = Ai::textProvider();

        return [
            [
                'value' => 'default',
                'label' => 'Default',
                'description' => 'The default model configured for this provider.',
                'model' => $provider->defaultTextModel(),
            ],
            [
                'value' => 'draft',
                'label' => 'Draft',
                'description' => 'The provider’s faster, lower-cost text model.',
                'model' => $provider->cheapestTextModel(),
            ],
            [
                'value' => 'deep',
                'label' => 'Deep',
                'description' => 'The provider’s strongest text model.',
                'model' => $provider->smartestTextModel(),
            ],
        ];
    }
}
