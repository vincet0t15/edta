<?php

use App\Http\Controllers\DocumentPriorityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::prefix('document-priorities')->name('document-priorities.')->group(function () {
        Route::get('', [DocumentPriorityController::class, 'index'])->name('index');
        Route::post('', [DocumentPriorityController::class, 'store'])->name('store');
        Route::put('{priority}', [DocumentPriorityController::class, 'update'])->name('update');
        Route::delete('{priority}', [DocumentPriorityController::class, 'destroy'])->name('destroy');
    });
});
