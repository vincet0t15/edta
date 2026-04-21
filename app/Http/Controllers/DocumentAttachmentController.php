<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadAttachmentRequest;
use App\Models\Document;
use App\Models\DocumentAttachment;
use App\Models\DocumentLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class DocumentAttachmentController extends Controller
{
    public function upload(UploadAttachmentRequest $request, Document $document)
    {
        $this->authorize('update', $document);

        $file = $request->file('file');
        $path = $file->store('documents/' . $document->id, config('filesystems.default'));

        $attachment = DocumentAttachment::create([
            'document_id' => $document->id,
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'size' => $file->getSize(),
            'mime' => $file->getClientMimeType(),
            'uploaded_by' => Auth::id(),
        ]);

        DocumentLog::create([
            'document_id' => $document->id,
            'user_id' => Auth::id(),
            'action' => 'attachment_uploaded',
            'payload' => ['attachment_id' => $attachment->id, 'filename' => $attachment->filename],
        ]);

        return back()->with('success', 'Attachment uploaded.');
    }

    public function download(Document $document, DocumentAttachment $attachment)
    {
        // authorization: user must be able to view the document
        $this->authorize('view', $document);

        if ($attachment->document_id !== $document->id) {
            abort(404);
        }

        return Storage::download($attachment->path, $attachment->filename);
    }
}
