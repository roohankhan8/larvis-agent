<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ToolLabAgent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class ToolLabController extends Controller
{
    /**
     * @var array<int, array{value: string, label: string, description: string}>
     */
    private const AUDIENCE_OPTIONS = [
        [
            'value' => 'founders',
            'label' => 'Founders',
            'description' => 'Prioritize speed, leverage, and commercial clarity.',
        ],
        [
            'value' => 'developers',
            'label' => 'Developers',
            'description' => 'Prioritize implementation detail, control, and credibility.',
        ],
        [
            'value' => 'marketers',
            'label' => 'Marketers',
            'description' => 'Prioritize positioning, campaigns, and conversion momentum.',
        ],
    ];

    /**
     * @var array<int, array{value: string, label: string, description: string}>
     */
    private const GOAL_OPTIONS = [
        [
            'value' => 'signup',
            'label' => 'Sign-up',
            'description' => 'Drive account creation with a direct activation CTA.',
        ],
        [
            'value' => 'demo',
            'label' => 'Demo',
            'description' => 'Encourage a product walkthrough or team conversation.',
        ],
        [
            'value' => 'launch',
            'label' => 'Launch',
            'description' => 'Support release messaging and launch-day urgency.',
        ],
    ];

    public function index(): Response
    {
        return Inertia::render('ToolLab', [
            'defaults' => [
                'audience' => 'founders',
                'goal' => 'signup',
            ],
            'audienceOptions' => self::AUDIENCE_OPTIONS,
            'goalOptions' => self::GOAL_OPTIONS,
        ]);
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'min:10', 'max:4000'],
            'audience' => ['required', 'string', 'in:founders,developers,marketers'],
            'goal' => ['required', 'string', 'in:signup,demo,launch'],
        ]);

        $agent = new ToolLabAgent(
            audience: $validated['audience'],
            goal: $validated['goal'],
        );

        $response = $agent->prompt($validated['prompt']);

        return response()->json([
            'status' => 'success',
            'data' => [
                'prompt' => $validated['prompt'],
                'answer' => trim($response->text),
                'settings' => [
                    'provider' => 'groq',
                    'model' => $agent->resolvedModel(),
                    'audience' => $validated['audience'],
                    'goal' => $validated['goal'],
                ],
                'tool_calls' => $response->toolCalls->map(
                    fn ($toolCall): array => $toolCall->toArray(),
                )->values()->all(),
                'tool_results' => $response->toolResults->map(
                    fn ($toolResult): array => $toolResult->toArray(),
                )->values()->all(),
            ],
        ]);
    }
}
