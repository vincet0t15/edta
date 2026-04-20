<?php

namespace App\Http\Controllers;

use App\Models\DocumentStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentStatusController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $statuses = DocumentStatus::query()
            ->when($search, function ($query, $search) {
                $query->where('label', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('order')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('document-statuses/index', [
            'statuses' => $statuses,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:document_statuses,code',
            'label' => 'required|string|max:255|unique:document_statuses,label',
            'description' => 'nullable|string|max:500',
            'badge_color' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
        ]);

        DocumentStatus::create($validated);

        return redirect()->back()->with('success', 'Document status created successfully.');
    }

    public function update(Request $request, DocumentStatus $status)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:document_statuses,code,' . $status->id,
            'label' => 'required|string|max:255|unique:document_statuses,label,' . $status->id,
            'description' => 'nullable|string|max:500',
            'badge_color' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
        ]);

        $status->update($validated);

        return redirect()->back()->with('success', 'Document status updated successfully.');
    }

    public function destroy(Request $request, DocumentStatus $status)
    {
        $status->delete();

        return redirect()->back()->with('success', 'Document status deleted successfully.');
    }
}
