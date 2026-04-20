<?php

use App\Http\Controllers\RoutingRuleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'check-account-active'])->group(function () {
    Route::prefix('routing-rules')->name('routing-rules.')->group(function () {
        Route::get('', [RoutingRuleController::class, 'index'])->name('index');
        Route::post('', [RoutingRuleController::class, 'store'])->name('store');
        Route::put('{routingRule}', [RoutingRuleController::class, 'update'])->name('update');
        Route::delete('{routingRule}', [RoutingRuleController::class, 'destroy'])->name('destroy');
    });
});
