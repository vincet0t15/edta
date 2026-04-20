<?php

namespace App\Http\Controllers;

use App\Models\DocumentPriority;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentPriorityController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $priorities = DocumentPriority::query()
            ->when($search, function ($query, $search) {
                $query->where('label', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('order')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('document-priorities/index', [
            'priorities' => $priorities,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:document_priorities,code',
            'label' => 'required|string|max:255|unique:document_priorities,label',
            'level' => 'nullable|integer|min:0',
            'sla_hours' => 'nullable|integer|min:0',
            'badge_color' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
        ]);

        DocumentPriority::create($validated);

        return redirect()->back()->with('success', 'Document priority created successfully.');
    }

    public function update(Request $request, DocumentPriority $priority)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:document_priorities,code,' . $priority->id,
            'label' => 'required|string|max:255|unique:document_priorities,label,' . $priority->id,
            'level' => 'nullable|integer|min:0',
            'sla_hours' => 'nullable|integer|min:0',
            'badge_color' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
        ]);

        $priority->update($validated);

        return redirect()->back()->with('success', 'Document priority updated successfully.');
    }

    public function destroy(Request $request, DocumentPriority $priority)
    {
        $priority->delete();

        return redirect()->back()->with('success', 'Document priority deleted successfully.');
    }
}
