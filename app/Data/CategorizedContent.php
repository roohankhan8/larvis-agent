<?php

namespace App\Data;

class CategorizedContent
{
    public function __construct(
        public string $title,
        public string $category,
        public array $tags,
        public string $summary
    ) {}
}
