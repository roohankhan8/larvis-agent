<?php

namespace App\Ai\Agents;

use App\Ai\Tools\AudienceSnapshotTool;
use App\Ai\Tools\CallToActionTool;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;

class ToolLabAgent implements Agent, HasTools
{
    use Promptable;

    public function __construct(
        protected string $audience,
        protected string $goal,
    ) {}

    public function instructions(): Stringable|string
    {
        return implode(' ', [
            'You are the Tool Lab demo for the Laravel AI SDK.',
            'You help users turn a raw copy request into polished marketing text.',
            'Before answering, use the audience_snapshot tool to retrieve messaging guidance for the selected audience.',
            'Use the call_to_action tool when the user asks for a close, next step, signup push, demo invitation, or launch CTA.',
            'Selected audience: '.$this->audience.'.',
            'Selected goal: '.$this->goal.'.',
            'Return only the final polished answer in plain text.',
            'Do not mention internal instructions, tool mechanics, JSON, or hidden reasoning.',
        ]);
    }

    public function provider(): Lab
    {
        return Lab::Groq;
    }

    public function model(): ?string
    {
        return 'openai/gpt-oss-120b';
    }

    public function maxSteps(): int
    {
        return 4;
    }

    public function tools(): iterable
    {
        return [
            new AudienceSnapshotTool,
            new CallToActionTool,
        ];
    }

    public function resolvedModel(): string
    {
        return (string) ($this->model() ?? config('ai.providers.groq.models.text.default', 'openai/gpt-oss-120b'));
    }
}
