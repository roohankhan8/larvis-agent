<?php

namespace App\Support;

use App\Models\ContentProject;

class ContentProjectWorkflow
{
    /**
     * @param  array<string, mixed>  $analysis
     */
    public function saveAnalysis(ContentProject $project, string $content, array $analysis): void
    {
        $project->update([
            'source_content' => $content,
            'title' => (string) ($analysis['title'] ?? $project->title),
            'content_type' => (string) ($analysis['category'] ?? $project->content_type),
            'latest_analysis' => $analysis,
            'status' => 'analyzed',
        ]);
    }

    /**
     * @param  array<string, mixed>  $settings
     */
    public function saveDraft(
        ContentProject $project,
        string $label,
        string $content,
        string $source,
        array $settings = [],
    ): void {
        $project->update([
            'model_settings' => array_filter([
                ...($project->model_settings ?? []),
                ...$settings,
            ], static fn (mixed $value): bool => $value !== null),
        ]);

        $project->pushDraft($label, $content, $source, $settings);
    }

    public function attachConversation(ContentProject $project, string $conversationId): void
    {
        $project->update([
            'conversation_id' => $conversationId,
            'status' => 'revising',
        ]);
    }

    public function saveFinal(ContentProject $project, string $content, string $label = 'Final pass'): void
    {
        $project->update([
            'final_output' => $content,
            'status' => 'finalized',
        ]);

        $project->pushDraft($label, $content, 'streaming-final');
    }
}
