<?php

namespace Database\Seeders;

use App\Models\DocumentPriority;
use Illuminate\Database\Seeder;

class DocumentPrioritySeeder extends Seeder
{
    public function run(): void
    {
        $priorities = [
            [
                'code' => 'LOW',
                'label' => 'Low',
                'level' => 1,
                'sla_hours' => 720, // 30 days
                'badge_color' => 'green',
                'order' => 1,
            ],
            [
                'code' => 'MEDIUM',
                'label' => 'Medium',
                'level' => 2,
                'sla_hours' => 336, // 14 days
                'badge_color' => 'blue',
                'order' => 2,
            ],
            [
                'code' => 'HIGH',
                'label' => 'High',
                'level' => 3,
                'sla_hours' => 168, // 7 days
                'badge_color' => 'orange',
                'order' => 3,
            ],
            [
                'code' => 'URGENT',
                'label' => 'Urgent',
                'level' => 4,
                'sla_hours' => 24, // 1 day
                'badge_color' => 'red',
                'order' => 4,
            ],
        ];

        foreach ($priorities as $priority) {
            DocumentPriority::firstOrCreate(
                ['code' => $priority['code']],
                $priority
            );
        }
    }
}
