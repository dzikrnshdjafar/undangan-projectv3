<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invitation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'invitation_theme_id',
        'slug',
        'title',
        'background_image_path',
        'sections_json', // <-- PERBAIKAN: Menggunakan sections_json
        'is_published',
        'published_at',
        'view_count',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'sections_json' => 'array', // <-- PERBAIKAN: Cast sections_json ke array
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    /**
     * Get the theme that the invitation belongs to.
     */
    public function theme(): BelongsTo
    {
        return $this->belongsTo(InvitationTheme::class, 'invitation_theme_id');
    }

    /**
     * Get the user that owns the invitation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
