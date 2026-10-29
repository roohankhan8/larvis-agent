<?php

use App\Ai\Agents\PromptPlaygroundAgent;
use App\Models\PromptPlaygroundEntry;
use Illuminate\Support\Env;
use Inertia\Testing\AssertableInertia;
use Laravel\Ai\Prompts\AgentPrompt;

test('AI provider and default model can be configured from environment variables', function () {
    $environment = Env::getRepository();
    $previousProvider = $environment->get('AI_PROVIDER');
    $previousModel = $environment->get('AI_MODEL');

    $environment->clear('AI_PROVIDER');
    $environment->clear('AI_MODEL');
    $environment->set('AI_PROVIDER', 'openai');
    $environment->set('AI_MODEL', 'test-openai-model');

    try {
        $aiConfiguration = require config_path('ai.php');

        expect($aiConfiguration['default'])->toBe('openai')
            ->and(data_get($aiConfiguration, 'providers.openai.models.text.default'))
            ->toBe('test-openai-model');
    } finally {
        $environment->clear('AI_PROVIDER');
        $environment->clear('AI_MODEL');

        if ($previousProvider !== null) {
            $environment->set('AI_PROVIDER', $previousProvider);
        }

        if ($previousModel !== null) {
            $environment->set('AI_MODEL', $previousModel);
        }
    }
});

test('the prompt playground page loads', function () {
    config(['ai.default' => 'openai']);

    $this->get(route('prompt-playground'))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('PromptPlayground')
            ->where('aiProvider', 'OpenAI')
        );
});

test('the prompt playground uses the configured provider and its cheaper text model', function () {
    config([
        'ai.default' => 'openai',
        'ai.providers.openai.models.text.cheapest' => 'test-openai-cheapest',
        'ai.providers.openai.models.text.default' => 'test-openai-default',
        'ai.providers.openai.models.text.smartest' => 'test-openai-smartest',
    ]);

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
                    'provider' => 'openai',
                    'tone' => 'persuasive',
                    'length' => 'brief',
                    'temperature' => 0.35,
                    'top_p' => 0.8,
                    'model_profile' => 'draft',
                    'model' => 'test-openai-cheapest',
                ],
            ],
        ]);

    $entry = PromptPlaygroundEntry::query()->firstOrFail();

    expect($entry->prompt)->toBe('Write a launch-week one-liner for a prompt experimentation page.');
    expect($entry->response)->toBe('Ship faster with a prompt workflow tuned for launch week.');
    expect($entry->provider)->toBe('openai');
    expect($entry->model)->toBe('test-openai-cheapest');
    expect($entry->tone)->toBe('persuasive');
    expect($entry->length)->toBe('brief');
    expect((float) $entry->temperature)->toBe(0.35);
    expect((float) $entry->top_p)->toBe(0.8);

    PromptPlaygroundAgent::assertPrompted(function (AgentPrompt $prompt): bool {
        return $prompt->prompt === 'Write a launch-week one-liner for a prompt experimentation page.'
            && $prompt->provider()->driver() === 'openai'
            && $prompt->model === 'test-openai-cheapest'
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
