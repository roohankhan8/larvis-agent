<?php

namespace App\Ai\Agents;

use App\Ai\Agents\Concerns\AnalyzesContent;
use App\Ai\Tools\SavePostImageTool;
use App\Ai\Tools\SavePostTool;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Promptable;
use Stringable;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;

class ContentAnalyzer implements Agent, HasTools
{
    use AnalyzesContent;
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return 'You are an elite editorial assistant. Analyze the provided text, generate a clean title, pick a fitting category, summarize it in one sentence, and provide relevant search tags.';
    }

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
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            new SavePostTool(),
            // new SavePostImageTool(),
        ];
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
            'tags' => $schema->array()->required(),
        ];
    }

    /**
     * Parse the model's text response into the expected content fields.
     *
     * @return array{title: ?string, category: ?string, summary: ?string, tags: array<int, string>}
     */
    public function parseResponse(string $text): array
    {
        $data = [
            'title' => null,
            'category' => null,
            'summary' => null,
            'tags' => [],
        ];

        if (preg_match('/^\s*\{.*\}\s*$/s', $text)) {
            $decoded = json_decode($text, true);

            if (is_array($decoded)) {
                $data['title'] = $decoded['title'] ?? null;
                $data['category'] = $decoded['category'] ?? null;
                $data['summary'] = $decoded['summary'] ?? null;
                $data['tags'] = array_values(array_filter((array) ($decoded['tags'] ?? []), 'is_string'));

                return $data;
            }
        }

        foreach (preg_split('/\R/', trim($text)) as $line) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            if (preg_match('/^\*\*(Title|Category|Search Tags):\*\*\s*(.+)$/iu', $line, $matches)) {
                $value = trim($matches[2]);

                if (strtolower($matches[1]) === 'title') {
                    $data['title'] = $value;
                } elseif (strtolower($matches[1]) === 'search tags') {
                    $data['tags'] = array_values(array_filter(array_map(
                        fn (string $tag): string => trim(ltrim($tag, '#')),
                        preg_split('/\s+/', $value) ?: []
                    )));
                }

                continue;
            }

            if (preg_match('/^\*\*(One[-\s]sentence Summary):\*\*\s*(.+)$/iu', $line, $matches)) {
                $data['summary'] = trim($matches[2]);

                continue;
            }

            if (preg_match('/^\*\*(Category):\*\*\s*(.+)$/iu', $line, $matches)) {
                $data['category'] = trim($matches[2]);
            }
        }

        return $data;
    }
}
