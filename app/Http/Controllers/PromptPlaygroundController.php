<?php

namespace App\Http\Controllers;

use App\Ai\Agents\PromptPlaygroundAgent;
use App\Models\PromptPlaygroundEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromptPlaygroundController extends Controller
{
    /**
     * @var array<int, array{value: string, label: string, description: string, model: ?string}>
     */
    private const MODEL_OPTIONS = [
        [
            'value' => 'default',
            'label' => 'Default',
            'description' => 'Use the Groq provider default configured for this app.',
            'model' => null,
        ],
        [
            'value' => 'draft',
            'label' => 'Draft',
            'description' => 'A lighter Groq-backed model for quicker exploratory writing.',
            'model' => 'openai/gpt-oss-20b',
        ],
        [
            'value' => 'deep',
            'label' => 'Deep',
            'description' => 'A stronger Groq-backed model for richer responses.',
            'model' => 'openai/gpt-oss-120b',
        ],
    ];

    public function index(): Response
    {
        return Inertia::render('PromptPlayground', [
            'defaults' => [
                'tone' => 'neutral',
                'length' => 'standard',
                'temperature' => 0.7,
                'top_p' => 0.9,
                'model_profile' => 'default',
            ],
            'modelOptions' => self::MODEL_OPTIONS,
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
        ]);

        $selectedModel = collect(self::MODEL_OPTIONS)
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
            'provider' => 'groq',
            'model' => $agent->resolvedModel(),
            'tone' => $validated['tone'],
            'length' => $validated['length'],
            'temperature' => (float) $validated['temperature'],
            'top_p' => (float) $validated['top_p'],
        ]);

        return response()->json([
            'status' => 'success',
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
}
