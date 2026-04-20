<?php

use App\Http\Controllers\DocumentCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::prefix('document-categories')->name('document-categories.')->group(function () {
        Route::get('', [DocumentCategoryController::class, 'index'])->name('index');
        Route::post('', [DocumentCategoryController::class, 'store'])->name('store');
        Route::put('{category}', [DocumentCategoryController::class, 'update'])->name('update');
        Route::delete('{category}', [DocumentCategoryController::class, 'destroy'])->name('destroy');
    });
});
