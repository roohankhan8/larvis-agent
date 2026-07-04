<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StreamingLabEntry extends Model
{
    protected $fillable = [
        'prompt',
        'response',
        'provider',
        'model',
    ];
}
