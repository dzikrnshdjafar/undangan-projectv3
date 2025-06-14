<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\InvitationTheme;

class InvitationThemeController extends Controller
{
    public function index()
    {
        $themes = InvitationTheme::all();
        return Inertia::render('Themes/Index', [
            'themes' => $themes
        ]);
    }

    public function updateSection(Request $request, $themeId, $index)
    {
        $theme = InvitationTheme::findOrFail($themeId);
        $sections = json_decode($theme->sections_json, true);

        // Validasi tetap sama dan sudah benar
        $request->validate([
            'fieldName' => 'required|string',
            'data' => 'required|array',
            'data.size' => 'required|string',
            'data.padding' => 'nullable|array',
            'data.padding.top' => 'nullable|string',
            'data.padding.bottom' => 'nullable|string',
            'data.padding.left' => 'nullable|string',
            'data.padding.right' => 'nullable|string',
            'data.text' => 'nullable|string',
            'data.path' => 'nullable|string',
            'data.color' => 'nullable|string',
            'data.zIndex' => 'nullable|integer',
            'data.animation' => 'nullable|string',
            'data.flipX' => 'nullable|boolean',
            'data.style' => 'nullable|array', // <-- TAMBAHKAN INI
            'data.position' => 'nullable|string', // Tambahkan validasi untuk position
        ]);

        $fieldName = $request->input('fieldName');
        $data = $request->input('data');

        if (isset($sections[$index])) {

            // ===================================
            // PERBAIKAN LOGIKA PENYIMPANAN DATA
            // ===================================

            // 1. Mulai dengan properti yang PASTI ADA dan UMUM untuk semua field
            $cleanData = [
                'size' => $data['size'],
                'padding' => $data['padding'],
                'position' => $data['position'] ?? '', // Ambil position, beri default string kosong jika tidak ada
                // Ambil zIndex, beri nilai default 1 jika tidak ada
                'zIndex' => $data['zIndex'] ?? 1,
                'flipX' => $data['flipX'] ?? false, // Default ke false jika tidak ada
                'style' => $data['style'] ?? [], // Ambil style, beri default array kosong jika tidak ada
            ];

            // 2. Tambahkan properti yang spesifik untuk Tipe Field (teks atau gambar)
            if (isset($data['path'])) {
                // Properti khusus untuk gambar
                $cleanData['path'] = $data['path'];
            } else {
                // Properti khusus untuk teks
                $cleanData['text'] = str_replace('\\n', "\n", $data['text'] ?? '');
                $cleanData['color'] = $data['color'] ?? '#000000'; // Beri default color
            }

            // 3. Tambahkan properti OPSIONAL yang bisa ada di semua field (seperti animasi)
            if (isset($data['animation']) && !empty($data['animation'])) {
                $cleanData['animation'] = $data['animation'];
            }

            // Simpan data yang sudah lengkap dan bersih
            $sections[$index][$fieldName] = $cleanData;
        } else {
            return back()->with('error', 'Section not found!');
        }

        $theme->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $theme->save();

        return back()->with('success', ucfirst($fieldName) . ' updated successfully!');
    }

    public function updateEntireSection(Request $request, $themeId, $index)
    {
        $theme = InvitationTheme::findOrFail($themeId);
        $sections = json_decode($theme->sections_json, true);

        // Validasi bahwa data yang dikirim adalah array (objek section)
        $request->validate([
            'sectionData' => 'required|array'
        ]);

        // Periksa apakah section-nya ada
        if (isset($sections[$index])) {
            // Langsung ganti seluruh objek section dengan data baru
            $sections[$index] = $request->input('sectionData');
        } else {
            return back()->with('error', 'Section not found!');
        }

        $theme->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $theme->save();

        return back()->with('success', 'Section updated successfully!');
    }


    public function show($slug)
    {
        $theme = InvitationTheme::where('slug', $slug)->firstOrFail();
        $theme->sections = json_decode($theme->sections_json, true);
        $theme->theme_config = json_decode($theme->theme_config, true);
        $theme->background_image_url = asset("storage" . $theme->background_image_path);

        return Inertia::render('Themes/Show', [
            'theme' => $theme
        ]);
    }
}
