<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentAssignment;
use App\Models\DocumentLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DocumentWorkflowController extends Controller
{
    public function transition(Request $request, Document $document)
    {
        $request->validate([
            'to_status_id' => 'required|exists:document_statuses,id',
            'target_office_id' => 'nullable|exists:offices,id',
            'note' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $document) {
            $from = $document->current_status_id;
            $to = $request->input('to_status_id');

            $document->current_status_id = $to;

            if ($request->filled('target_office_id')) {
                $document->current_office_id = $request->input('target_office_id');
                $assignment = DocumentAssignment::create([
                    'document_id' => $document->id,
                    'office_id' => $request->input('target_office_id'),
                    'assigned_by' => auth()->id(),
                    'note' => $request->input('note'),
                    'assigned_at' => now(),
                ]);
            }

            // Set timestamps for responded/resolved
            // Example logic: if moving out of SUBMITTED set responded_at
            // (We don't hardcode status codes here; calling code may supply logic later)

            $document->save();

            DocumentLog::create([
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'action' => 'transition',
                'meta' => json_encode(['from' => $from, 'to' => $to, 'assignment_id' => $assignment->id ?? null]),
                'note' => $request->input('note'),
            ]);
        });

        return back();
    }
}
