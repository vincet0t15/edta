<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'document_type_id' => 'nullable|exists:document_types,id',
            'priority_id' => 'nullable|exists:document_priorities,id',
            'current_office_id' => 'nullable|exists:offices,id',
            'retention_policy_id' => 'nullable|exists:retention_policies,id',
        ];
    }
}
