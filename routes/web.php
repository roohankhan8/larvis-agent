<?php

use App\Http\Controllers\AnalyzeContentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationLabController;
use App\Http\Controllers\PromptPlaygroundController;
use App\Http\Controllers\StreamingLabController;
use App\Http\Controllers\ToolLabController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/analyze-content', 'AnalyzeContent')->name('analyze-content');
Route::post('/analyze-content', [AnalyzeContentController::class, 'analyzeContent']);
Route::post('/analyze-and-save', [AnalyzeContentController::class, 'analyzeAndSave']);

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthController::class, 'createLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'storeLogin']);
    Route::get('/register', [AuthController::class, 'createRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'storeRegister']);
});

Route::post('/logout', [AuthController::class, 'destroy'])->middleware('auth')->name('logout');

Route::get('/prompt-playground', [PromptPlaygroundController::class, 'index'])->name('prompt-playground');
Route::post('/prompt-playground', [PromptPlaygroundController::class, 'generate']);
Route::get('/conversation-lab', [ConversationLabController::class, 'index'])->name('conversation-lab');
Route::post('/conversation-lab', [ConversationLabController::class, 'respond']);
Route::get('/tool-lab', [ToolLabController::class, 'index'])->name('tool-lab');
Route::post('/tool-lab', [ToolLabController::class, 'generate']);
Route::get('/streaming-lab', [StreamingLabController::class, 'index'])->name('streaming-lab');
Route::post('/streaming-lab', [StreamingLabController::class, 'stream']);
