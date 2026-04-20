<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentPriority extends Model
{
    protected $table = 'document_priorities';

    protected $fillable = [
        'code',
        'label',
        'level',
        'sla_hours',
        'badge_color',
        'order',
    ];

    protected $casts = [
        'level' => 'integer',
        'sla_hours' => 'integer',
        'order' => 'integer',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'priority_id');
    }

    public function slaConfigurations(): HasMany
    {
        return $this->hasMany(SLAConfiguration::class, 'document_priority_id');
    }
}
