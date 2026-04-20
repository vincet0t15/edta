<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    public function index(Request $request)
    {
        $query = DocumentType::with('createdBy');

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%");
        }

        $documentTypes = $query->paginate(50);

        return Inertia::render('document-types/index', [
            'documentTypes' => $documentTypes,
            'filters' => [
                'search' => $request->search,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:document_types',
            'code' => 'required|string|unique:document_types',
            'description' => 'nullable|string',
        ]);

        DocumentType::create($validated);

        return back()->with('success', 'Document type created successfully.');
    }

    public function update(Request $request, DocumentType $documentType)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:document_types,name,' . $documentType->id,
            'code' => 'required|string|unique:document_types,code,' . $documentType->id,
            'description' => 'nullable|string',
        ]);

        $documentType->update($validated);

        return back()->with('success', 'Document type updated successfully.');
    }

    public function destroy(DocumentType $documentType)
    {
        $documentType->delete();

        return back()->with('success', 'Document type deleted successfully.');
    }
}
