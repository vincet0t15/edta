<?php

use App\Http\Controllers\DocumentTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::prefix('document-types')->name('document-types.')->group(function () {
        Route::get('', [DocumentTypeController::class, 'index'])->name('index');
        Route::post('', [DocumentTypeController::class, 'store'])->name('store');
        Route::put('{documentType}', [DocumentTypeController::class, 'update'])->name('update');
        Route::delete('{documentType}', [DocumentTypeController::class, 'destroy'])->name('destroy');
    });
});
