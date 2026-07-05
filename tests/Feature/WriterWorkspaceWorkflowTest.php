<?php

use App\Ai\Agents\ConversationLabAgent;
use App\Ai\Agents\PromptPlaygroundAgent;
use App\Ai\Agents\StreamingLabAgent;
use App\Ai\Agents\StructuredContentAnalyzer;
use App\Models\ContentProject;
use App\Models\User;
use Laravel\Ai\Models\Conversation;

test('guests can create a writer project from the workspace', function () {
    $response = $this->post(route('projects.store'), [
        'title' => 'Launch brief',
        'source_content' => 'This quarter we need sharper launch copy that connects product positioning, proof points, and a clear call to action for trial signups.',
        'content_type' => 'landing page',
        'audience' => 'marketers',
        'tone' => 'persuasive',
        'goal' => 'signup',
    ]);

    $project = ContentProject::query()->firstOrFail();

    $response->assertRedirect(route('home', ['project' => $project->id]));

    expect($project->title)->toBe('Launch brief');
    expect($project->status)->toBe('brief');
    expect($project->audience)->toBe('marketers');
});

test('analysis can be saved back into a shared content project', function () {
    StructuredContentAnalyzer::fake([
        [
            'title' => 'Sharper Product Launch Copy',
            'category' => 'landing page',
            'summary' => 'A project focused on clarifying product messaging for launch.',
            'tags' => ['launch', 'copy', 'positioning'],
        ],
    ])->preventStrayPrompts();

    $user = User::factory()->create();
    $this->actingAs($user);

    $project = ContentProject::factory()->create([
        'user_id' => $user->id,
        'title' => 'Launch brief',
        'source_content' => 'We need sharper launch messaging for our product homepage and conversion path.',
    ]);

    $this->postJson('/analyze-and-save', [
        'project_id' => $project->id,
        'content' => 'We need sharper launch messaging for our product homepage and conversion path.',
    ])->assertSuccessful()
        ->assertJsonPath('project.id', $project->id)
        ->assertJsonPath('project.title', 'Sharper Product Launch Copy');

    $project->refresh();

    expect($project->title)->toBe('Sharper Product Launch Copy');
    expect($project->status)->toBe('analyzed');
    expect($project->latest_analysis['tags'])->toBe(['launch', 'copy', 'positioning']);
});

test('prompt playground saves generated drafts into the project', function () {
    PromptPlaygroundAgent::fake([
        'A tighter launch message with a clear reason to try the product today.',
    ])->preventStrayPrompts();

    $user = User::factory()->create();
    $this->actingAs($user);

    $project = ContentProject::factory()->create([
        'user_id' => $user->id,
        'title' => 'Launch brief',
    ]);

    $this->postJson('/prompt-playground', [
        'project_id' => $project->id,
        'prompt' => 'Rewrite this launch brief into a stronger homepage message.',
        'tone' => 'persuasive',
        'length' => 'brief',
        'temperature' => 0.4,
        'top_p' => 0.85,
        'model_profile' => 'draft',
    ])->assertSuccessful()
        ->assertJsonPath('project.id', $project->id);

    $project->refresh();

    expect($project->current_draft)->toBe('A tighter launch message with a clear reason to try the product today.');
    expect($project->drafts)->toHaveCount(1);
    expect($project->model_settings['model_profile'])->toBe('draft');
});

test('conversation lab binds the conversation thread to the project', function () {
    config(['ai.conversations.generate_title' => false]);

    ConversationLabAgent::fake([
        'Here is a revised version with clearer positioning and a stronger first sentence.',
    ])->preventStrayPrompts();

    $user = User::factory()->create();
    $this->actingAs($user);

    $project = ContentProject::factory()->create([
        'user_id' => $user->id,
        'title' => 'Launch brief',
    ]);

    $response = $this->postJson('/conversation-lab', [
        'project_id' => $project->id,
        'message' => 'Revise the current launch draft for stronger clarity.',
    ])->assertSuccessful();

    $conversationId = $response->json('data.conversation_id');

    expect($conversationId)->toBeString();
    expect(Conversation::query()->whereKey($conversationId)->exists())->toBeTrue();

    $project->refresh();

    expect($project->conversation_id)->toBe($conversationId);
    expect($project->drafts)->toHaveCount(1);
});

test('streaming finalization saves the completed output to the project', function () {
    StreamingLabAgent::fake([
        'This is the finished streamed version of the launch announcement.',
    ])->preventStrayPrompts();

    $user = User::factory()->create();
    $this->actingAs($user);

    $project = ContentProject::factory()->create([
        'user_id' => $user->id,
        'title' => 'Launch brief',
    ]);

    $response = $this->post('/streaming-lab', [
        'project_id' => $project->id,
        'prompt' => 'Create the final launch announcement for this project.',
    ])->assertSuccessful();

    $response->assertStreamed();
    $response->streamedContent();

    $project->refresh();

    expect($project->final_output)->toBe('This is the finished streamed version of the launch announcement.');
    expect($project->status)->toBe('finalized');
    expect($project->drafts)->toHaveCount(1);
});
