<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\InvitationTheme;
use Illuminate\Database\Seeder;
use App\Models\InvitationCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class InvitationThemeSeeder extends Seeder
{
    public function run(): void
    {
        $weddingCategory = InvitationCategory::where('slug', 'pernikahan')->first();
        $birthdayCategory = InvitationCategory::where('slug', 'ulang-tahun')->first();
        $seminarCategory = InvitationCategory::where('slug', 'seminar')->first();

        if ($weddingCategory) {
            $slug = 'elegant-blue-wedding';
            InvitationTheme::updateOrCreate(
                ['slug' => $slug],
                [
                    'invitation_category_id' => $weddingCategory->id,
                    'name' => 'Elegant Blue Wedding',
                    'description' => 'Tema pernikahan elegan dengan nuansa biru dan emas.',
                    'preview_image_path' => "/images/themes/{$slug}/preview.webp",
                    'background_image_path' => "/images/themes/{$slug}/bg.webp",
                    'sections_json' => json_encode([
                        [
                            'type' => 'opening',
                            'minHeight' => 'clamp(50rem, 100vh, 80rem)',
                            'title' => [
                                'text' => 'Wedding Invitation',
                                'size' => 'clamp(14px, 2vw, 22px)',
                                'color' => '#ffffff',
                                'zIndex' => 2,
                                'position' => 'relative',
                                'padding' => [
                                    'top' => '4rem',
                                    'left' => '0%',
                                    'right' => '0%',
                                ],
                                'style' => [
                                    'fontWeight' => 'bold',
                                    'textShadow' => '4px 4px 2px rgba(0, 0, 0, 0.5)',
                                ]
                            ],
                            'couple' => [
                                'text' => 'Adam & Eve',
                                'size' => 'clamp(32px, 5vw, 60px)',
                                'color' => '#F08080',
                                'zIndex' => 2,
                                'position' => 'relative',
                                'padding' => [
                                    'top' => '4rem',
                                    'left' => '0%',
                                    'right' => '0%',
                                ],
                                'style' => [
                                    'fontWeight' => 'bold',

                                ]
                            ],
                            'content' => [
                                'text' => 'July 04th, 2025',
                                'size' => '2rem',
                                'color' => '#F08080',
                                'zIndex' => 2,
                                'position' => 'relative',
                                'padding' => [
                                    'top' => '4rem',
                                    'left' => '0%',
                                    'right' => '0%',
                                ],
                            ],
                            'photo' => [
                                'path' => "/images/themes/{$slug}/photo.webp",
                                'size' => 'clamp(320px, 65%, 25vw)',
                                'zIndex' => 1,
                                'padding' => [
                                    'bottom' => '0%', // Menempel di atas
                                    'left' => '50%', // Menempel di kanan
                                    'transform' => 'translateX(-50%)', // Pindahkan ke tengah
                                ],
                                'style' => [
                                    "borderTopLeftRadius" => "200px",
                                    "borderTopRightRadius" => "200px",
                                    'border' => '2px solid #f08080', // Menambahkan border putih
                                    'padding' => '10px', // Menambahkan padding border
                                ]
                            ],
                            'ornamenttop1' => [
                                'path' => "/images/themes/{$slug}/ranting-pohon.webp",
                                'size' => 'clamp(20vh, 60%, 300px)',
                                'zIndex' => 1,
                                'padding' => [
                                    'top' => '-5%',
                                    'right' => '-5%',
                                ],
                                'flipX' => true,
                                'animation' => 'waveOut',
                            ],
                            'ornamenttop2' => [
                                'path' => "/images/themes/{$slug}/awan1.webp",
                                'size' => '35vh',
                                'zIndex' => 3,
                                'padding' => [
                                    'top' => '4%',
                                    'left' => '-20%',
                                ],
                                'flipX' => true,
                                'animation' => 'marquee',
                            ],
                            'ornamenttop3' => [
                                'path' => "/images/themes/{$slug}/awan2.webp",
                                'size' => '35%',
                                'zIndex' => 3,
                                'padding' => [
                                    'top' => '20%',
                                    'right' => '20%',
                                ],
                                'flipX' => true,
                                'animation' => 'marquee',
                            ],
                            'ornamentbottom1' => [
                                'path' => "/images/themes/{$slug}/daun4.webp",
                                'size' => '100%',
                                'zIndex' => 1,
                                'padding' => [
                                    'bottom' => '-1%',
                                    'left' => '50%',
                                    'transform' => 'translateX(-50%)',
                                ],
                                'flipX' => false,
                            ],
                            'ornamentbottom2' => [
                                'path' => "/images/themes/{$slug}/bunga2.webp",
                                'size' => '27%',
                                'zIndex' => 1,
                                'padding' => [
                                    'bottom' => '-2%',
                                    'left' => '-2%',
                                ],
                                'flipX' => true,
                                'animation' => 'waveOut',
                            ],
                            'ornamentbottom3' => [
                                'path' => "/images/themes/{$slug}/bunga3.webp",
                                'size' => '20%',
                                'zIndex' => 1,
                                'padding' => [
                                    'bottom' => '-2%',
                                    'left' => '30%',
                                ],
                                'flipX' => false,
                                'animation' => 'waveOut',
                            ],
                            'ornamentbottom4' => [
                                'path' => "/images/themes/{$slug}/bunga1.webp",
                                'size' => '50%',
                                'zIndex' => 1,
                                'padding' => [
                                    'bottom' => '0%',
                                    'right' => '-10%',
                                ],
                                'flipX' => false,
                                'animation' => 'waveOut',
                            ],

                        ],

                        [
                            'type' => 'couple',
                            'height' => '100vh',
                            // 'color' => '#41fa06',
                            'title' => [
                                'text' => 'Selamat Datang di Pernikahan Kami',
                                'size' => '24px',
                                'color' => '#000000',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50, // 50% dari kiri
                                    'y' => 10  // 20% dari atas
                                ]
                            ],
                            'content' => [
                                'text' => 'Kami mengundang Anda untuk hadir...',
                                'size' => '16px',
                                'color' => '#F08080',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50,
                                    'y' => 35
                                ],
                                'animation' => 'bounce'
                            ],
                            'welcome' => [
                                'text' => 'Kepada Yth. Bapak/Ibu/Saudara/i',
                                'size' => '16px',
                                'color' => '#F08080',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50,
                                    'y' => 85
                                ]
                            ],
                            'decoration' => [
                                'path' => "/images/themes/{$slug}/flower2.png",
                                'size' => '50%',
                                'zIndex' => 20,
                                'padding' => [
                                    'x' => 50,
                                    'y' => 50
                                ],
                                'animation' => 'bounce',
                            ],
                            'decoration2' => [
                                'path' => "/images/themes/{$slug}/leaf.webp",
                                'size' => '50%',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 82, // Posisi horizontal dalam pixel dari tengah
                                    'y' => 50 // Posisi vertikal dalam pixel dari tengah
                                ],
                                'animation' => 'sway',
                            ],
                            'decoration3' => [
                                'path' => "/images/themes/{$slug}/leaf2.webp",
                                'size' => '50%',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 18, // Posisi horizontal dalam pixel dari tengah
                                    'y' => 50 // Posisi vertikal dalam pixel dari tengah
                                ],
                                // 'animation' => 'shake',

                            ],
                        ],
                        [
                            'type' => 'event',
                            'title' => 'Waktu & Tempat',
                            'date' => Carbon::create(2025, 6, 15)->format('Y-m-d'),
                            'time' => Carbon::createFromTime(9, 0, 0)->format('H:i:s'),
                            'place' => 'Gedung Serbaguna',
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
                            'type' => 'closing',
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
                    'background_image_path' => '/images/themes/backgrounds/rustic-floral.png',
                    'sections_json' => json_encode([
                        [
                            'type' => 'opening',
                            'title' => 'Selamat Datang di Pernikahan Kami',
                            'content' => 'Kami mengundang Anda untuk hadir dalam hari bahagia kami.'
                        ],
                        [
                            'type' => 'couple',
                            'title' => 'Pasangan Mempelai',
                            'bride' => 'Yanti',
                            'groom' => 'Yanto'
                        ],
                        [
                            'type' => 'event',
                            'title' => 'Waktu & Tempat',
                            'date' => Carbon::create(2025, 7, 20)->format('Y-m-d'),
                            'time' => Carbon::createFromTime(14, 30, 0)->format('H:i:s'),
                            'place' => 'Aula Cinta Kasih',
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
                            'type' => 'closing',
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
                    'background_image_path' => '/images/themes/backgrounds/superhero-blast.png',
                    'sections_json' => json_encode([
                        [
                            'type' => 'opening',
                            'title' => 'Ayo Rayakan Ulang Tahun!',
                            'content' => 'Bergabunglah dalam pesta ulang tahun penuh aksi!'
                        ],
                        [
                            'type' => 'event',
                            'title' => 'Waktu & Tempat',
                            'date' => Carbon::create(2025, 8, 5)->format('Y-m-d'),
                            'time' => Carbon::createFromTime(18, 45, 0)->format('H:i:s'),
                            'place' => 'Rumah Superhero',
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
                            'type' => 'closing',
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
                    'background_image_path' => '/images/themes/backgrounds/modern-corporate.png',
                    'sections_json' => json_encode([
                        [
                            'type' => 'openingv2',
                            'title' => 'Selamat Datang di Seminar',
                            'content' => 'Mari tingkatkan pengetahuan bersama di seminar ini.'
                        ],
                        [
                            'type' => 'event',
                            'title' => 'Waktu & Tempat',
                            'date' => Carbon::create(2025, 9, 12)->format('Y-m-d'),
                            'time' => Carbon::createFromTime(10, 15, 0)->format('H:i:s'),
                            'place' => 'Ballroom Hotel Mewah',
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
                            'type' => 'closing',
                            'title' => 'Penutup',
                            'content' => 'Terima kasih atas partisipasi Anda.'
                        ]
                    ]),
                ]
            );
            $slug2 = 'tung-tung-sahur';
            InvitationTheme::updateOrCreate(
                ['slug' => $slug2],
                [
                    'invitation_category_id' => $weddingCategory->id,
                    'name' => 'Tung Tung Sahur',
                    'description' => 'Tema Ulang Tahun dengan ditemani Tung Tung Sahur.',
                    'preview_image_path' => "/images/themes/{$slug2}/elegant-blue-wedding.jpg",
                    'background_image_path' => "/images/themes/{$slug2}/bg.webp",
                    'sections_json' => json_encode([
                        [
                            'type' => 'opening',
                            'height' => '100vh',
                            // 'color' => '#41fa06',
                            'title' => [
                                'text' => 'Ulang Tahun',
                                'size' => '24px',
                                'color' => '#000000',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50, // 50% dari kiri
                                    'y' => 50  // 20% dari atas
                                ]
                            ],
                            'name' => [
                                'text' => 'Meiske',
                                'size' => '24px',
                                'color' => '#000000',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50, // 50% dari kiri
                                    'y' => 60  // 20% dari atas
                                ]
                            ],
                            'invited' => [
                                'text' => 'Turut Mengundang:',
                                'size' => '16px',
                                'color' => '#F08080',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50,
                                    'y' => 85
                                ]
                            ],
                            'guest' => [
                                'text' => 'Anisa',
                                'size' => '40px',
                                'color' => '#F08080',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50,
                                    'y' => 90
                                ]
                            ],
                            'photo' => [
                                'path' => "/images/themes/{$slug2}/photo.webp", // <-- Gunakan gambar yang sama
                                'size' => '50%',
                                'zIndex' => 1,
                                'padding' => ['x' => 25, 'y' => 20],
                                // 'animation' => 'waveIn',
                            ],
                            'decorationtop' => [
                                'path' => "/images/themes/{$slug2}/awan.webp", // <-- Gunakan gambar yang sama
                                'size' => '100%',
                                'zIndex' => 1,
                                'padding' => ['x' => 50, 'y' => 0],
                                // 'animation' => 'waveIn',
                            ],
                            'decorationbottom1' => [
                                'path' => "/images/themes/{$slug2}/tungtungsahur.webp", // <-- Gunakan gambar yang sama
                                'size' => '50%',
                                'zIndex' => 10,
                                'padding' => ['x' => 85, 'y' => 83],
                            ],
                            'decorationbottom2' => [
                                'path' => "/images/themes/{$slug2}/tungtungsahurbalon.webp", // <-- Gunakan gambar yang sama
                                'size' => '50%',
                                'zIndex' => 10,
                                'padding' => ['x' => 85, 'y' => 83],
                            ]
                        ],
                        [
                            'type' => 'couple',
                            'height' => '100vh',
                            // 'color' => '#41fa06',
                            'title' => [
                                'text' => 'Selamat Datang di Pernikahan Kami',
                                'size' => '24px',
                                'color' => '#000000',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50, // 50% dari kiri
                                    'y' => 10  // 20% dari atas
                                ]
                            ],
                            'content' => [
                                'text' => 'Kami mengundang Anda untuk hadir...',
                                'size' => '16px',
                                'color' => '#F08080',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50,
                                    'y' => 35
                                ],
                                'animation' => 'bounce'
                            ],
                            'welcome' => [
                                'text' => 'Kepada Yth. Bapak/Ibu/Saudara/i',
                                'size' => '16px',
                                'color' => '#F08080',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 50,
                                    'y' => 85
                                ]
                            ],
                            'decoration' => [
                                'path' => "/images/themes/{$slug2}/flower2.png",
                                'size' => '50%',
                                'zIndex' => 20,
                                'padding' => [
                                    'x' => 50,
                                    'y' => 50
                                ],
                                'animation' => 'bounce',
                            ],
                            'decoration2' => [
                                'path' => "/images/themes/{$slug2}/leaf.webp",
                                'size' => '50%',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 82, // Posisi horizontal dalam pixel dari tengah
                                    'y' => 50 // Posisi vertikal dalam pixel dari tengah
                                ],
                                'animation' => 'sway',
                            ],
                            'decoration3' => [
                                'path' => "/images/themes/{$slug2}/leaf2.webp",
                                'size' => '50%',
                                'zIndex' => 1,
                                'padding' => [
                                    'x' => 18, // Posisi horizontal dalam pixel dari tengah
                                    'y' => 50 // Posisi vertikal dalam pixel dari tengah
                                ],
                                // 'animation' => 'shake',

                            ],
                        ],
                        [
                            'type' => 'event',
                            'title' => 'Waktu & Tempat',
                            'date' => Carbon::create(2025, 6, 15)->format('Y-m-d'),
                            'time' => Carbon::createFromTime(9, 0, 0)->format('H:i:s'),
                            'place' => 'Gedung Serbaguna',
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
                            'type' => 'closing',
                            'title' => 'Salam Penutup',
                            'content' => 'Terima kasih atas doa dan restunya.'
                        ]
                    ]),
                ]
            );
        }
    }
}
