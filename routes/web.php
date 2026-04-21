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

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentWorkflowController;

Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::get('/documents/create', [DocumentController::class, 'create'])->name('documents.create');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::get('/documents/{document}/edit', [DocumentController::class, 'edit'])->name('documents.edit');
    Route::put('/documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // workflow
    Route::post('/documents/{document}/transition', [DocumentWorkflowController::class, 'transition'])->name('documents.transition');
});

// attachments
use App\Http\Controllers\DocumentAttachmentController;
Route::post('/documents/{document}/attachments', [DocumentAttachmentController::class, 'upload'])->name('documents.attachments.upload');
Route::get('/documents/{document}/attachments/{attachment}/download', [DocumentAttachmentController::class, 'download'])->name('documents.attachments.download');
