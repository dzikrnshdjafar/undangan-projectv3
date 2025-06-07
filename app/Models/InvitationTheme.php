<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvitationTheme extends Model
{
    use HasFactory;

    protected $fillable = [
        'invitation_category_id',
        'name',
        'slug',
        'description',
        'preview_image_path',
    ];

    /**
     * Get the category that owns the InvitationTheme.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(InvitationCategory::class, 'invitation_category_id');
    }

    /**
     * Get all of the invitations for the InvitationTheme.
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }
}
