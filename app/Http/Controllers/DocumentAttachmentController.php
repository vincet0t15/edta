<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadAttachmentRequest;
use App\Models\Document;
use App\Models\DocumentAttachment;
use App\Models\DocumentLog;
use Illuminate\Support\Facades\Storage;

class DocumentAttachmentController extends Controller
{
    public function upload(UploadAttachmentRequest $request, Document $document)
    {
        $file = $request->file('file');
        $path = $file->store('documents/' . $document->id, 'public');

        $attachment = DocumentAttachment::create([
            'document_id' => $document->id,
            'uploaded_by' => auth()->id(),
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);

        DocumentLog::create([
            'document_id' => $document->id,
            'user_id' => auth()->id(),
            'action' => 'attachment_uploaded',
            'meta' => json_encode(['attachment_id' => $attachment->id, 'path' => $path]),
        ]);

        return back();
    }

    public function download(Document $document, DocumentAttachment $attachment)
    {
        if ($attachment->document_id !== $document->id) {
            abort(404);
        }

        // Authorization can be added here
        return Storage::disk('public')->download($attachment->path, $attachment->filename);
    }
}
