<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'testuser',
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Seed document tracking configuration data
        $this->call([
            DocumentStatusSeeder::class,
            DocumentPrioritySeeder::class,
            DocumentCategorySeeder::class,
            RetentionPolicySeeder::class,
        ]);
    }
}
