<?php

namespace Database\Seeders;

use App\Models\DocumentCategory;
use Illuminate\Database\Seeder;

class DocumentCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'code' => 'REQ',
                'name' => 'Requests',
                'description' => 'Administrative and service requests',
                'order' => 1,
            ],
            [
                'code' => 'REP',
                'name' => 'Reports',
                'description' => 'Departmental and financial reports',
                'order' => 2,
            ],
            [
                'code' => 'PRM',
                'name' => 'Permits',
                'description' => 'Permits and licenses',
                'order' => 3,
            ],
            [
                'code' => 'CMP',
                'name' => 'Complaints',
                'description' => 'Citizen complaints and concerns',
                'order' => 4,
            ],
            [
                'code' => 'COR',
                'name' => 'Correspondence',
                'description' => 'Official letters and memos',
                'order' => 5,
            ],
        ];

        foreach ($categories as $category) {
            DocumentCategory::firstOrCreate(
                ['code' => $category['code']],
                $category
            );
        }
    }
}
