<?php

namespace Database\Seeders;

use App\Models\InvitationCategory;
use App\Models\InvitationTheme;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InvitationThemeSeeder extends Seeder
{
    public function run(): void
    {
        $weddingCategory = InvitationCategory::where('slug', 'pernikahan')->first();
        $birthdayCategory = InvitationCategory::where('slug', 'ulang-tahun')->first();
        $seminarCategory = InvitationCategory::where('slug', 'seminar')->first();

        if ($weddingCategory) {
            InvitationTheme::updateOrCreate(
                ['slug' => 'elegant-blue-wedding'],
                [
                    'invitation_category_id' => $weddingCategory->id,
                    'name' => 'Elegant Blue Wedding',
                    'description' => 'Tema pernikahan elegan dengan nuansa biru dan emas.',
                    'preview_image_path' => '/images/themes/previews/elegant-blue-wedding.jpg',
                    'view_name' => 'themes.dynamic', // Ganti ke view dinamis
                    'background_image_path' => '/images/themes/backgrounds/elegant-blue.png',
                    'sections_json' => json_encode([
                        [
                            'type' => 'opening',
                            'title' => 'Selamat Datang di Pernikahan Kami',
                            'content' => 'Kami mengundang Anda untuk hadir dalam hari bahagia kami.'
                        ],
                        [
                            'type' => 'mempelai',
                            'title' => 'Mempelai',
                            'content' => 'Andi & Bunga'
                        ],
                        [
                            'type' => 'waktu-acara',
                            'title' => 'Waktu & Tempat',
                            'content' => 'Sabtu, 10 Juni 2025, 10:00 WIB di Gedung Serbaguna'
                        ],
                        [
                            'type' => 'gallery',
                            'title' => 'Galeri',
                            'images' => [
                                '/images/gallery/1.jpg',
                                '/images/gallery/2.jpg'
                            ]
                        ],
                        [
                            'type' => 'rsvp',
                            'title' => 'Konfirmasi Kehadiran'
                        ],
                        [
                            'type' => 'salam',
                            'title' => 'Salam Penutup',
                            'content' => 'Terima kasih atas doa dan restunya.'
                        ]
                    ]),
                ]
            );
            InvitationTheme::updateOrCreate(
                ['slug' => 'rustic-floral-wedding'],
                [
                    'invitation_category_id' => $weddingCategory->id,
                    'name' => 'Rustic Floral Wedding',
                    'description' => 'Tema pernikahan rustic dengan dekorasi bunga yang hangat.',
                    'preview_image_path' => '/images/themes/previews/rustic-floral-wedding.jpg',
                    'view_name' => 'themes.dynamic',
                    'background_image_path' => '/images/themes/backgrounds/rustic-floral.png',
                    'sections_json' => json_encode([
                        [
                            'type' => 'opening',
                            'title' => 'Selamat Datang di Pernikahan Kami',
                            'content' => 'Kami mengundang Anda untuk hadir dalam hari bahagia kami.'
                        ],
                        [
                            'type' => 'mempelai',
                            'title' => 'Mempelai',
                            'content' => 'Budi & Ani'
                        ],
                        [
                            'type' => 'waktu-acara',
                            'title' => 'Waktu & Tempat',
                            'content' => 'Selasa, 15 Juli 2025, 09:00 WIB di Aula Cinta Kasih'
                        ],
                        [
                            'type' => 'gallery',
                            'title' => 'Galeri',
                            'images' => [
                                '/images/gallery/4.jpg',
                                '/images/gallery/5.jpg'
                            ]
                        ],
                        [
                            'type' => 'rsvp',
                            'title' => 'Konfirmasi Kehadiran'
                        ],
                        [
                            'type' => 'salam',
                            'title' => 'Salam Penutup',
                            'content' => 'Kami sekeluarga mengucapkan terima kasih atas kehadiran dan doa restu Anda.'
                        ]
                    ]),
                ]
            );

            InvitationTheme::updateOrCreate(
                ['slug' => 'superhero-blast-birthday'],
                [
                    'invitation_category_id' => $birthdayCategory->id,
                    'name' => 'Superhero Blast Birthday',
                    'description' => 'Tema ulang tahun seru dengan karakter superhero.',
                    'preview_image_path' => '/images/themes/previews/superhero-blast-birthday.jpg',
                    'view_name' => 'themes.dynamic',
                    'background_image_path' => '/images/themes/backgrounds/superhero-blast.png',
                    'sections_json' => json_encode([
                        [
                            'type' => 'opening',
                            'title' => 'Ayo Rayakan Ulang Tahun!',
                            'content' => 'Bergabunglah dalam pesta ulang tahun penuh aksi!'
                        ],
                        [
                            'type' => 'waktu-acara',
                            'title' => 'Waktu & Tempat',
                            'content' => 'Minggu, 20 Agustus 2025, 15:00 WIB di Rumah Superhero'
                        ],
                        [
                            'type' => 'gallery',
                            'title' => 'Galeri',
                            'images' => [
                                '/images/gallery/6.jpg',
                                '/images/gallery/7.jpg'
                            ]
                        ],
                        [
                            'type' => 'rsvp',
                            'title' => 'Konfirmasi Kehadiran'
                        ],
                        [
                            'type' => 'salam',
                            'title' => 'Salam Penutup',
                            'content' => 'Sampai jumpa di pesta ulang tahun super seru!'
                        ]
                    ]),
                ]
            );

            InvitationTheme::updateOrCreate(
                ['slug' => 'modern-corporate-seminar'],
                [
                    'invitation_category_id' => $seminarCategory->id,
                    'name' => 'Modern Corporate Seminar',
                    'description' => 'Tema seminar profesional dan modern.',
                    'preview_image_path' => '/images/themes/previews/modern-corporate-seminar.jpg',
                    'view_name' => 'themes.dynamic',
                    'background_image_path' => '/images/themes/backgrounds/modern-corporate.png',
                    'sections_json' => json_encode([
                        [
                            'type' => 'openingv2',
                            'title' => 'Selamat Datang di Seminar',
                            'content' => 'Mari tingkatkan pengetahuan bersama di seminar ini.'
                        ],
                        [
                            'type' => 'waktu-acara',
                            'title' => 'Waktu & Tempat',
                            'content' => 'Sabtu, 5 Oktober 2025, 09:00 WIB di Ballroom Hotel Mewah'
                        ],
                        [
                            'type' => 'gallery',
                            'title' => 'Galeri',
                            'images' => [
                                '/images/gallery/8.jpg',
                                '/images/gallery/9.jpg'
                            ]
                        ],
                        [
                            'type' => 'rsvp',
                            'title' => 'Konfirmasi Kehadiran'
                        ],
                        [
                            'type' => 'salam',
                            'title' => 'Penutup',
                            'content' => 'Terima kasih atas partisipasi Anda.'
                        ]
                    ]),
                ]
            );
        }
    }
}
