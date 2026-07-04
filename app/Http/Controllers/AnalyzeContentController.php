<?php

namespace App\Http\Controllers;

use App\Ai\Agents\StructuredContentAnalyzer;
use App\Models\CategorizedPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Ai\Responses\StructuredAgentResponse;

class AnalyzeContentController extends Controller
{
    public function analyzeContent(Request $request): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|min:20',
        ]);

        $agent = new StructuredContentAnalyzer;
        $response = $agent->prompt($request->input('content'));

        $data = $response instanceof StructuredAgentResponse
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

    public function analyzeAndSave(Request $request): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|min:20',
        ]);

        $agent = new StructuredContentAnalyzer;
        $response = $agent->prompt($request->input('content'));

        $data = $response instanceof StructuredAgentResponse
            ? $response->toArray()
            : $agent->parseResponse($response->text);

        $post = CategorizedPost::create([
            'title' => (string) ($data['title'] ?? ''),
            'category' => (string) ($data['category'] ?? ''),
            'summary' => (string) ($data['summary'] ?? ''),
            'tags' => array_values(array_filter(
                (array) ($data['tags'] ?? []),
                static fn ($tag): bool => is_string($tag) && $tag !== '',
            )),
        ]);

        return response()->json([
            'status' => 'success',
            'post_id' => $post->id,
            'data' => [
                'title' => $post->title,
                'category' => $post->category,
                'summary' => $post->summary,
                'tags' => $post->tags,
            ],
        ]);
    }
}
