<?php

namespace App\Http\Controllers;

use inertia\inertia;
use App\Models\Invitation;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    public function show($slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        $theme = $invitation->theme; // relasi harus benar
        return inertia::render('Invitations/Show', compact('invitation', 'theme'));
    }
}
