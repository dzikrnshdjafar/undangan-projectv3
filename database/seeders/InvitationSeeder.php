<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Invitation;
use App\Models\InvitationTheme;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InvitationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the theme and user
        $elegantBlueTheme = InvitationTheme::where('slug', 'elegant-blue-wedding')->first();
        $user = User::first();

        if ($elegantBlueTheme && $user) {
            // Copy sections from theme and inherit modifiable settings
            $themeSections = json_decode($elegantBlueTheme->sections_json, true);

            // Create invitation with inherited sections but customized content
            Invitation::create([
                'user_id' => $user->id,
                'invitation_theme_id' => $elegantBlueTheme->id,
                'slug' => Str::slug($user->name . '-' . $elegantBlueTheme->name) . '-' . strtolower("2ntznu"),
                'title' => 'Adam & Eve Wedding Invitation',
                'background_image_path' => "/images/themes/elegant-blue-wedding/bg.webp",
                'sections_json' => json_encode($this->customizeInvitationSections($themeSections))
            ]);
        }
    }

    /**
     * Customize invitation sections with user-specific data
     */
    private function customizeInvitationSections($sections)
    {
        // Customize specific content while preserving modifiable settings
        foreach ($sections as $sectionIndex => &$section) {
            switch ($section['type']) {
                case 'opening':
                    // Customize couple names and date
                    if (isset($section['heroWrapper']['couple']['modifiable']) && $section['heroWrapper']['couple']['modifiable']) {
                        $section['heroWrapper']['couple']['text'] = 'Ahmad & Siti';
                    }
                    if (isset($section['heroWrapper']['content']['modifiable']) && $section['heroWrapper']['content']['modifiable']) {
                        $section['heroWrapper']['content']['text'] = 'December 15th, 2025';
                    }
                    break;

                case 'couple':
                    // Customize bride and groom names
                    if (isset($section['bride_wrapper']['bride_name']['modifiable']) && $section['bride_wrapper']['bride_name']['modifiable']) {
                        $section['bride_wrapper']['bride_name']['text'] = 'Siti Nurhaliza';
                    }
                    if (isset($section['groom_wrapper']['groom_name']['modifiable']) && $section['groom_wrapper']['groom_name']['modifiable']) {
                        $section['groom_wrapper']['groom_name']['text'] = 'Ahmad Wijaya';
                    }
                    break;

                case 'event':
                    // Customize event details
                    if (isset($section['event_wrapper']['akad_section']['akad_date']['modifiable']) && $section['event_wrapper']['akad_section']['akad_date']['modifiable']) {
                        $section['event_wrapper']['akad_section']['akad_date']['text'] = 'Sabtu, 15 Desember 2025';
                    }
                    if (isset($section['event_wrapper']['akad_section']['akad_time']['modifiable']) && $section['event_wrapper']['akad_section']['akad_time']['modifiable']) {
                        $section['event_wrapper']['akad_section']['akad_time']['text'] = '08:00 - 09:30 WIB';
                    }
                    if (isset($section['event_wrapper']['akad_section']['akad_place']['modifiable']) && $section['event_wrapper']['akad_section']['akad_place']['modifiable']) {
                        $section['event_wrapper']['akad_section']['akad_place']['text'] = 'Masjid Al-Hidayah<br>Jl. Sudirman No. 245, Jakarta Selatan';
                    }

                    if (isset($section['event_wrapper']['resepsi_section']['resepsi_date']['modifiable']) && $section['event_wrapper']['resepsi_section']['resepsi_date']['modifiable']) {
                        $section['event_wrapper']['resepsi_section']['resepsi_date']['text'] = 'Sabtu, 15 Desember 2025';
                    }
                    if (isset($section['event_wrapper']['resepsi_section']['resepsi_time']['modifiable']) && $section['event_wrapper']['resepsi_section']['resepsi_time']['modifiable']) {
                        $section['event_wrapper']['resepsi_section']['resepsi_time']['text'] = '10:00 - 16:00 WIB';
                    }
                    if (isset($section['event_wrapper']['resepsi_section']['resepsi_place']['modifiable']) && $section['event_wrapper']['resepsi_section']['resepsi_place']['modifiable']) {
                        $section['event_wrapper']['resepsi_section']['resepsi_place']['text'] = 'Ballroom Hotel Grand Sahid<br>Jl. Sudirman No. 86, Jakarta Pusat';
                    }

                    // Customize countdown
                    if (isset($section['countdown']['modifiable']) && $section['countdown']['modifiable']) {
                        $section['countdown']['datetime'] = '2025-12-15 08:00:00';
                    }
                    break;

                case 'rsvp':
                    // Customize RSVP description
                    if (isset($section['rsvp']['modifiable']) && $section['rsvp']['modifiable']) {
                        $section['rsvp']['description'] = 'Mohon konfirmasi kehadiran Anda untuk membantu kami mempersiapkan acara pernikahan Ahmad & Siti dengan lebih baik.';
                    }
                    break;

                case 'weddingGift':
                    // Customize gift section
                    if (isset($section['gift']['modifiable']) && $section['gift']['modifiable']) {
                        $section['gift']['accounts'] = [
                            [
                                'bankName' => 'Bank Central Asia',
                                'accountName' => 'Ahmad Wijaya',
                                'accountNumber' => '1234567890'
                            ],
                            [
                                'bankName' => 'Bank Mandiri',
                                'accountName' => 'Siti Nurhaliza',
                                'accountNumber' => '0987654321'
                            ],
                            [
                                'bankName' => 'GoPay',
                                'accountName' => 'Ahmad Wijaya',
                                'accountNumber' => '081234567890'
                            ]
                        ];
                    }
                    break;
            }
        }

        return $sections;
    }
}
