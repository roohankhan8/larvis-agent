<?php

use App\Ai\Agents\PromptPlaygroundAgent;
use App\Models\PromptPlaygroundEntry;
use Laravel\Ai\Prompts\AgentPrompt;

test('the prompt playground page loads', function () {
    $this->get(route('prompt-playground'))
        ->assertSuccessful();
});

test('the prompt playground generates text with the groq agent', function () {
    PromptPlaygroundAgent::fake([
        'Ship faster with a prompt workflow tuned for launch week.',
    ])->preventStrayPrompts();

    $this->postJson('/prompt-playground', [
        'prompt' => 'Write a launch-week one-liner for a prompt experimentation page.',
        'tone' => 'persuasive',
        'length' => 'brief',
        'temperature' => 0.35,
        'top_p' => 0.8,
        'model_profile' => 'draft',
    ])->assertSuccessful()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'prompt' => 'Write a launch-week one-liner for a prompt experimentation page.',
                'answer' => 'Ship faster with a prompt workflow tuned for launch week.',
                'settings' => [
                    'provider' => 'groq',
                    'tone' => 'persuasive',
                    'length' => 'brief',
                    'temperature' => 0.35,
                    'top_p' => 0.8,
                    'model_profile' => 'draft',
                    'model' => 'openai/gpt-oss-20b',
                ],
            ],
        ]);

    $entry = PromptPlaygroundEntry::query()->firstOrFail();

    expect($entry->prompt)->toBe('Write a launch-week one-liner for a prompt experimentation page.');
    expect($entry->response)->toBe('Ship faster with a prompt workflow tuned for launch week.');
    expect($entry->provider)->toBe('groq');
    expect($entry->model)->toBe('openai/gpt-oss-20b');
    expect($entry->tone)->toBe('persuasive');
    expect($entry->length)->toBe('brief');
    expect((float) $entry->temperature)->toBe(0.35);
    expect((float) $entry->top_p)->toBe(0.8);

    PromptPlaygroundAgent::assertPrompted(function (AgentPrompt $prompt): bool {
        return $prompt->prompt === 'Write a launch-week one-liner for a prompt experimentation page.'
            && $prompt->provider()->driver() === 'groq'
            && $prompt->model === 'openai/gpt-oss-20b'
            && $prompt->agent instanceof PromptPlaygroundAgent
            && $prompt->agent->temperature() === 0.35
            && $prompt->agent->topP() === 0.8;
    });
});

test('the prompt playground validates the prompt payload', function () {
    PromptPlaygroundAgent::fake()->preventStrayPrompts();

    $this->postJson('/prompt-playground', [
        'prompt' => 'short',
        'tone' => 'neutral',
        'length' => 'standard',
        'temperature' => 0.7,
        'top_p' => 0.9,
        'model_profile' => 'default',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['prompt']);

    PromptPlaygroundAgent::assertNeverPrompted();
});
