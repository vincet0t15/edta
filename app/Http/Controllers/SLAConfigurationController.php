<?php

namespace App\Http\Controllers;

use App\Models\SLAConfiguration;
use App\Models\DocumentType;
use App\Models\DocumentPriority;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SLAConfigurationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $slaConfigurations = SLAConfiguration::query()
            ->with(['documentType', 'documentPriority'])
            ->when($search, function ($query, $search) {
                $query->whereHas('documentType', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('documentPriority', function ($q) use ($search) {
                    $q->where('label', 'like', "%{$search}%");
                });
            })
            ->paginate(50)
            ->withQueryString();

        $documentTypes = DocumentType::orderBy('name')->get();
        $documentPriorities = DocumentPriority::orderBy('order')->get();

        return Inertia::render('sla-configurations/index', [
            'slaConfigurations' => $slaConfigurations,
            'documentTypes' => $documentTypes,
            'documentPriorities' => $documentPriorities,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'document_priority_id' => 'required|exists:document_priorities,id',
            'response_hours' => 'required|integer|min:1',
            'resolution_hours' => 'required|integer|min:1',
        ]);

        // Check if combination already exists
        $exists = SLAConfiguration::where('document_type_id', $validated['document_type_id'])
            ->where('document_priority_id', $validated['document_priority_id'])
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'This SLA Configuration already exists.');
        }

        SLAConfiguration::create($validated);

        return redirect()->back()->with('success', 'SLA Configuration created successfully.');
    }

    public function update(Request $request, SLAConfiguration $slaConfiguration)
    {
        $validated = $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'document_priority_id' => 'required|exists:document_priorities,id',
            'response_hours' => 'required|integer|min:1',
            'resolution_hours' => 'required|integer|min:1',
        ]);

        // Check if another record has the same combination
        $exists = SLAConfiguration::where('document_type_id', $validated['document_type_id'])
            ->where('document_priority_id', $validated['document_priority_id'])
            ->where('id', '!=', $slaConfiguration->id)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'This SLA Configuration already exists.');
        }

        $slaConfiguration->update($validated);

        return redirect()->back()->with('success', 'SLA Configuration updated successfully.');
    }

    public function destroy(Request $request, SLAConfiguration $slaConfiguration)
    {
        $slaConfiguration->delete();

        return redirect()->back()->with('success', 'SLA Configuration deleted successfully.');
    }
}
