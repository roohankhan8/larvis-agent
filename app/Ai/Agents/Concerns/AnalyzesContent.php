<?php

namespace App\Ai\Agents\Concerns;

use Stringable;

trait AnalyzesContent
{
    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return 'You are an elite editorial assistant. Analyze the provided text, generate a clean title, pick a fitting category, summarize it in one sentence, and provide relevant search tags.';
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
