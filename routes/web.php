<?php

use App\Ai\Agents\ContentAnalyzer;
use App\Data\CategorizedContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('/hello', function () {
    return response()->json(['message' => 'Hello, World!']);
});
Route::post('/analyze-content', function (Request $request) {
    $request->validate([
        'content' => 'required|string|min:20',
    ]);

    // 1. Instantiate the agent
    $agent = new ContentAnalyzer;

    // 2. Pass the user input to the agent
    /** @var CategorizedContent $result */
    $result = $agent->prompt($request->input('content'));

    // 3. The $result is now a fully typed instance of your CategorizedContent DTO!
    return response()->json([
        'status' => 'success',
        'data' => [
            'title' => $result->title,
            'category' => $result->category,
            'summary' => $result->summary,
            'tags' => $result->tags,
        ],
    ]);
});
