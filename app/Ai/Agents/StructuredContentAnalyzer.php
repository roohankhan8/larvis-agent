<?php

namespace App\Ai\Agents;

use App\Ai\Agents\Concerns\AnalyzesContent;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;

class StructuredContentAnalyzer implements Agent, HasStructuredOutput
{
    use AnalyzesContent;
    use Promptable;

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Define the structured output schema for the agent.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->required(),
            'category' => $schema->string()->required(),
            'summary' => $schema->string()->required(),
            'tags' => $schema->array()->items($schema->string())->required(),
        ];
    }
}
