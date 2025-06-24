<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Invitation;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    public function show($slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        $theme = $invitation->theme;

        // Parse JSON sections
        $theme->sections = json_decode($theme->sections_json, true);
        $theme->theme_config = json_decode($theme->theme_config, true);

        // Generate URLs for assets
        $theme->background_image_url = asset("storage" . $theme->background_image_path);

        return Inertia::render('Invitations/Show', [
            'invitation' => $invitation,
            'theme' => $theme,
            'storage_path' => asset('storage')
        ]);
    }
}
