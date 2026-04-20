<?php

namespace App\Http\Controllers;

use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentCategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $categories = DocumentCategory::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('order')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('document-categories/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:document_categories,code',
            'name' => 'required|string|max:255|unique:document_categories,name',
            'description' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
        ]);

        DocumentCategory::create($validated);

        return redirect()->back()->with('success', 'Document category created successfully.');
    }

    public function update(Request $request, DocumentCategory $category)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:document_categories,code,' . $category->id,
            'name' => 'required|string|max:255|unique:document_categories,name,' . $category->id,
            'description' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Document category updated successfully.');
    }

    public function destroy(Request $request, DocumentCategory $category)
    {
        $category->delete();

        return redirect()->back()->with('success', 'Document category deleted successfully.');
    }
}
