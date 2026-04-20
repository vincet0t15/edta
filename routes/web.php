<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Protected routes - require auth, verified, and active account
Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// Load authentication routes
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/offices.php';
require __DIR__ . '/document-types.php';
require __DIR__ . '/document-statuses.php';
require __DIR__ . '/document-priorities.php';
require __DIR__ . '/document-categories.php';
require __DIR__ . '/retention-policies.php';
require __DIR__ . '/sla-configurations.php';
require __DIR__ . '/routing-rules.php';
