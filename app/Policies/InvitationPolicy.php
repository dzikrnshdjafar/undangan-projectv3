<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Invitation;

class InvitationPolicy
{
    /**
     * Determine if the user can edit the invitation.
     */
    public function edit(User $user, Invitation $invitation): bool
    {
        // Admin bisa edit semua invitation
        if ($user->hasRole('admin')) {
            return true;
        }

        // User hanya bisa edit invitation miliknya sendiri
        return $user->id === $invitation->user_id;
    }

    /**
     * Determine if the user can view the invitation.
     */
    public function view(User $user, Invitation $invitation): bool
    {
        // Admin bisa view semua
        if ($user->hasRole('admin')) {
            return true;
        }

        // User hanya bisa view miliknya sendiri
        return $user->id === $invitation->user_id;
    }

    /**
     * Determine if the user can delete the invitation.
     */
    public function delete(User $user, Invitation $invitation): bool
    {
        // Admin bisa delete semua
        if ($user->hasRole('admin')) {
            return true;
        }

        // User hanya bisa delete miliknya sendiri
        return $user->id === $invitation->user_id;
    }
}
