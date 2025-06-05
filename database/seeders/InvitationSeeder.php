<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invitation;
use App\Models\InvitationTheme;
use App\Models\User;
use Illuminate\Support\Str;

class InvitationSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first(); // Ambil user pertama (atau sesuaikan)
        $theme = InvitationTheme::where('slug', 'elegant-blue-wedding')->first();

        if ($user && $theme) {
            Invitation::updateOrCreate(
                ['slug' => 'dzikri-aisyah-wedding'],
                [
                    'user_id' => $user->id,
                    'invitation_theme_id' => $theme->id,
                    'slug' => 'dzikri-aisyah-wedding',
                    'title' => 'Pernikahan Dzikri & Aisyah',
                    'cover_image_path' => '/images/covers/sample-wedding.jpg',
                    'event_name' => 'Akad Nikah & Resepsi',
                    'event_date' => '2025-06-10',
                    'event_time_start' => '10:00',
                    'event_time_end' => '13:00',
                    'venue_name' => 'Gedung Serbaguna',
                    'venue_address' => 'Jl. Bahagia No. 123, Jakarta',
                    'venue_maps_link' => 'https://maps.google.com/?q=Gedung+Serbaguna',
                    'greeting_message' => 'Assalamu’alaikum, dengan bahagia kami mengundang Anda hadir di hari istimewa kami.',
                    'closing_message' => 'Terima kasih atas doa dan restunya.',
                    'details' => [
                        'opening' => [
                            'title' => 'Selamat Datang di Pernikahan Kami',
                            'content' => 'Kami mengundang Anda untuk hadir dalam hari bahagia kami.'
                        ],
                        'mempelai' => [
                            'groom_name' => 'Dzikri',
                            'bride_name' => 'Aisyah',
                            'groom_parents' => 'Bpk. Ahmad & Ibu Siti',
                            'bride_parents' => 'Bpk. Budi & Ibu Ani',
                        ],
                        'waktu-acara' => [
                            'title' => 'Waktu & Tempat',
                            'content' => 'Sabtu, 13 Juni 2025, 10:00 WIB di Gedung Serbaguna'
                        ],
                        'gallery' => [
                            '/images/gallery/1.jpg',
                            '/images/gallery/2.jpg',
                            '/images/gallery/3.jpg',
                        ],
                        'rsvp' => [
                            'contact_name' => 'Dzikri',
                            'contact_phone' => '08123456789',
                            'form_link' => 'https://forms.gle/abcd1234'
                        ],
                        'salam' => [
                            'title' => 'Salam Penutup',
                            'content' => 'Terima kasih atas doa dan restunya. Mohon maaf apabila ada kekurangan dalam penyambutan kami.'
                        ]
                    ],
                    'is_published' => true,
                    'published_at' => now(),
                    'view_count' => 0,
                ]
            );

            // Tambahkan undangan lain sebagai contoh
            Invitation::updateOrCreate(
                ['slug' => 'budi-ani-wedding'],
                [
                    'user_id' => $user->id,
                    'invitation_theme_id' => $theme->id,
                    'slug' => 'budi-ani-wedding',
                    'title' => 'Pernikahan Budi & Ani',
                    'cover_image_path' => '/images/covers/sample-wedding2.jpg',
                    'event_name' => 'Akad & Resepsi',
                    'event_date' => '2025-07-15',
                    'event_time_start' => '09:00',
                    'event_time_end' => '12:00',
                    'venue_name' => 'Aula Cinta Kasih',
                    'venue_address' => 'Jl. Mawar No. 45, Bandung',
                    'venue_maps_link' => 'https://maps.google.com/?q=Aula+Cinta+Kasih',
                    'greeting_message' => 'Dengan penuh kebahagiaan, kami mengundang Anda hadir di hari istimewa kami.',
                    'closing_message' => 'Terima kasih atas kehadiran dan doa restu Anda.',
                    'details' => [
                        'opening' => [
                            'title' => 'Selamat Datang di Pernikahan Kami',
                            'content' => 'Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir.'
                        ],
                        'mempelai' => [
                            'groom_name' => 'Budi',
                            'bride_name' => 'Ani',
                            'groom_parents' => 'Bpk. Slamet & Ibu Sri',
                            'bride_parents' => 'Bpk. Joko & Ibu Dewi',
                        ],
                        'waktu-acara' => [
                            'title' => 'Waktu & Tempat',
                            'content' => 'Selasa, 15 Juli 2025, 09:00 WIB di Aula Cinta Kasih'
                        ],
                        'gallery' => [
                            '/images/gallery/4.jpg',
                            '/images/gallery/5.jpg',
                        ],
                        'rsvp' => [
                            'contact_name' => 'Budi',
                            'contact_phone' => '08129876543',
                            'form_link' => 'https://forms.gle/efgh5678'
                        ],
                        'salam' => [
                            'title' => 'Salam Penutup',
                            'content' => 'Kami sekeluarga mengucapkan terima kasih atas kehadiran dan doa restu Anda.'
                        ]
                    ],
                    'is_published' => true,
                    'published_at' => now(),
                    'view_count' => 0,
                ]
            );
        }
    }
}
