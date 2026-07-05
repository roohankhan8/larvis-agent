<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class AudienceSnapshotTool implements Tool
{
    public function name(): string
    {
        return 'audience_snapshot';
    }

    public function description(): Stringable|string
    {
        return 'Look up deterministic messaging guidance for a target audience before writing the final response.';
    }

    public function handle(Request $request): Stringable|string
    {
        $audience = (string) $request['audience'];

        return match ($audience) {
            'developers' => implode(' ', [
                'Audience: developers.',
                'Priorities: technical credibility, implementation control, and reduced busywork.',
                'Useful language: API-first, observable, composable, production-ready.',
                'Avoid hype and vague promises.',
            ]),
            'marketers' => implode(' ', [
                'Audience: marketers.',
                'Priorities: campaign speed, message clarity, and measurable conversion lift.',
                'Useful language: launch faster, test messaging, move qualified traffic.',
                'Keep the tone energetic and outcome-focused.',
            ]),
            default => implode(' ', [
                'Audience: founders.',
                'Priorities: speed to market, leverage, and business clarity.',
                'Useful language: ship faster, focus the team, prove value quickly.',
                'Keep the message decisive and commercially sharp.',
            ]),
        };
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'audience' => $schema
                ->string()
                ->enum(['founders', 'developers', 'marketers'])
                ->description('The intended audience segment for the generated copy.')
                ->required(),
        ];
    }
}
