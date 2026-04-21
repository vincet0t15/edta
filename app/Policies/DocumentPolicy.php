<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DocumentPolicy
{
    public function viewAny(User $user): bool
    {
        // allow if user has role admin or document manager - simplified: allow all authenticated
        return true;
    }

    public function view(User $user, Document $document): bool
    {
        // allow if user is creator, assigned to current office, or admin (simple check)
        if ($user->id === $document->created_by) return true;
        // TODO: check office membership/roles - for now allow
        return true;
    }

    public function create(User $user): bool
    {
        return true; // any authenticated user can create
    }

    public function update(User $user, Document $document): bool
    {
        // allow creator or assigned person/admin - simplified
        if ($user->id === $document->created_by) return true;
        return true;
    }

    public function delete(User $user, Document $document): bool
    {
        // only creator or admin can delete; simplified to creator
        return $user->id === $document->created_by;
    }

    public function restore(User $user, Document $document): bool
    {
        return false;
    }

    public function forceDelete(User $user, Document $document): bool
    {
        return false;
    }
}
