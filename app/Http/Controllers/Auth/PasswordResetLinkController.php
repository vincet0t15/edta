<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetLinkController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'login' => ['required', 'string'],
        ]);

        $login = $request->input('login');

        $user = User::where('username', $login)->first();

        if (! $user) {
            return back()->withErrors(['login' => 'No user found with that username']);
        }

        $token = Str::random(60);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['username' => $user->username],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        return back()->with('status', 'Password reset link has been sent to your registered email.');
    }
}
