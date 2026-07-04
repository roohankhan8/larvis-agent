<?php

use App\Ai\Agents\ContentAnalyzer;
use App\Data\CategorizedContent;
use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/analyze-content', ['AnalyzeContent'])->name('analyze-content');
