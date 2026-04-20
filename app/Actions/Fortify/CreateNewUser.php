<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => $this->nameRules(),
            'username' => $this->usernameRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        // If the frontend does not provide an email, generate a unique placeholder
        $email = $input['email'] ?? ($input['username'] . '@no-email.local');

        return User::create([
            'name' => $input['name'],
            'username' => $input['username'],
            'password' => $input['password'],
            'is_active' => false, // Set to false by default, admin can activate later
        ]);
    }
}
