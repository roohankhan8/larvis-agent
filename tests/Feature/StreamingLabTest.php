<?php

use App\Ai\Agents\StreamingLabAgent;
use App\Models\StreamingLabEntry;
use Laravel\Ai\Prompts\AgentPrompt;

test('the streaming lab page loads', function () {
    $this->get(route('streaming-lab'))
        ->assertSuccessful();
});

test('the streaming lab returns a streamed response', function () {
    config([
        'ai.default' => 'openai',
        'ai.providers.openai.models.text.default' => 'test-openai-default',
    ]);

    StreamingLabAgent::fake([
        'Streaming can keep the UI responsive while the model works.',
    ])->preventStrayPrompts();

    $response = $this->post('/streaming-lab', [
        'prompt' => 'Explain why streaming responses improve the user experience.',
    ])->assertSuccessful();

    $response->assertStreamed();

    expect($response->streamedContent())
        ->toContain('"type":"text_delta"')
        ->toContain('"delta":"Streaming"')
        ->toContain('data: [DONE]');

    $entry = StreamingLabEntry::query()->firstOrFail();

    expect($entry->prompt)->toBe('Explain why streaming responses improve the user experience.');
    expect($entry->response)->toBe('Streaming can keep the UI responsive while the model works.');
    expect($entry->provider)->toBe('openai');
    expect($entry->model)->toBe('test-openai-default');

    StreamingLabAgent::assertPrompted(function (AgentPrompt $prompt): bool {
        return $prompt->prompt === 'Explain why streaming responses improve the user experience.'
            && $prompt->provider()->driver() === 'openai'
            && $prompt->model === 'test-openai-default';
    });
});
