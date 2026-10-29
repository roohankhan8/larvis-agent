<?php

use App\Ai\Agents\ContentAnalyzer;
use App\Ai\Agents\StructuredContentAnalyzer;
use Laravel\Ai\Prompts\AgentPrompt;

it('returns structured analysis data without prompting the tool-enabled agent', function () {
    config([
        'ai.default' => 'openai',
        'ai.providers.openai.models.text.default' => 'test-openai-default',
    ]);

    StructuredContentAnalyzer::fake([
        [
            'title' => 'AI Reshapes Editorial Workflows',
            'category' => 'Technology',
            'summary' => 'AI tools are changing how editorial teams classify and summarize written content.',
            'tags' => ['ai', 'editorial', 'automation'],
        ],
    ])->preventStrayPrompts();

    $response = $this->postJson('/api/analyze-content', [
        'content' => 'Artificial intelligence is helping editorial teams classify articles, generate summaries, and organize content with much less manual effort than before.',
    ]);

    $response->assertOk()->assertJson([
        'status' => 'success',
        'data' => [
            'title' => 'AI Reshapes Editorial Workflows',
            'category' => 'Technology',
            'summary' => 'AI tools are changing how editorial teams classify and summarize written content.',
            'tags' => ['ai', 'editorial', 'automation'],
        ],
    ]);

    StructuredContentAnalyzer::assertPrompted(fn (AgentPrompt $prompt): bool =>
        $prompt->provider()->driver() === 'openai'
        && $prompt->model === 'test-openai-default'
    );
    ContentAnalyzer::assertNeverPrompted();
});
