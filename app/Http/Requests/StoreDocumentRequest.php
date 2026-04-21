<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() != null; // authenticated users only
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
            'submit' => 'nullable|boolean',
        ];
    }
}
