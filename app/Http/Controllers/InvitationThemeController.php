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

        // Validasi input
        $request->validate([
            'field' => 'required|in:title,content,content2',
            'data.text' => 'required|string',
            'data.color' => 'required|string',
            'data.size' => 'required|string',
        ]);

        $field = $request->input('field'); // 'title' or 'content'
        $data = $request->input('data');

        // Decode line breaks
        $text = str_replace('\\n', "\n", $data['text']);

        \Log::info("Updating {$field} for section {$index}", [
            'field' => $field,
            'text' => json_encode($text),
            'color' => $data['color'],
            'size' => $data['size']
        ]);

        // Update hanya field yang diubah
        $sections[$index][$field] = [
            'text' => $text,
            'color' => $data['color'],
            'size' => $data['size']
        ];

        $theme->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $theme->save();

        return back()->with('success', ucfirst($field) . ' updated successfully!');
    }

    public function show($slug)
    {
        $theme = InvitationTheme::where('slug', $slug)->firstOrFail();
        $theme->sections = json_decode($theme->sections_json, true);
        $theme->background_image_url = asset("storage" . $theme->background_image_path);

        // dd("storage" . $theme->preview_image_path);

        return Inertia::render('Themes/Show', [
            'theme' => $theme
        ]);
    }
}
