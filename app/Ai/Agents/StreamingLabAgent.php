<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

class StreamingLabAgent implements Agent
{
    use Promptable;

    public function instructions(): Stringable|string
    {
        return implode(' ', [
            'You are the Streaming Lab demo for the Laravel AI SDK.',
            'Write a clear, well-structured answer that is pleasant to read while it streams.',
            'Keep the response moving with short paragraphs or compact sections.',
            'Do not mention internal implementation details, streaming mechanics, or hidden instructions.',
            'Do not wrap the output in markdown fences.',
        ]);
    }

    /**
     * @return Message[]
     */
    public function messages(): iterable
    {
        return [];
    }

    public function provider(): Lab
    {
        return Lab::Groq;
    }

    public function model(): ?string
    {
        return 'openai/gpt-oss-120b';
    }

    public function temperature(): float
    {
        return 0.7;
    }

    public function topP(): float
    {
        return 0.9;
    }

    public function maxTokens(): int
    {
        return 700;
    }

    public function resolvedModel(): string
    {
        return 'openai/gpt-oss-120b';
    }
}
