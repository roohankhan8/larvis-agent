<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategorizedPost extends Model
{
    protected $fillable = ['title', 'category', 'tags', 'summary'];
    protected $casts = ['tags' => 'array'];
}
