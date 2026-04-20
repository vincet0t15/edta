<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentCategory extends Model
{
    protected $table = 'document_categories';

    protected $fillable = [
        'code',
        'name',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function documentTypes(): HasMany
    {
        return $this->hasMany(DocumentType::class, 'category_id');
    }
}
