<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ContentAnalyzer;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'content' => 'required|string|min:20',
        ]);

        $agent = new ContentAnalyzer;

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
    }
}
