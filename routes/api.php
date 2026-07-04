<?php

use App\Http\Controllers\Api\AnalyzeContentController;
use Illuminate\Support\Facades\Route;

Route::post('/analyze-content', [AnalyzeContentController::class, 'analyzeContent']);
Route::post('/analyze-and-save', [AnalyzeContentController::class, 'analyzeAndSave']);
Route::post('/analyze-save-remember', [AnalyzeContentController::class, 'analyzeSaveRemember']);
Route::post('/analyze-async', [AnalyzeContentController::class, 'analyzeAsync']);
