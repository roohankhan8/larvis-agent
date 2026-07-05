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
        ->assertSee('Draft history for')
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
