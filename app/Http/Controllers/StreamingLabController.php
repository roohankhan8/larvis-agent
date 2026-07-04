<?php

namespace App\Http\Controllers;

use App\Ai\Agents\StreamingLabAgent;
use App\Models\StreamingLabEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Ai\Responses\StreamableAgentResponse;
use Laravel\Ai\Responses\StreamedAgentResponse;

class StreamingLabController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('StreamingLab');
    }

    public function stream(Request $request): StreamableAgentResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'min:10', 'max:4000'],
        ]);

        $agent = new StreamingLabAgent;

        return $agent
            ->stream($validated['prompt'])
            ->then(function (StreamedAgentResponse $response) use ($agent, $validated): void {
                StreamingLabEntry::create([
                    'prompt' => $validated['prompt'],
                    'response' => trim($response->text),
                    'provider' => 'groq',
                    'model' => $agent->resolvedModel(),
                ]);
            });
    }
}
