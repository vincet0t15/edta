<?php

namespace App\Services;

use App\Models\Document;
use App\Models\RoutingRule;

class DocumentRoutingService
{
    public function findRuleForDocument(Document $document)
    {
        // match by document_type_id first, fallback to catch-all (document_type_id IS NULL)
        return RoutingRule::where(function ($q) use ($document) {
            $q->where('document_type_id', $document->document_type_id);
        })->orWhereNull('document_type_id')->where('is_active', true)->orderBy('order')->first();
    }
}
