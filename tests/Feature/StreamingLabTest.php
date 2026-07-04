<?php

use App\Ai\Agents\StreamingLabAgent;
use App\Models\StreamingLabEntry;

test('the streaming lab page loads', function () {
    $this->get(route('streaming-lab'))
        ->assertSuccessful();
});

test('the streaming lab returns a streamed response', function () {
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
    expect($entry->provider)->toBe('groq');
    expect($entry->model)->toBe('openai/gpt-oss-120b');

    StreamingLabAgent::assertPrompted('Explain why streaming responses improve the user experience.');
});
