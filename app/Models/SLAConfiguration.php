<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SLAConfiguration extends Model
{
    protected $table = 'sla_configurations';

    protected $fillable = [
        'document_type_id',
        'document_priority_id',
        'response_hours',
        'resolution_hours',
    ];

    protected $casts = [
        'response_hours' => 'integer',
        'resolution_hours' => 'integer',
    ];

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }

    public function documentPriority(): BelongsTo
    {
        return $this->belongsTo(DocumentPriority::class, 'document_priority_id');
    }
}
