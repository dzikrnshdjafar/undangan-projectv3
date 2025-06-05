<?php

namespace Database\Seeders;

use App\Models\InvitationCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InvitationCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Pernikahan',
            'Ulang Tahun',
            'Seminar',
            'Acara Khitanan',
            'Syukuran Aqiqah',
        ];

        foreach ($categories as $categoryName) {
            InvitationCategory::updateOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => $categoryName, 'description' => "Kategori undangan untuk {$categoryName}."]
            );
        }
    }
}
