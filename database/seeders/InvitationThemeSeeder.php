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
                            'heroWrapper' => [
                                'wrapperStyle' => [
                                    'position' => 'absolute',
                                    'top' => '50%',
                                    'left' => '50%',
                                    'transform' => 'translateX(-50%) translateY(-50%)',
                                    'width' => '100%',
                                    'height' => 'auto',
                                    'textAlign' => 'center',
                                    'color' => '#ffffff',
                                    'zIndex' => 2,
                                    'whiteSpace' => 'pre-line',
                                    'lineHeight' => '1'
                                ],
                                'title' => [
                                    'text' => 'Wedding Invitation',
                                    'order' => 1,
                                    'textStyle' => [
                                        'position' => 'relative',
                                        'left' => '50%',
                                        'transform' => 'translateX(-50%)',
                                        'width' => '100%',
                                        'fontSize' => '2rem',
                                        'color' => '#ffffff',
                                        'zIndex' => 2,
                                        'fontWeight' => 'bold',
                                        'textShadow' => '4px 4px 2px rgba(0, 0, 0, 0.5)',
                                    ]
                                ],
                                'couple' => [
                                    'text' => 'Adam & Eve',
                                    'order' => 2,
                                    'textStyle' => [
                                        'position' => 'relative',
                                        'left' => '50%',
                                        'transform' => 'translateX(-50%)',
                                        'width' => '100%',
                                        'fontSize' => '3rem',
                                        'color' => '#F08080',
                                        'zIndex' => 2,
                                        'fontWeight' => 'bold',
                                    ]
                                ],
                                'content' => [
                                    'text' => 'July 04th, 2025',
                                    'order' => 3,
                                    'textStyle' => [
                                        'position' => 'relative',
                                        'left' => '50%',
                                        'transform' => 'translateX(-50%)',
                                        'width' => '100%',
                                        'fontSize' => '2rem',
                                        'color' => '#F08080',
                                        'zIndex' => 3,
                                    ]
                                ],
                                'photo' => [
                                    'path' => "/images/themes/{$slug}/photo.webp",
                                    'order' => 4,
                                    'imageStyle' => [
                                        'position' => 'relative',
                                        'bottom' => '10%',
                                        'left' => '50%',
                                        'transform' => 'translateX(-50%)',
                                        'width' => '40vh',
                                        'height' => 'auto',
                                        'zIndex' => 1,
                                        'borderTopLeftRadius' => '200px',
                                        'borderTopRightRadius' => '200px',
                                        'border' => '2px solid #f08080',
                                        'padding' => '10px',
                                    ]
                                ],
                            ],

                            'ornamentRanting' => [
                                'path' => "/images/themes/{$slug}/ranting-pohon.webp",
                                'animation' => 'waveOut',
                                'imageStyle' => [
                                    'position' => 'absolute',
                                    'top' => '-2%',
                                    'right' => '-5%',
                                    'width' => '35vh',
                                    'height' => 'auto',
                                    'zIndex' => 1,
                                    'transform' => 'scaleX(-1)',


                                ]
                            ],
                            'ornamentAwanWrapper' => [
                                'animation' => 'marquee',
                                'wrapperStyle' => [
                                    'position' => 'absolute',
                                    'top' => '10%',
                                    'width' => '100%',
                                    'zIndex' => 3,
                                ],
                                'awan1' => [
                                    'path' => "/images/themes/{$slug}/awan1.webp",
                                    'order' => 1,
                                    'imageStyle' => [
                                        'position' => 'relative',
                                        'top' => '20%',
                                        'left' => '-10rem',
                                        'width' => '40%',
                                        'height' => 'auto',
                                        'zIndex' => 3,
                                    ]
                                ],
                                'awan2' => [
                                    'path' => "/images/themes/{$slug}/awan2.webp",
                                    'order' => 2,
                                    'imageStyle' => [
                                        'position' => 'relative',
                                        'left' => '10rem',
                                        'width' => '40%',
                                        'height' => 'auto',
                                        'zIndex' => 3,

                                    ]
                                ],
                            ],
                            // 'ornamentbottom_wrapper' => [
                            //     'wrapperStyle' => [
                            //         'position' => 'absolute',
                            //         'bottom' => '-1%',
                            //         'left' => '-5%',
                            //         'right' => '-5%',
                            //         'zIndex' => 5, // Tingkatkan dari 1 ke 5
                            //     ],
                            //     'ornamentbottom1' => [
                            //         'path' => "/images/themes/{$slug}/daun4.webp",
                            //         'imageStyle' => [
                            //             'position' => 'absolute',
                            //             'bottom' => '-1%',
                            //             'left' => '50%',
                            //             'transform' => 'translateX(-50%)',
                            //             'width' => '100%',
                            //             'height' => 'auto',
                            //             'zIndex' => 1, // Paling rendah dalam wrapper
                            //         ]
                            //     ],
                            //     'ornamentbottom2' => [
                            //         'path' => "/images/themes/{$slug}/bunga2.webp",
                            //         'animation' => 'waveOut',
                            //         'imageStyle' => [
                            //             'position' => 'absolute',
                            //             'bottom' => '-2%',
                            //             'left' => '-2%',
                            //             'width' => '27%',
                            //             'height' => 'auto',
                            //             'zIndex' => 3, // Lebih tinggi dari ornamentbottom1
                            //             'transform' => 'scaleX(-1)',
                            //         ]
                            //     ],
                            //     'ornamentbottom3' => [
                            //         'path' => "/images/themes/{$slug}/bunga3.webp",
                            //         'animation' => 'waveOut',
                            //         'imageStyle' => [
                            //             'position' => 'absolute',
                            //             'bottom' => '-2%',
                            //             'left' => '30%',
                            //             'width' => '20%',
                            //             'height' => 'auto',
                            //             'zIndex' => 3, // Sama tinggi dengan ornamentbottom2
                            //         ]
                            //     ],
                            //     'ornamentbottom4' => [
                            //         'path' => "/images/themes/{$slug}/bunga1.webp",
                            //         'animation' => 'waveOut',
                            //         'imageStyle' => [
                            //             'position' => 'absolute',
                            //             'bottom' => '0%',
                            //             'right' => '-10%',
                            //             'width' => '50%',
                            //             'height' => 'auto',
                            //             'zIndex' => 4, // Paling tinggi dalam wrapper
                            //         ]
                            //     ],
                            // ],
                        ],
                        [
                            "type" => "couple",
                            "minHeight" => "clamp(50rem, 150vh, 80rem)",
                            "title" => [
                                "text" => "Pasangan Mempelai",
                                "order" => 1,
                                "textStyle" => [
                                    "fontSize" => "2rem",
                                    "color" => "#333",
                                    "zIndex" => 2,
                                    "position" => "relative",
                                    "top" => "20px",
                                    "left" => "50%",
                                    "transform" => "translateX(-50%)",
                                    "width" => "100%"
                                ]
                            ],
                            "bride_wrapper" => [
                                "order" => 2,
                                "wrapperStyle" => [
                                    "position" => "relative",
                                    "width" => "70%",
                                    "height" => "100%",
                                    "zIndex" => 2,
                                    "top" => "2rem",
                                    "left" => "50%",
                                    "transform" => "translateX(-50%)"
                                ],
                                "wanita" => [
                                    "path" => "/images/themes/{$slug}/wanita.webp",
                                    "imageStyle" => [
                                        "width" => "100%",
                                        "height" => "auto",
                                        "zIndex" => 3,
                                        "position" => "relative",
                                        "borderRadius" => "50%",
                                        "border" => "2px solid #f08080",
                                        "padding" => "10px"
                                    ]
                                ],
                                "kupupink" => [
                                    "path" => "/images/themes/{$slug}/kupupink.webp",
                                    "imageStyle" => [
                                        "width" => "20%",
                                        "height" => "auto",
                                        "zIndex" => 4,
                                        "position" => "absolute",
                                        "top" => "5px",
                                        "left" => "20%"
                                    ]
                                ],
                                "bride_name" => [
                                    "text" => "Aisyah",
                                    "textStyle" => [
                                        "fontSize" => "clamp(20px, 3vw, 32px)",
                                        "color" => "#F08080",
                                        "zIndex" => 4,
                                        "position" => "relative",
                                        "top" => "10px",
                                        "left" => "50%",
                                        "transform" => "translateX(-50%)",
                                        "width" => "100%"
                                    ]
                                ]
                            ],
                            "content" => [
                                "text" => "Akan Menikah Dengan",
                                "order" => 3,
                                "textStyle" => [
                                    "fontSize" => "2rem",
                                    "color" => "#333",
                                    "zIndex" => 2,
                                    "position" => "relative",
                                    "top" => "30px",
                                    "left" => "50%",
                                    "transform" => "translateX(-50%)",
                                    "width" => "100%"
                                ]
                            ],
                            "groom_wrapper" => [
                                "order" => 4,
                                "wrapperStyle" => [
                                    "position" => "relative",
                                    "zIndex" => 2,
                                    "width" => "70%",
                                    "top" => "30px",
                                    "left" => "50%",
                                    "transform" => "translateX(-50%)"
                                ],
                                "pria" => [
                                    "path" => "/images/themes/{$slug}/pria.webp",
                                    "imageStyle" => [
                                        "width" => "100%",
                                        "height" => "auto",
                                        "zIndex" => 3,
                                        "position" => "relative",
                                        "borderRadius" => "50%",
                                        "border" => "2px solid #f08080",
                                        "padding" => "10px"
                                    ]
                                ],
                                "kupuputih" => [
                                    "path" => "/images/themes/{$slug}/kupuputih.webp",
                                    "imageStyle" => [
                                        "width" => "20%",
                                        "height" => "auto",
                                        "zIndex" => 4,
                                        "position" => "absolute",
                                        "top" => "5px",
                                        "right" => "20%"
                                    ]
                                ],
                                "groom_name" => [
                                    "text" => "Dzikri",
                                    "textStyle" => [
                                        "fontSize" => "clamp(20px, 3vw, 32px)",
                                        "color" => "#F08080",
                                        "zIndex" => 4,
                                        "position" => "relative",
                                        "top" => "10px",
                                        "left" => "50%",
                                        "transform" => "translateX(-50%)",
                                        "width" => "100%"
                                    ]
                                ]
                            ]
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
                            'minHeight' => 'clamp(50rem, 100vh, 80rem)',
                            'heroWrapper' => [
                                'order' => 1,
                                'wrapperStyle' => [
                                    'position' => 'relative',
                                    'top' => '2rem',
                                    'left' => '50%',
                                    'transform' => 'translateX(-50%)',
                                    'width' => '100%',
                                    'height' => '100%',
                                    'textAlign' => 'center',
                                    'color' => '#000000',
                                    'backgroundColor' => 'rgba(255, 255, 255, 0.8)',
                                    'zIndex' => 2,
                                ],
                                'photo' => [
                                    'path' => "/images/themes/{$slug2}/photo.webp",
                                    'imageStyle' => [
                                        'position' => 'absolute',
                                        'top' => '20%',
                                        'left' => '25%',
                                        'width' => '50%',
                                        'height' => 'auto',
                                        'zIndex' => 1,
                                        'borderRadius' => '50%',
                                        'border' => '3px solid #f08080',
                                        'padding' => '5px',
                                    ]
                                ],
                                'title' => [
                                    'text' => 'Ulang Tahun',
                                    'order' => 1,
                                    'textStyle' => [
                                        'position' => 'relative',
                                        'left' => '50%',
                                        'transform' => 'translateX(-50%)',
                                        'width' => '100%',
                                        'fontSize' => '2rem',
                                        'color' => '#000000',
                                        'zIndex' => 2,
                                        'fontWeight' => 'bold',
                                        'textShadow' => '2px 2px 4px rgba(0, 0, 0, 0.3)',
                                    ]
                                ],
                                'couple' => [
                                    'text' => 'Meiske',
                                    'order' => 2,
                                    'textStyle' => [
                                        'position' => 'relative',
                                        'left' => '50%',
                                        'transform' => 'translateX(-50%)',
                                        'width' => '100%',
                                        'fontSize' => '3rem',
                                        'color' => '#F08080',
                                        'zIndex' => 2,
                                        'fontWeight' => 'bold',
                                    ]
                                ],
                                'content' => [
                                    'text' => 'Turut Mengundang:',
                                    'order' => 3,
                                    'textStyle' => [
                                        'position' => 'relative',
                                        'left' => '50%',
                                        'transform' => 'translateX(-50%)',
                                        'width' => '100%',
                                        'fontSize' => '1.5rem',
                                        'color' => '#F08080',
                                        'zIndex' => 3,
                                    ]
                                ],
                                'guest' => [
                                    'text' => 'Anisa',
                                    'order' => 4,
                                    'textStyle' => [
                                        'position' => 'relative',
                                        'left' => '50%',
                                        'transform' => 'translateX(-50%)',
                                        'width' => '100%',
                                        'fontSize' => '2.5rem',
                                        'color' => '#F08080',
                                        'zIndex' => 3,
                                        'fontWeight' => 'bold',
                                    ]
                                ]
                            ],
                            'decorationTop' => [
                                'path' => "/images/themes/{$slug2}/awan.webp",
                                'imageStyle' => [
                                    'position' => 'absolute',
                                    'top' => '0%',
                                    'left' => '50%',
                                    'transform' => 'translateX(-50%)',
                                    'width' => '100%',
                                    'height' => 'auto',
                                    'zIndex' => 1,
                                ]
                            ],
                            'ornamentbottom_wrapper' => [
                                'wrapperStyle' => [
                                    'position' => 'absolute',
                                    'width' => '100%',
                                    'height' => 'auto',
                                    'bottom' => '0%',
                                    'right' => '0%',
                                    'zIndex' => 10,
                                ],
                                'tungtungsahur' => [
                                    'path' => "/images/themes/{$slug2}/tungtungsahur.webp",
                                    'imageStyle' => [
                                        'position' => 'absolute',
                                        'bottom' => '0%',
                                        'right' => '0%',
                                        'width' => '20%',
                                        'height' => 'auto',
                                        'zIndex' => 1,
                                    ]
                                ],
                                'tungtungsahurbalon' => [
                                    'path' => "/images/themes/{$slug2}/tungtungsahurbalon.webp",
                                    'imageStyle' => [
                                        'position' => 'absolute',
                                        'bottom' => '0%',
                                        'left' => '0%',
                                        'width' => '35%',
                                        'height' => 'auto',
                                        'zIndex' => 2,
                                    ]
                                ],
                            ],
                        ],
                        [
                            "type" => "couple",
                            "minHeight" => "clamp(50rem, 150vh, 80rem)",
                            "title" => [
                                "text" => "Selamat Datang di Pernikahan Kami",
                                "order" => 1,
                                "textStyle" => [
                                    "fontSize" => "2rem",
                                    "color" => "#333",
                                    "zIndex" => 2,
                                    "position" => "relative",
                                    "top" => "20px",
                                    "left" => "50%",
                                    "transform" => "translateX(-50%)",
                                    "width" => "100%"
                                ]
                            ],
                            "content_wrapper" => [
                                "order" => 2,
                                "wrapperStyle" => [
                                    "position" => "relative",
                                    "width" => "80%",
                                    "height" => "100%",
                                    "zIndex" => 2,
                                    "top" => "2rem",
                                    "left" => "50%",
                                    "transform" => "translateX(-50%)"
                                ],
                                "welcome_text" => [
                                    "text" => "Kepada Yth. Bapak/Ibu/Saudara/i",
                                    "textStyle" => [
                                        "fontSize" => "1.5rem",
                                        "color" => "#F08080",
                                        "zIndex" => 4,
                                        "position" => "relative",
                                        "top" => "10px",
                                        "left" => "50%",
                                        "transform" => "translateX(-50%)",
                                        "width" => "100%"
                                    ]
                                ],
                                "content_text" => [
                                    "text" => "Kami mengundang Anda untuk hadir...",
                                    "textStyle" => [
                                        "fontSize" => "1.2rem",
                                        "color" => "#F08080",
                                        "zIndex" => 4,
                                        "position" => "relative",
                                        "top" => "20px",
                                        "left" => "50%",
                                        "transform" => "translateX(-50%)",
                                        "width" => "100%"
                                    ]
                                ]
                            ],
                            "decoration_wrapper" => [
                                "order" => 3,
                                "wrapperStyle" => [
                                    "position" => "relative",
                                    "width" => "100%",
                                    "height" => "100%",
                                    "zIndex" => 1,
                                ],
                                "flower2" => [
                                    "path" => "/images/themes/{$slug2}/flower2.png",
                                    "imageStyle" => [
                                        "position" => "absolute",
                                        "top" => "50%",
                                        "left" => "50%",
                                        "transform" => "translate(-50%, -50%)",
                                        "width" => "50%",
                                        "height" => "auto",
                                        "zIndex" => 20,
                                    ]
                                ],
                                "leaf" => [
                                    "path" => "/images/themes/{$slug2}/leaf.webp",
                                    "imageStyle" => [
                                        "position" => "absolute",
                                        "top" => "50%",
                                        "right" => "18%",
                                        "transform" => "translateY(-50%)",
                                        "width" => "50%",
                                        "height" => "auto",
                                        "zIndex" => 1,
                                    ]
                                ],
                                "leaf2" => [
                                    "path" => "/images/themes/{$slug2}/leaf2.webp",
                                    "imageStyle" => [
                                        "position" => "absolute",
                                        "top" => "50%",
                                        "left" => "18%",
                                        "transform" => "translateY(-50%)",
                                        "width" => "50%",
                                        "height" => "auto",
                                        "zIndex" => 1,
                                    ]
                                ],
                            ]
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
