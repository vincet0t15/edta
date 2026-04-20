<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $login = $request->input('username');

        // Find user by username or email
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        // Check if user exists
        if (!$user) {
            return back()->withErrors(['username' => trans('auth.failed')])->onlyInput('username');
        }

        // Check if account is active
        if (!$user->is_active) {
            return back()->withErrors(['username' => 'This account has been deactivated. Please contact support.'])->onlyInput('username');
        }

        // Attempt authentication
        $credentials = filter_var($login, FILTER_VALIDATE_EMAIL)
            ? ['email' => $login, 'password' => $request->input('password')]
            : ['username' => $login, 'password' => $request->input('password')];

        if (Auth::attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(config('fortify.home'));
        }

        return back()->withErrors(['username' => trans('auth.failed')])->onlyInput('username');
    }
}
