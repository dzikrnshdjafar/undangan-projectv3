<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvitationCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Get all of the themes for the InvitationCategory.
     */
    public function themes(): HasMany
    {
        return $this->hasMany(InvitationTheme::class);
    }

    /**
     * Get all of the invitations for the InvitationCategory through themes.
     */
    public function invitations(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(Invitation::class, InvitationTheme::class);
    }
}
