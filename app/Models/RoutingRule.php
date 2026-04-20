<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoutingRule extends Model
{
    protected $table = 'routing_rules';

    protected $fillable = [
        'document_type_id',
        'office_id',
        'order',
        'is_initial_recipient',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_initial_recipient' => 'boolean',
    ];

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }

    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class, 'office_id');
    }
}
