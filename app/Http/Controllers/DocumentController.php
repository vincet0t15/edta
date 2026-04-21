<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use App\Models\DocumentLog;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $documents = Document::with(['type', 'priority', 'status', 'office'])->paginate(15);
        return inertia('documents/index', ['documents' => $documents]);
    }

    public function create()
    {
        return inertia('documents/create');
    }

    public function store(StoreDocumentRequest $request)
    {
        $data = $request->validated();
        $document = Document::create($data);

        // Log creation
        DocumentLog::create(["document_id" => $document->id, "user_id" => auth()->id(), "action" => "created"]);

        return redirect()->route('documents.show', $document->id);
    }

    public function show(Document $document)
    {
        $document->load(['type', 'priority', 'status', 'office', 'assignments', 'logs', 'attachments']);
        return inertia('documents/show', [
            'document' => $document
        ]);
    }

    public function edit(Document $document)
    {
        $document->load(['type', 'priority', 'status', 'office']);
        return inertia('documents/edit', ['document' => $document]);
    }

    public function update(UpdateDocumentRequest $request, Document $document)
    {
        $document->update($request->validated());
        DocumentLog::create(["document_id" => $document->id, "user_id" => auth()->id(), "action" => "updated"]);
        return redirect()->route('documents.show', $document->id);
    }

    public function destroy(Document $document)
    {
        $document->delete();
        DocumentLog::create(["document_id" => $document->id, "user_id" => auth()->id(), "action" => "deleted"]);
        return redirect()->route('documents.index');
    }
}
