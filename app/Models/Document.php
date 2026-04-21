<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tracking_number',
        'title',
        'description',
        'document_type_id',
        'document_category_id',
        'document_priority_id',
        'current_status_id',
        'current_office_id',
        'retention_policy_id',
        'created_by',
        'is_public',
        'due_date_response',
        'due_date_resolution',
        'responded_at',
        'resolved_at',
        'metadata',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'metadata' => 'array',
        'due_date_response' => 'datetime',
        'due_date_resolution' => 'datetime',
        'responded_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->tracking_number)) {
                $model->tracking_number = strtoupper('DOC-' . uniqid());
            }
            if (empty($model->created_by) && Auth::check()) {
                $model->created_by = Auth::id();
            }
        });
    }

    // Relationships
    public function type()
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }

    public function category()
    {
        return $this->belongsTo(DocumentCategory::class, 'document_category_id');
    }

    public function priority()
    {
        return $this->belongsTo(DocumentPriority::class, 'document_priority_id');
    }

    public function status()
    {
        return $this->belongsTo(DocumentStatus::class, 'current_status_id');
    }

    public function office()
    {
        return $this->belongsTo(Office::class, 'current_office_id');
    }

    public function retentionPolicy()
    {
        return $this->belongsTo(RetentionPolicy::class, 'retention_policy_id');
    }

    public function assignments()
    {
        return $this->hasMany(DocumentAssignment::class);
    }

    public function logs()
    {
        return $this->hasMany(DocumentLog::class);
    }

    public function comments()
    {
        return $this->hasMany(DocumentComment::class);
    }

    public function attachments()
    {
        return $this->hasMany(DocumentAttachment::class);
    }
}
