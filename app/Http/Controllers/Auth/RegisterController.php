<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Fortify\CreateNewUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class RegisterController extends Controller
{
    /**
     * Show the registration view.
     */
    public function create()
    {
        return Inertia::render('auth/register');
    }

    /**
     * Store a newly registered user.
     */
    public function store(Request $request)
    {
        $creator = app(CreateNewUser::class);
        $user = $creator->create($request->all());

        // Redirect to login with success message
        return redirect('/login')->with('status', 'Registration successful! Please log in with your username.');
    }
}
