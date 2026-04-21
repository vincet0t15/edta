<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'office_id',
        'assigned_by',
        'note',
        'assigned_at',
        'completed_at',
    ];

    protected $dates = ['assigned_at', 'completed_at'];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
