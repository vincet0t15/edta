<?php

use App\Http\Controllers\OfficeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::prefix('offices')->name('offices.')->group(function () {
        Route::get('', [OfficeController::class, 'index'])->name('index');
        Route::post('', [OfficeController::class, 'store'])->name('store');
        Route::put('{office}', [OfficeController::class, 'update'])->name('update');
        Route::delete('{office}', [OfficeController::class, 'destroy'])->name('destroy');
    });
});
