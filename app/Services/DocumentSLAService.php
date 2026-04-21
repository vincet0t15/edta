<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DocumentSLAService
{
    /**
     * Calculate and return SLA timestamps (response and resolution) based on sla_configurations
     * Falls back to priority.sla_days for resolution if no SLA row found.
     *
     * @param int|null $documentTypeId
     * @param int|null $priorityId
     * @param \DateTime|string|null $baseAt
     * @return array ["response_at" => Carbon|null, "resolution_at" => Carbon|null]
     */
    public function calculate(?int $documentTypeId, ?int $priorityId, $baseAt = null): array
    {
        $base = Carbon::parse($baseAt ?? now());

        // Try to find SLA config for type+priority
        $sla = DB::table('sla_configurations')
            ->where('is_active', true)
            ->where(function ($q) use ($documentTypeId, $priorityId) {
                $q->where(function ($q2) use ($documentTypeId, $priorityId) {
                    if (!is_null($documentTypeId)) {
                        $q2->where('document_type_id', $documentTypeId);
                    } else {
                        $q2->whereNull('document_type_id');
                    }

                    if (!is_null($priorityId)) {
                        $q2->where('priority_id', $priorityId);
                    } else {
                        $q2->whereNull('priority_id');
                    }
                });
            })
            ->orderByRaw('document_type_id IS NULL, priority_id IS NULL')
            ->first();

        if ($sla) {
            $response = $sla->response_hours ? $base->copy()->addHours($sla->response_hours) : null;
            $resolution = $sla->resolution_hours ? $base->copy()->addHours($sla->resolution_hours) : null;
            return ['response_at' => $response, 'resolution_at' => $resolution];
        }

        // Fallback: use priority default days
        if ($priorityId) {
            $priority = DB::table('document_priorities')->where('id', $priorityId)->first();
            if ($priority && $priority->sla_days) {
                $resolution = $base->copy()->addDays($priority->sla_days);
                // default response: 24 hours
                $response = $base->copy()->addHours(24);
                return ['response_at' => $response, 'resolution_at' => $resolution];
            }
        }

        return ['response_at' => null, 'resolution_at' => null];
    }
}
