<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class CallToActionTool implements Tool
{
    public function name(): string
    {
        return 'call_to_action';
    }

    public function description(): Stringable|string
    {
        return 'Return deterministic call-to-action guidance for a selected conversion goal.';
    }

    public function handle(Request $request): Stringable|string
    {
        $goal = (string) $request['goal'];

        return match ($goal) {
            'demo' => 'CTA: Invite the reader to book a demo with their team and see the workflow live.',
            'launch' => 'CTA: Push for launch-day action with a direct line about shipping now and learning fast.',
            default => 'CTA: Ask the reader to create an account and start using the workflow immediately.',
        };
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'goal' => $schema
                ->string()
                ->enum(['signup', 'demo', 'launch'])
                ->description('The conversion goal the final copy should support.')
                ->required(),
        ];
    }
}
