<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class PasswordResetLinkController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'login' => ['required', 'string'],
        ]);

        $login = $request->input('login');

        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        if (! $user) {
            return back()->withErrors(['login' => 'No user found with that username or email']);
        }

        $status = Password::sendResetLink(['email' => $user->email]);

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['login' => __($status)]);
    }
}
