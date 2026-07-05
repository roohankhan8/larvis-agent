<?php

namespace Database\Factories;

use App\Models\ContentProject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContentProject>
 */
class ContentProjectFactory extends Factory
{
    protected $model = ContentProject::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'source_content' => fake()->paragraphs(3, true),
            'content_type' => fake()->randomElement(['blog-post', 'landing-page', 'email']),
            'audience' => fake()->randomElement(['founders', 'developers', 'marketers']),
            'tone' => fake()->randomElement(['neutral', 'concise', 'persuasive']),
            'goal' => fake()->randomElement(['signup', 'demo', 'launch']),
            'status' => 'brief',
            'current_draft' => null,
            'latest_analysis' => null,
            'model_settings' => null,
            'drafts' => [],
            'conversation_id' => null,
            'final_output' => null,
        ];
    }
}
