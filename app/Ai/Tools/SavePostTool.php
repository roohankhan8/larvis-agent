<?php

namespace App\Ai\Tools;

use App\Models\CategorizedPost;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Image;
use Laravel\Ai\Tools\Request;
use Stringable;

class SavePostTool implements Tool
{
    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'Saves the fully processed and analyzed content metadata into the database storage layer.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        // // 1. Generate a contextual image using the SDK's image wrapper
        // $generatedImage = Image::of("A professional minimalist digital art banner representing the concept of: {$request['title']}")
        //     ->landscape()
        //     ->quality('high')
        //     ->generate();

        // // 2. Store it to public storage disk instantly
        // $imagePath = $generatedImage->store('blog-banners', 'public');

        // 3. Persist the database record alongside our new image path
        $post = CategorizedPost::create([
            'title'       => $request['title'],
            'category'    => $request['category'],
            'summary'     => $request['summary'],
            'tags'        => $request['tags'],
            // 'banner_path' => $imagePath, // Add this column to your migration
        ]);

        return "Saved post ID: {$post->id} with dynamic image at storage";
    }

    /**
     * Get the tool's schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'title'    => $schema->string()->description('The structured clean title.')->required(),
            'category' => $schema->string()->description('The main target category.')->required(),
            'summary'  => $schema->string()->description('The single-sentence summary.')->required(),
            'tags'     => $schema->array()->items($schema->string())->description('Array of string tags.')->required(),
        ];
    }
}
