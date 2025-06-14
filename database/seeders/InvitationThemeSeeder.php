<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InvitationTheme;
use App\Models\InvitationCategory;
use Illuminate\Support\Facades\File; // Pastikan untuk mengimpor facade File
use Illuminate\Support\Str;

class InvitationThemeSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil path ke direktori tema JSON
        $path = database_path('seeders/themes/*.json');

        // Ambil semua kategori sekali saja untuk efisiensi
        $categories = InvitationCategory::all()->keyBy('slug');

        // Gunakan glob untuk mendapatkan semua file JSON
        foreach (glob($path) as $filename) {
            // Baca konten file
            $jsonContent = File::get($filename);

            // Ganti placeholder __SLUG__ dengan nama file (tanpa ekstensi .json)
            $slugFromFile = basename($filename, '.json');
            $jsonContent = Str::replace('__SLUG__', $slugFromFile, $jsonContent);

            // Decode string JSON menjadi array PHP
            $data = json_decode($jsonContent, true);

            // Dapatkan ID kategori dari slug yang ada di JSON
            $category = $categories[$data['category_slug']] ?? null;

            // Lanjutkan hanya jika kategori ditemukan
            if (!$category) {
                $this->command->warn("Skipping theme {$data['name']}. Category '{$data['category_slug']}' not found.");
                continue;
            }

            // Encode kembali bagian 'sections' menjadi string JSON untuk disimpan di database
            $sectionsJsonString = json_encode($data['sections'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            // Gunakan updateOrCreate untuk membuat atau memperbarui tema
            InvitationTheme::updateOrCreate(
                ['slug' => $data['slug']], // Kunci untuk mencari
                [
                    'invitation_category_id' => $category->id,
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'preview_image_path' => $data['preview_image_path'],
                    'background_image_path' => $data['background_image_path'],
                    'sections_json' => $sectionsJsonString, // Simpan sebagai string JSON
                ]
            );

            $this->command->info("Theme '{$data['name']}' seeded successfully.");
        }
    }
}
