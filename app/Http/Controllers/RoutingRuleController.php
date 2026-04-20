<?php

namespace App\Http\Controllers;

use App\Models\RoutingRule;
use App\Models\DocumentType;
use App\Models\Office;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoutingRuleController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $routingRules = RoutingRule::query()
            ->with(['documentType', 'office'])
            ->when($search, function ($query, $search) {
                $query->whereHas('documentType', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('office', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->orderBy('order')
            ->paginate(50)
            ->withQueryString();

        $documentTypes = DocumentType::orderBy('name')->get();
        $offices = Office::orderBy('name')->get();

        return Inertia::render('routing-rules/index', [
            'routingRules' => $routingRules,
            'documentTypes' => $documentTypes,
            'offices' => $offices,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'office_id' => 'required|exists:offices,id',
            'order' => 'required|integer|min:1',
            'is_initial_recipient' => 'boolean',
        ]);

        // Check if combination already exists
        $exists = RoutingRule::where('document_type_id', $validated['document_type_id'])
            ->where('office_id', $validated['office_id'])
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'This Routing Rule already exists.');
        }

        RoutingRule::create($validated);

        return redirect()->back()->with('success', 'Routing Rule created successfully.');
    }

    public function update(Request $request, RoutingRule $routingRule)
    {
        $validated = $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'office_id' => 'required|exists:offices,id',
            'order' => 'required|integer|min:1',
            'is_initial_recipient' => 'boolean',
        ]);

        // Check if another record has the same combination
        $exists = RoutingRule::where('document_type_id', $validated['document_type_id'])
            ->where('office_id', $validated['office_id'])
            ->where('id', '!=', $routingRule->id)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'This Routing Rule already exists.');
        }

        $routingRule->update($validated);

        return redirect()->back()->with('success', 'Routing Rule updated successfully.');
    }

    public function destroy(Request $request, RoutingRule $routingRule)
    {
        $routingRule->delete();

        return redirect()->back()->with('success', 'Routing Rule deleted successfully.');
    }
}
