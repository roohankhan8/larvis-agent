<?php

namespace App\Ai\Agents;

use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;

class ConversationLabAgent implements Agent, Conversational
{
    use Promptable;
    use RemembersConversations;

    public function instructions(): Stringable|string
    {
        return implode(' ', [
            'You are the Conversation Lab demo for the Laravel AI SDK.',
            'Answer naturally, using the prior conversation when it helps.',
            'Keep responses concise but helpful unless the user asks for depth.',
            'Do not mention memory mechanics or internal implementation details.',
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
}
