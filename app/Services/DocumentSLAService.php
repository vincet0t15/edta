<?php

namespace App\Services;

use App\Models\Document;
use App\Models\SLAConfiguration;

class DocumentSLAService
{
    public function applyToDocument(Document $document)
    {
        // lookup SLA config: specific type+priority, then priority-only, then priority.sla_days
        $sla = SLAConfiguration::where(function ($q) use ($document) {
            $q->where('document_type_id', $document->document_type_id)
              ->where('document_priority_id', $document->document_priority_id);
        })->first();

        if (!$sla) {
            $sla = SLAConfiguration::whereNull('document_type_id')
                ->where('document_priority_id', $document->document_priority_id)
                ->first();
        }

        if ($sla) {
            $document->update([
                'due_date_response' => now()->addHours($sla->response_hours),
                'due_date_resolution' => now()->addHours($sla->resolution_hours),
            ]);
            return;
        }

        // fallback to priority's sla_days (in days)
        if ($document->priority && $document->priority->sla_days) {
            $document->update([
                'due_date_response' => now()->addDays($document->priority->sla_days),
                'due_date_resolution' => now()->addDays($document->priority->sla_days),
            ]);
        }
    }
}
