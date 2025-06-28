<?php

namespace App\Policies;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InvitationPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Invitation $invitation): bool
    {
        // Izinkan jika user adalah pemilik ATAU seorang admin
        return $user->id === $invitation->user_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Invitation $invitation): bool
    {
        // Izinkan jika user adalah pemilik ATAU seorang admin
        return $user->id === $invitation->user_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Invitation $invitation): bool
    {
        // Izinkan jika user adalah pemilik ATAU seorang admin
        return $user->id === $invitation->user_id || $user->hasRole('admin');
    }
}
