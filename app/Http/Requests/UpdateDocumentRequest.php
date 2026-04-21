<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // allow if user owns the document or has permission - simple rule for now
        return $this->user() != null;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'document_type_id' => 'nullable|exists:document_types,id',
            'document_category_id' => 'nullable|exists:document_categories,id',
            'document_priority_id' => 'nullable|exists:document_priorities,id',
            'retention_policy_id' => 'nullable|exists:retention_policies,id',
            'is_public' => 'boolean',
        ];
    }
}
