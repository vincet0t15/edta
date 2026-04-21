<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentAssignment;
use App\Models\DocumentLog;
use App\Models\DocumentStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DocumentWorkflowController extends Controller
{
    /**
     * Handle a status transition or workflow action on a document.
     * Accepts: to_status (code), note (optional), target_office_id (optional)
     */
    public function transition(Request $request, Document $document)
    {
        $this->authorize('update', $document); // will use default policy if present

        $data = $request->validate([
            'to_status' => 'required|string',
            'note' => 'nullable|string',
            'target_office_id' => 'nullable|exists:offices,id',
        ]);

        $fromStatus = $document->status?->code ?? null;

        $toStatus = DocumentStatus::where('code', $data['to_status'])->first();
        if (!$toStatus) {
            return redirect()->back()->with('error', 'Invalid target status.');
        }

        // Define allowed transitions (business rules). Keep conservative defaults.
        $allowed = [
            'DRAFT' => ['SUBMITTED', 'DRAFT'],
            'SUBMITTED' => ['IN_PROGRESS', 'ON_HOLD', 'DRAFT'],
            'IN_PROGRESS' => ['FOR_REVIEW', 'ON_HOLD', 'IN_PROGRESS'],
            'FOR_REVIEW' => ['APPROVED', 'REJECTED', 'IN_PROGRESS', 'ON_HOLD'],
            'ON_HOLD' => ['IN_PROGRESS', 'DRAFT'],
            'APPROVED' => ['ARCHIVED'],
            'REJECTED' => ['DRAFT', 'ON_HOLD'],
            'ARCHIVED' => [],
        ];

        $fromCode = $fromStatus ?? 'DRAFT';
        $toCode = $toStatus->code;

        if (!array_key_exists($fromCode, $allowed)) {
            // allow any transition if unknown from state (be permissive but log)
            $permitted = true;
        } else {
            $permitted = in_array($toCode, $allowed[$fromCode], true);
        }

        if (!$permitted) {
            return redirect()->back()->with('error', "Transition from {$fromCode} to {$toCode} is not allowed.");
        }

        // Apply transition updates
        $document->current_status_id = $toStatus->id;

        // Set responded_at when moving out of SUBMITTED for the first time
        if ($fromCode === 'SUBMITTED' && $toCode !== 'SUBMITTED' && !$document->responded_at) {
            $document->responded_at = now();
        }

        // Set resolved_at when APPROVED or REJECTED
        if (in_array($toCode, ['APPROVED', 'REJECTED'], true)) {
            $document->resolved_at = now();
        }

        $document->save();

        // If target_office_id provided, create assignment and update current_office
        $assignment = null;
        if (!empty($data['target_office_id'])) {
            $assignment = DocumentAssignment::create([
                'document_id' => $document->id,
                'office_id' => $data['target_office_id'],
                'assigned_by' => Auth::id(),
                'assigned_at' => now(),
            ]);

            $document->current_office_id = $assignment->office_id;
            $document->save();
        }

        // Log the transition
        DocumentLog::create([
            'document_id' => $document->id,
            'user_id' => Auth::id(),
            'action' => 'transition',
            'payload' => [
                'from' => $fromCode,
                'to' => $toCode,
                'note' => $data['note'] ?? null,
                'assignment_id' => $assignment?->id ?? null,
            ],
        ]);

        return redirect()->back()->with('success', 'Document status updated.');
    }
}
