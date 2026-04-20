<?php

namespace App\Http\Controllers;

use App\Models\RetentionPolicy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RetentionPolicyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $policies = RetentionPolicy::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('retention-policies/index', [
            'policies' => $policies,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:retention_policies,code',
            'name' => 'required|string|max:255|unique:retention_policies,name',
            'description' => 'nullable|string|max:500',
            'archive_after_months' => 'nullable|integer|min:0',
            'delete_after_years' => 'nullable|integer|min:0',
            'is_permanent' => 'nullable|boolean',
        ]);

        RetentionPolicy::create($validated);

        return redirect()->back()->with('success', 'Retention policy created successfully.');
    }

    public function update(Request $request, RetentionPolicy $policy)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:retention_policies,code,' . $policy->id,
            'name' => 'required|string|max:255|unique:retention_policies,name,' . $policy->id,
            'description' => 'nullable|string|max:500',
            'archive_after_months' => 'nullable|integer|min:0',
            'delete_after_years' => 'nullable|integer|min:0',
            'is_permanent' => 'nullable|boolean',
        ]);

        $policy->update($validated);

        return redirect()->back()->with('success', 'Retention policy updated successfully.');
    }

    public function destroy(Request $request, RetentionPolicy $policy)
    {
        $policy->delete();

        return redirect()->back()->with('success', 'Retention policy deleted successfully.');
    }
}
