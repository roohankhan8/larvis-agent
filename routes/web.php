<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/analyze-content', 'AnalyzeContent')->name('analyze-content');
