<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ContentAnalyzer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    public function analyzeContent(Request $request)
    {
        $request->validate([
            'content' => 'required|string|min:20',
        ]);

        $agent = new ContentAnalyzer();
        $response = $agent->prompt($request->input('content'));

        $data = $response instanceof \Laravel\Ai\Responses\StructuredAgentResponse
            ? $response->toArray()
            : $agent->parseResponse($response->text);

        return response()->json([
            'status' => 'success',
            'data' => [
                'title' => $data['title'] ?? null,
                'category' => $data['category'] ?? null,
                'summary' => $data['summary'] ?? null,
                'tags' => $data['tags'] ?? [],
            ],
        ]);
    }
    public function analyzeAndSave(Request $request)
    {
        $request->validate([
            'content' => 'required|string|min:20',
        ]);

        // Instantiate and prompt the agent
        $agent = new ContentAnalyzer();

        // The SDK automatically loops through tool requests until the agent finishes
        $response = $agent->prompt($request->input('content'));

        return response()->json([
            'status' => 'completed',
            'agent_response' => $response
        ]);
    }
    public function analyzeSaveRemember(Request $request)
    {
        $request->validate([
            'content' => 'required|string|min:20',
        ]);

        // Instantiate and prompt the agent
        $agent = new ContentAnalyzer();

        // The SDK automatically loops through tool requests until the agent finishes
        $response = $agent->prompt($request->input('content'));

        return response()->json([
            'status' => 'completed',
            'agent_response' => $response
        ]);
    }
    public function analyzeAsync(Request $request)
    {
        $request->validate(['content' => 'required|string']);

        $response = (new ContentAnalyzer)->queue($request->input('content'));

        $response->then(function ($agentResponse) {
            Log::info('Background agent completed job successfully!', [
                'result' => (string) $agentResponse,
            ]);
        });

        return response()->json([
            'status' => 'processing',
            'message' => 'Analysis is running securely in the background.',
        ]);
    }
}
