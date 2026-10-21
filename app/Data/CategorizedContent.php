<?php

namespace App\Data;

class CategorizedContent
{
    /**
     * @param  array<int, string>  $tags
     */
    public function __construct(
        public string $title,
        public string $category,
        public array $tags,
        public string $summary
    ) {}
}
