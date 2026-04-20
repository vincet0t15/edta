<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RetentionPolicy extends Model
{
    protected $table = 'retention_policies';

    protected $fillable = [
        'code',
        'name',
        'description',
        'archive_after_months',
        'delete_after_years',
        'is_permanent',
    ];

    protected $casts = [
        'archive_after_months' => 'integer',
        'delete_after_years' => 'integer',
        'is_permanent' => 'boolean',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'retention_policy_id');
    }
}
