<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    public function showResetForm(Request $request, $token)
    {
        $username = $request->query('username');

        if (!$username) {
            return redirect()->route('password.request');
        }

        return Inertia::render('auth/reset-password', [
            'token' => $token,
            'username' => $username,
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'username' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $passwordReset = DB::table('password_reset_tokens')
            ->where('username', $request->username)
            ->first();

        if (!$passwordReset || !Hash::check($request->token, $passwordReset->token)) {
            return back()->withErrors(['token' => 'Invalid or expired token']);
        }

        $user = \App\Models\User::where('username', $request->username)->first();

        if (!$user) {
            return back()->withErrors(['username' => 'User not found']);
        }

        $user->password = $request->password;
        $user->save();

        DB::table('password_reset_tokens')->where('username', $request->username)->delete();

        return redirect()->route('login')->with('status', 'Password has been reset successfully. Please log in.');
    }
}
