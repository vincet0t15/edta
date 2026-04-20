<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentStatus extends Model
{
    protected $table = 'document_statuses';

    protected $fillable = [
        'code',
        'label',
        'description',
        'order',
        'badge_color',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'status_id');
    }
}
