<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\DB;

class DocumentPolicy
{
    use HandlesAuthorization;

    /**
     * Before hook: if user is admin allow everything
     */
    public function before(User $user, $ability)
    {
        if (property_exists($user, 'is_admin') && $user->is_admin) {
            return true;
        }

        return null;
    }

    public function view(User $user, Document $document)
    {
        // Allow if user created/assigned or belongs to the current office (best-effort)
        if ($document->user_id ?? false) {
            if ($document->user_id === $user->id) {
                return true;
            }
        }

        // Check assignments: if user assigned the document or their office matches assignment
        try {
            $assigned = DB::table('document_assignments')
                ->where('document_id', $document->id)
                ->where(function ($q) use ($user) {
                    $q->where('assigned_by', $user->id);
                    if (property_exists($user, 'office_id')) {
                        $q->orWhere('office_id', $user->office_id);
                    }
                })
                ->exists();

            if ($assigned) {
                return true;
            }
        } catch (\Exception $e) {
            // If DB table missing or other issue, fallthrough to deny
        }

        // Default: deny
        return false;
    }

    public function create(User $user)
    {
        // Any authenticated user can create documents for now
        return true;
    }

    public function update(User $user, Document $document)
    {
        // Allow if creator or assigned
        if ($document->user_id ?? false) {
            if ($document->user_id === $user->id) {
                return true;
            }
        }

        try {
            $assigned = DB::table('document_assignments')
                ->where('document_id', $document->id)
                ->where('assigned_by', $user->id)
                ->exists();

            if ($assigned) {
                return true;
            }
        } catch (\Exception $e) {
        }

        return false;
    }

    public function delete(User $user, Document $document)
    {
        // Only admins (handled in before) and creator can delete
        if ($document->user_id ?? false) {
            return $document->user_id === $user->id;
        }

        return false;
    }

    public function transition(User $user, Document $document)
    {
        // Similar to update: allow assigned or creator
        return $this->update($user, $document);
    }

    public function uploadAttachment(User $user, Document $document)
    {
        // Allow if viewable
        return $this->view($user, $document);
    }
}
