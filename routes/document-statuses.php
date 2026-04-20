<?php

use App\Http\Controllers\DocumentStatusController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::prefix('document-statuses')->name('document-statuses.')->group(function () {
        Route::get('', [DocumentStatusController::class, 'index'])->name('index');
        Route::post('', [DocumentStatusController::class, 'store'])->name('store');
        Route::put('{status}', [DocumentStatusController::class, 'update'])->name('update');
        Route::delete('{status}', [DocumentStatusController::class, 'destroy'])->name('destroy');
    });
});
