<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromptPlaygroundEntry extends Model
{
    protected $fillable = [
        'prompt',
        'response',
        'provider',
        'model',
        'tone',
        'length',
        'temperature',
        'top_p',
    ];

    protected function casts(): array
    {
        return [
            'temperature' => 'decimal:2',
            'top_p' => 'decimal:2',
        ];
    }
}
