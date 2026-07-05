<?php

namespace App\Http\Controllers\Concerns;

use App\Models\ContentProject;
use Illuminate\Http\Request;

trait InteractsWithContentProjects
{
    protected function resolveProject(Request $request): ?ContentProject
    {
        $projectId = $request->integer('project') ?: $request->integer('project_id');

        if ($projectId === 0) {
            return null;
        }

        return ContentProject::query()
            ->visibleTo($request)
            ->find($projectId);
    }

    /**
     * @return array<string, mixed>|null
     */
    protected function projectPayload(?ContentProject $project): ?array
    {
        if ($project === null) {
            return null;
        }

        return [
            'id' => $project->id,
            'title' => $project->title,
            'source_content' => $project->source_content,
            'content_type' => $project->content_type,
            'audience' => $project->audience,
            'tone' => $project->tone,
            'goal' => $project->goal,
            'status' => $project->status,
            'current_draft' => $project->current_draft,
            'latest_analysis' => $project->latest_analysis,
            'model_settings' => $project->model_settings,
            'drafts' => $project->drafts ?? [],
            'conversation_id' => $project->conversation_id,
            'final_output' => $project->final_output,
            'updated_at' => optional($project->updated_at)?->toIso8601String(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function recentProjects(Request $request): array
    {
        return ContentProject::query()
            ->visibleTo($request)
            ->latest('updated_at')
            ->limit(6)
            ->get()
            ->map(fn (ContentProject $project): array => $this->projectPayload($project))
            ->filter()
            ->values()
            ->all();
    }
}
