<?php

namespace App\Actions\Fortify;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\ResetsUserPasswords;

class ResetUserPassword implements ResetsUserPasswords
{
    /**
     * Validate and reset the user's password.
     *
     * @param  array<string, string>  $input
     */
    public function reset(array $input): void
    {
        Validator::make($input, [
            'token' => ['required', 'string'],
            'login' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ])->validate();

        // Find user by username or email
        $user = \App\Models\User::where('username', $input['login'])
            ->orWhere('email', $input['login'])
            ->firstOrFail();

        $user->password = $input['password'];
        $user->save();
    }
}
