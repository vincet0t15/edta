<?php

use App\Http\Controllers\RetentionPolicyController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::prefix('retention-policies')->name('retention-policies.')->group(function () {
        Route::get('', [RetentionPolicyController::class, 'index'])->name('index');
        Route::post('', [RetentionPolicyController::class, 'store'])->name('store');
        Route::put('{policy}', [RetentionPolicyController::class, 'update'])->name('update');
        Route::delete('{policy}', [RetentionPolicyController::class, 'destroy'])->name('destroy');
    });
});
