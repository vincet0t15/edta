<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use App\Models\DocumentAssignment;
use App\Models\DocumentLog;
use App\Models\DocumentAttachment;
use App\Services\DocumentRoutingService;
use App\Services\DocumentSLAService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $priority = $request->input('priority');
        $office = $request->input('office');

        $query = Document::query()->with(['type', 'priority', 'status', 'office']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('current_status_id', $status);
        }

        if ($priority) {
            $query->where('document_priority_id', $priority);
        }

        if ($office) {
            $query->where('current_office_id', $office);
        }

        $documents = $query->orderByDesc('created_at')->paginate(25)->withQueryString();

        return Inertia::render('documents/index', [
            'documents' => $documents,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'priority' => $priority,
                'office' => $office,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('documents/create');
    }

    public function store(StoreDocumentRequest $request, DocumentRoutingService $routing, DocumentSLAService $slaService)
    {
        $data = $request->validated();

        $document = Document::create($data);

        // If submitting (not just saving draft)
        if (isset($data['submit']) && $data['submit']) {
            // compute SLA
            $slaService->applyToDocument($document);

            // routing
            $rule = $routing->findRuleForDocument($document);
            if ($rule) {
                $assignment = DocumentAssignment::create([
                    'document_id' => $document->id,
                    'office_id' => $rule->first_recipient_office_id,
                    'assigned_by' => auth()->id(),
                    'assigned_at' => now(),
                ]);

                $document->update(['current_office_id' => $assignment->office_id]);
            }

            // set status to SUBMITTED if available
            $submittedStatus = \App\Models\DocumentStatus::where('code', 'SUBMITTED')->first();
            if ($submittedStatus) {
                $document->update(['current_status_id' => $submittedStatus->id]);
            }

            DocumentLog::create([
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'action' => 'submitted',
                'payload' => ['routing_rule_id' => $rule?->id ?? null],
            ]);
        }

        return redirect()->route('documents.index')->with('success', 'Document created.');
    }

    public function show(Document $document)
    {
        $document->load(['type', 'priority', 'status', 'office', 'assignments.office', 'logs.user', 'comments.user', 'attachments']);

        $statuses = \App\Models\DocumentStatus::orderBy('order')->get();
        $offices = \App\Models\Office::orderBy('name')->get();

        return Inertia::render('documents/show', [
            'document' => $document,
            'statuses' => $statuses,
            'offices' => $offices,
        ]);
    }

    public function edit(Document $document)
    {
        return Inertia::render('documents/edit', ['document' => $document]);
    }

    public function update(UpdateDocumentRequest $request, Document $document)
    {
        $data = $request->validated();
        $document->update($data);

        DocumentLog::create([
            'document_id' => $document->id,
            'user_id' => auth()->id(),
            'action' => 'updated',
            'payload' => $data,
        ]);

        return redirect()->back()->with('success', 'Document updated.');
    }

    public function destroy(Document $document)
    {
        $document->delete();

        DocumentLog::create([
            'document_id' => $document->id,
            'user_id' => auth()->id(),
            'action' => 'deleted',
        ]);

        return redirect()->route('documents.index')->with('success', 'Document deleted.');
    }
}
