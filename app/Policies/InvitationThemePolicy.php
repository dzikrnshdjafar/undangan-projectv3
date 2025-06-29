<?php

namespace App\Policies;

use App\Models\User;
use App\Models\InvitationTheme;

class InvitationThemePolicy
{
    /**
     * Create a new policy instance.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     * Hanya editor dan admin yang bisa melihat daftar tema mereka.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('editor');
    }

    /**
     * Determine whether the user can view the model.
     * Editor hanya bisa melihat tema miliknya sendiri.
     */
    public function view(User $user, InvitationTheme $invitationTheme): bool
    {
        return $user->id === $invitationTheme->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('editor');
    }

    /**
     * Determine whether the user can update the model.
     * Editor hanya bisa memperbarui tema miliknya sendiri.
     */
    public function update(User $user, InvitationTheme $invitationTheme): bool
    {
        return $user->id === $invitationTheme->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     * Editor hanya bisa menghapus tema miliknya sendiri.
     */
    public function delete(User $user, InvitationTheme $invitationTheme): bool
    {
        return $user->id === $invitationTheme->user_id;
    }
}
