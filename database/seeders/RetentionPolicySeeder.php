<?php

namespace Database\Seeders;

use App\Models\RetentionPolicy;
use Illuminate\Database\Seeder;

class RetentionPolicySeeder extends Seeder
{
    public function run(): void
    {
        $policies = [
            [
                'code' => 'STANDARD',
                'name' => 'Standard',
                'description' => 'Archive after 1 year, delete after 7 years',
                'archive_after_months' => 12,
                'delete_after_years' => 7,
                'is_permanent' => false,
            ],
            [
                'code' => 'SHORT_TERM',
                'name' => 'Short-term',
                'description' => 'Archive after 3 months, delete after 1 year',
                'archive_after_months' => 3,
                'delete_after_years' => 1,
                'is_permanent' => false,
            ],
            [
                'code' => 'LONG_TERM',
                'name' => 'Long-term',
                'description' => 'Archive after 3 years, delete after 10 years',
                'archive_after_months' => 36,
                'delete_after_years' => 10,
                'is_permanent' => false,
            ],
            [
                'code' => 'PERMANENT',
                'name' => 'Permanent',
                'description' => 'Never archive or delete',
                'archive_after_months' => 0,
                'delete_after_years' => 0,
                'is_permanent' => true,
            ],
        ];

        foreach ($policies as $policy) {
            RetentionPolicy::firstOrCreate(
                ['code' => $policy['code']],
                $policy
            );
        }
    }
}
