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
