<?php

use App\Ai\Agents\ContentAnalyzer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Laravel\Ai\Responses\StructuredAgentResponse;

Route::post('/analyze-content', function (Request $request) {
    $request->validate([
        'content' => 'required|string|min:20',
    ]);

    $agent = new ContentAnalyzer;
    $response = $agent->prompt($request->input('content'));

    Log::info('Raw Agent Response', ['response' => $response]);

    $data = $response instanceof StructuredAgentResponse
        ? $response->toArray()
        : $agent->parseResponse($response->text);

    Log::info('Analyzed Content', $data);

    return response()->json([
        'status' => 'success',
        'data' => [
            'title' => $data['title'] ?? null,
            'category' => $data['category'] ?? null,
            'summary' => $data['summary'] ?? null,
            'tags' => $data['tags'] ?? [],
        ],
    ]);
});
