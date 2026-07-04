<?php

use App\Http\Controllers\AnalyzeContentController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/analyze-content', 'AnalyzeContent')->name('analyze-content');
Route::post('/analyze-content', [AnalyzeContentController::class, 'analyzeContent']);
Route::post('/analyze-and-save', [AnalyzeContentController::class, 'analyzeAndSave']);
