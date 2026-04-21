<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class DocumentRoutingService
{
    /**
     * Find the initial office id for a document type using routing_rules table.
     * Preference: exact document_type match over null (catch-all), ordered by `order`.
     *
     * @param int|null $documentTypeId
     * @return int|null
     */
    public function findInitialOffice(?int $documentTypeId): ?int
    {
        $query = DB::table('routing_rules')->where('is_active', true);

        if ($documentTypeId) {
            // Prefer exact match first but allow fallback to NULL
            $row = (clone $query)
                ->where('document_type_id', $documentTypeId)
                ->orderBy('order')
                ->first();

            if ($row) {
                return $row->first_recipient_office_id;
            }

            $row = (clone $query)
                ->whereNull('document_type_id')
                ->orderBy('order')
                ->first();

            return $row->first_recipient_office_id ?? null;
        }

        $row = $query->whereNull('document_type_id')->orderBy('order')->first();

        return $row->first_recipient_office_id ?? null;
    }
}
