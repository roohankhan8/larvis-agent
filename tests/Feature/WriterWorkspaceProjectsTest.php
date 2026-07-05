<?php

use App\Models\ContentProject;
use App\Models\User;

test('the project drafts page loads for the active project', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $project = ContentProject::factory()->create([
        'user_id' => $user->id,
        'drafts' => [
            [
                'id' => 'draft-1',
                'label' => 'Initial draft',
                'content' => 'First version of the landing page.',
                'source' => 'prompt-playground',
                'created_at' => now()->toIso8601String(),
                'metadata' => [],
            ],
        ],
    ]);

    $this->get(route('projects.drafts', $project))
        ->assertSuccessful()
        ->assertSee('Initial draft');
});

test('a project can be deleted from the workspace', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $project = ContentProject::factory()->create([
        'user_id' => $user->id,
    ]);

    $this->delete(route('projects.destroy', $project))
        ->assertRedirect(route('home'));

    expect(ContentProject::query()->whereKey($project->id)->exists())->toBeFalse();
});

test('a draft can be deleted from a project', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $project = ContentProject::factory()->create([
        'user_id' => $user->id,
        'drafts' => [
            [
                'id' => 'draft-1',
                'label' => 'Initial draft',
                'content' => 'First version of the landing page.',
                'source' => 'prompt-playground',
                'created_at' => now()->toIso8601String(),
                'metadata' => [],
            ],
            [
                'id' => 'draft-2',
                'label' => 'Second draft',
                'content' => 'Second version of the landing page.',
                'source' => 'prompt-playground',
                'created_at' => now()->toIso8601String(),
                'metadata' => [],
            ],
        ],
    ]);

    $this->delete(route('projects.drafts.destroy', [$project, 'draft-1']))
        ->assertRedirect();

    $project->refresh();

    expect($project->drafts)->toHaveCount(1);
    expect($project->drafts[0]['id'])->toBe('draft-2');
});
