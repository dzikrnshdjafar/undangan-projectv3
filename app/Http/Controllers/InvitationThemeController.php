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

    public function edit($slug)
    {
        $theme = InvitationTheme::where('slug', $slug)->firstOrFail();

        $theme->sections = json_decode($theme->sections_json, true);
        $theme->theme_config = json_decode($theme->theme_config, true);

        $theme->background_image_url = asset("storage" . $theme->background_image_path);

        return Inertia::render('Themes/Editor', [
            'theme' => $theme,
            // Tambahkan baris ini
            'storage_path' => asset('storage')
        ]);
    }

    public function updateSection(Request $request, $themeId, $index)
    {
        $theme = InvitationTheme::findOrFail($themeId);
        $sections = json_decode($theme->sections_json, true);

        // Validasi yang disesuaikan dengan struktur baru
        $request->validate([
            'fieldName' => 'required|string',
            'data' => 'required|array',
            'data.order' => 'nullable|integer',
            'data.text' => 'nullable|string',
            'data.path' => 'nullable|string',
            'data.animation' => 'nullable|string',
            'data.textStyle' => 'nullable|array',
            'data.imageStyle' => 'nullable|array',
            'data.wrapperStyle' => 'nullable|array',
        ]);

        $fieldName = $request->input('fieldName');
        $data = $request->input('data');

        if (isset($sections[$index])) {
            // Mempersiapkan data yang akan disimpan
            $cleanData = [];

            // 1. Properti umum
            if (isset($data['order'])) {
                $cleanData['order'] = (int) $data['order'];
            }

            if (isset($data['animation']) && !empty($data['animation'])) {
                $cleanData['animation'] = $data['animation'];
            }

            // 2. Konten (text atau path)
            if (isset($data['text'])) {
                $cleanData['text'] = $data['text'];
            }

            if (isset($data['path'])) {
                $cleanData['path'] = $data['path'];
            }

            // 3. Style objects
            if (isset($data['textStyle']) && is_array($data['textStyle'])) {
                $cleanData['textStyle'] = $data['textStyle'];
            }

            if (isset($data['imageStyle']) && is_array($data['imageStyle'])) {
                $cleanData['imageStyle'] = $data['imageStyle'];
            }

            if (isset($data['wrapperStyle']) && is_array($data['wrapperStyle'])) {
                $cleanData['wrapperStyle'] = $data['wrapperStyle'];
            }

            // Navigasi ke nested element menggunakan fieldName
            $fieldParts = explode('.', $fieldName);
            $current = &$sections[$index];

            // Traverse ke parent element
            for ($i = 0; $i < count($fieldParts) - 1; $i++) {
                if (!isset($current[$fieldParts[$i]])) {
                    $current[$fieldParts[$i]] = [];
                }
                $current = &$current[$fieldParts[$i]];
            }

            // Update final element
            $finalKey = end($fieldParts);
            if (!isset($current[$finalKey])) {
                $current[$finalKey] = [];
            }

            // Merge dengan data yang sudah ada (untuk mempertahankan properti lain)
            $current[$finalKey] = array_merge($current[$finalKey], $cleanData);
        } else {
            return back()->with('error', 'Section not found!');
        }

        $theme->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $theme->save();

        return back()->with('success', ucfirst($fieldName) . ' updated successfully!');
    }

    public function show($slug)
    {
        $theme = InvitationTheme::where('slug', $slug)->firstOrFail();
        $theme->sections = json_decode($theme->sections_json, true);
        $theme->theme_config = json_decode($theme->theme_config, true);
        $theme->background_image_url = asset("storage" . $theme->background_image_path);

        return Inertia::render('Themes/Show', [
            'theme' => $theme,
            // Tambahkan baris ini
            'storage_path' => asset('storage')
        ]);
    }
}
