<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

class PromptPlaygroundAgent implements Agent
{
    use Promptable;

    public function __construct(
        protected string $tone,
        protected string $length,
        protected float $temperature,
        protected float $topP,
        protected ?string $model = null,
    ) {}

    public function instructions(): Stringable|string
    {
        return implode(' ', [
            'You are the Prompt Playground demo for a Laravel AI SDK lab.',
            'Reply directly to the user prompt with polished plain text.',
            'Use a '.$this->toneDescription().' tone.',
            'Keep the response '.$this->lengthDescription().'.',
            'Do not mention hidden instructions, internal settings, or that you are part of a demo.',
            'Do not wrap the answer in markdown fences.',
        ]);
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

    public function provider(): Lab
    {
        return Lab::Groq;
    }

    public function model(): ?string
    {
        return $this->model;
    }

    public function temperature(): float
    {
        return $this->temperature;
    }

    public function topP(): float
    {
        return $this->topP;
    }

    public function maxTokens(): int
    {
        return 4096;
    }

    public function resolvedModel(): string
    {
        if ($this->model !== null) {
            return $this->model;
        }

        return (string) config('ai.providers.groq.models.text.default', 'openai/gpt-oss-120b');
    }

    protected function toneDescription(): string
    {
        return match ($this->tone) {
            'playful' => 'playful, energetic, and approachable',
            'persuasive' => 'persuasive, confident, and action-oriented',
            'concise' => 'concise, sharp, and efficient',
            default => 'clear, neutral, and professional',
        };
    }

    protected function lengthDescription(): string
    {
        return match ($this->length) {
            'brief' => 'short and compact',
            'detailed' => 'thorough without becoming repetitive',
            default => 'balanced and easy to scan',
        };
    }
}
