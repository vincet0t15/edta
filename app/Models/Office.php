<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Office extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'created_by',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($office) {
            if (empty($office->created_by) && Auth::check()) {
                $office->created_by = Auth::id();
            }
        });
    }
}
