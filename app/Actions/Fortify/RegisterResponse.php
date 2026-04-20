<?php

namespace App\Actions\Fortify;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): Response|RedirectResponse|JsonResponse
    {
        // Instead of redirecting to login or dashboard, render a success message or stay on register page
        // Option 1: Redirect to a success page with message
        return redirect('/register')->with('status', 'Registration successful! Please log in with your username.');

        // Option 2: Return to dashboard (if auto-login is enabled):
        // return redirect(config('fortify.home'));
    }
}
