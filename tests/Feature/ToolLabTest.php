<?php

use App\Ai\Agents\ToolLabAgent;
use Laravel\Ai\Prompts\AgentPrompt;
use Laravel\Ai\Responses\Data\ToolCall;

test('the tool lab page loads', function () {
    $this->get(route('tool-lab'))
        ->assertSuccessful();
});

test('the tool lab returns the final answer and executed tool diagnostics', function () {
    ToolLabAgent::fake([
        new ToolCall(
            id: 'tool-call-1',
            name: 'audience_snapshot',
            arguments: ['audience' => 'developers'],
        ),
        'Build launch copy that emphasizes technical credibility and fast implementation.',
    ])->preventStrayPrompts();

    $this->postJson('/tool-lab', [
        'prompt' => 'Write a product blurb for the team dashboard launch.',
        'audience' => 'developers',
        'goal' => 'launch',
    ])->assertSuccessful()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'prompt' => 'Write a product blurb for the team dashboard launch.',
                'answer' => 'Build launch copy that emphasizes technical credibility and fast implementation.',
                'settings' => [
                    'provider' => 'groq',
                    'model' => 'openai/gpt-oss-120b',
                    'audience' => 'developers',
                    'goal' => 'launch',
                ],
                'tool_calls' => [[
                    'id' => 'tool-call-1',
                    'name' => 'audience_snapshot',
                    'arguments' => [
                        'audience' => 'developers',
                    ],
                ]],
                'tool_results' => [[
                    'id' => 'tool-call-1',
                    'name' => 'audience_snapshot',
                    'arguments' => [
                        'audience' => 'developers',
                    ],
                ]],
            ],
        ])
        ->assertJsonPath(
            'data.tool_results.0.result',
            'Audience: developers. Priorities: technical credibility, implementation control, and reduced busywork. Useful language: API-first, observable, composable, production-ready. Avoid hype and vague promises.',
        );

    ToolLabAgent::assertPrompted(function (AgentPrompt $prompt): bool {
        return $prompt->prompt === 'Write a product blurb for the team dashboard launch.'
            && $prompt->provider()->driver() === 'groq'
            && $prompt->model === 'openai/gpt-oss-120b'
            && $prompt->agent instanceof ToolLabAgent;
    });
});

test('the tool lab validates the request payload', function () {
    ToolLabAgent::fake()->preventStrayPrompts();

    $this->postJson('/tool-lab', [
        'prompt' => 'short',
        'audience' => 'operators',
        'goal' => 'launch',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['prompt', 'audience']);

    ToolLabAgent::assertNeverPrompted();
});
