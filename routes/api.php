<?php

use App\Http\Controllers\Api\CategoryController;
use Illuminate\Support\Facades\Route;

Route::post('/analyze-content', [CategoryController::class, 'analyzeContent']);
Route::post('/analyze-and-save', [CategoryController::class, 'analyzeAndSave']);
Route::post('/analyze-save-remember', [CategoryController::class, 'analyzeSaveRemember']);
Route::post('/analyze-async', [CategoryController::class, 'analyzeAsync']);
