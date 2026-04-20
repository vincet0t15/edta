<?php

namespace Database\Seeders;

use App\Models\DocumentStatus;
use Illuminate\Database\Seeder;

class DocumentStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            [
                'code' => 'DRAFT',
                'label' => 'Draft',
                'description' => 'Document is being prepared',
                'order' => 1,
                'badge_color' => 'gray',
            ],
            [
                'code' => 'SUBMITTED',
                'label' => 'Submitted',
                'description' => 'Document submitted for processing',
                'order' => 2,
                'badge_color' => 'blue',
            ],
            [
                'code' => 'IN_PROGRESS',
                'label' => 'In Progress',
                'description' => 'Document is being processed',
                'order' => 3,
                'badge_color' => 'yellow',
            ],
            [
                'code' => 'FOR_REVIEW',
                'label' => 'For Review',
                'description' => 'Awaiting approval or review',
                'order' => 4,
                'badge_color' => 'orange',
            ],
            [
                'code' => 'APPROVED',
                'label' => 'Approved',
                'description' => 'Document has been approved',
                'order' => 5,
                'badge_color' => 'green',
            ],
            [
                'code' => 'REJECTED',
                'label' => 'Rejected',
                'description' => 'Document has been rejected',
                'order' => 6,
                'badge_color' => 'red',
            ],
            [
                'code' => 'ON_HOLD',
                'label' => 'On Hold',
                'description' => 'Document processing is paused',
                'order' => 7,
                'badge_color' => 'purple',
            ],
            [
                'code' => 'ARCHIVED',
                'label' => 'Archived',
                'description' => 'Document is archived for records',
                'order' => 8,
                'badge_color' => 'indigo',
            ],
        ];

        foreach ($statuses as $status) {
            DocumentStatus::firstOrCreate(
                ['code' => $status['code']],
                $status
            );
        }
    }
}
