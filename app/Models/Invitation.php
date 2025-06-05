<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'invitation_theme_id',
        'slug',
        'title',
        'cover_image_path',
        'event_name',
        'event_date',
        'event_time_start',
        'event_time_end',
        'venue_name',
        'venue_address',
        'venue_maps_link',
        'secondary_event_name',
        'secondary_event_date',
        'secondary_event_time_start',
        'secondary_event_time_end',
        'secondary_venue_name',
        'secondary_venue_address',
        'secondary_venue_maps_link',
        'greeting_message',
        'closing_message',
        'details', // <--- Kolom ini akan menyimpan struktur section
        'rsvp_contact_name',
        'rsvp_contact_phone',
        'is_published',
        'published_at',
        'view_count',
    ];

    protected $casts = [
        'event_date' => 'date',
        'event_time_start' => 'datetime:H:i',
        'event_time_end' => 'datetime:H:i',
        'secondary_event_date' => 'date',
        'secondary_event_time_start' => 'datetime:H:i',
        'secondary_event_time_end' => 'datetime:H:i',
        'details' => 'array', // Penting untuk cast ke array
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // ... (relasi dan method lainnya tetap sama)

    /**
     * Helper untuk mengambil data section tertentu dari 'details'.
     *
     * @param string $sectionName Nama section (e.g., 'opening', 'mempelai')
     * @param mixed $default Nilai default jika section tidak ditemukan
     * @return mixed
     */
    public function getSectionDetails(string $sectionName, $default = null)
    {
        return $this->details[$sectionName] ?? $default;
    }

    public function theme()
    {
        return $this->belongsTo(InvitationTheme::class, 'invitation_theme_id');
    }
}
