<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'document_type_id',
        'priority_id',
        'current_status_id',
        'current_office_id',
        'retention_policy_id',
        'sla_response_due_at',
        'sla_resolution_due_at',
        'submitted_at',
        'responded_at',
        'resolved_at',
    ];

    protected $dates = [
        'submitted_at',
        'responded_at',
        'resolved_at',
        'sla_response_due_at',
        'sla_resolution_due_at',
    ];

    public function type()
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }

    public function priority()
    {
        return $this->belongsTo(DocumentPriority::class, 'priority_id');
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
        return $this->hasMany(DocumentLog::class)->orderBy('created_at', 'desc');
    }

    public function attachments()
    {
        return $this->hasMany(DocumentAttachment::class);
    }
}
