<?php

use App\Http\Controllers\AnalyzeContentController;
use App\Http\Controllers\ConversationLabController;
use App\Http\Controllers\PromptPlaygroundController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/analyze-content', 'AnalyzeContent')->name('analyze-content');
Route::post('/analyze-content', [AnalyzeContentController::class, 'analyzeContent']);
Route::post('/analyze-and-save', [AnalyzeContentController::class, 'analyzeAndSave']);
Route::get('/prompt-playground', [PromptPlaygroundController::class, 'index'])->name('prompt-playground');
Route::post('/prompt-playground', [PromptPlaygroundController::class, 'generate']);
Route::get('/conversation-lab', [ConversationLabController::class, 'index'])->name('conversation-lab');
Route::post('/conversation-lab', [ConversationLabController::class, 'respond']);
