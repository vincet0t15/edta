<?php

use App\Http\Controllers\SLAConfigurationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::prefix('sla-configurations')->name('sla-configurations.')->group(function () {
        Route::get('', [SLAConfigurationController::class, 'index'])->name('index');
        Route::post('', [SLAConfigurationController::class, 'store'])->name('store');
        Route::put('{slaConfiguration}', [SLAConfigurationController::class, 'update'])->name('update');
        Route::delete('{slaConfiguration}', [SLAConfigurationController::class, 'destroy'])->name('destroy');
    });
});
