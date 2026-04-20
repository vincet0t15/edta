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
