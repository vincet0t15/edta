<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

Route::get('/login', function () { return inertia('auth/login'); })->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.store');

Route::get('/register', [RegisterController::class, 'create'])->name('register');
Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

Route::get('/password/reset', function () { return inertia('auth/forgot-password'); })->name('password.request');
Route::post('/password/email', [PasswordResetLinkController::class, 'send'])->name('password.email');

Route::get('/password/reset/{token}', function () { return inertia('auth/reset-password'); })->name('password.reset');
Route::post('/password/reset', function () { return redirect()->route('login'); })->name('password.update');
