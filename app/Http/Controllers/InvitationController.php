<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Invitation;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\InvitationTheme;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class InvitationController extends Controller
{
    /**
     * Store a newly created invitation from a theme.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */

    public function index()
    {
        $user = Auth::user();

        // Mulai query builder untuk model Invitation
        $query = Invitation::query();

        // Jika pengguna yang login BUKAN admin, filter undangan berdasarkan user_id
        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }

        // Lanjutkan query untuk mengambil data yang diperlukan
        $invitations = $query->with('theme:id,name,preview_image_path') // Eager load theme info
            ->with('user:id,name') // Tambahkan ini untuk melihat pemilik undangan (opsional)
            ->latest()
            ->get()
            ->map(function ($invitation) {
                // Tambahkan URL gambar pratinjau
                $invitation->preview_image_url = $invitation->theme->preview_image_path
                    ? asset('storage' . $invitation->theme->preview_image_path)
                    : null;
                return $invitation;
            });

        return Inertia::render('Invitations/Index', [
            'invitations' => $invitations,
        ]);
    }
    /**
     * Show the form for editing the specified invitation.
     */
    public function edit(Invitation $invitation)
    {
        Gate::authorize('update', $invitation);
        // Authorize that the user owns the invitation
        $invitation->background_image_url = $invitation->background_image_path
            ? asset('storage' . $invitation->background_image_path)
            : null;
        // --- END TAMBAHAN ---

        return Inertia::render('Invitations/Editor', [
            'invitation' => $invitation,
            'storage_path' => asset('storage')
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'theme_id' => 'required|exists:invitation_themes,id',
        ]);

        $theme = InvitationTheme::findOrFail($request->input('theme_id'));
        $user = Auth::user();

        // Generate a unique slug for the invitation URL
        $slug = Str::slug($user->name . '-' . $theme->name) . '-' . strtolower(Str::random(6));

        // Create the invitation by copying data from the theme
        $invitation = Invitation::create([
            'user_id' => $user->id,
            'invitation_theme_id' => $theme->id,
            'slug' => $slug,
            'title' => 'Undangan ' . $theme->name, // Default title
            'sections_json' => $theme->sections_json,
            'background_image_path' => $theme->background_image_path,
        ]);

        // Redirect to the newly created invitation page
        return redirect()->route('invitations.show', ['slug' => $invitation->slug])
            ->with('success', 'Selamat! Undangan Anda berhasil dibuat.');
    }

    /**
     * Display the specified invitation.
     *
     * @param  string  $slug
     * @return \Inertia\Response
     */
    public function show($slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();

        // Prepare the data for the preview component
        // The structure should be similar to the theme for reusability
        $themeData = [
            'name' => $invitation->title,
            'sections' => json_decode($invitation->sections_json, true),
            'background_image_url' => asset("storage" . $invitation->background_image_path),
        ];

        return Inertia::render('Invitations/Show', [
            'invitation' => $invitation,
            'theme' => $themeData, // Pass the prepared data to the view
            'storage_path' => asset('storage')
        ]);
    }

    public function updateSection(Request $request, Invitation $invitation)
    {
        Gate::authorize('update', $invitation);

        if ($invitation->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Validasi yang sama dengan di Theme Editor - lengkap seperti di InvitationThemeController
        $request->validate([
            'fieldName' => 'required|string',
            'data' => 'required|array',

            // Properti umum
            'data.type' => 'nullable|string|in:wrapper,text,image,button,video,iframe,countdown,rsvp,gift',
            'data.order' => 'nullable|integer',
            'data.animation' => 'nullable|string',

            // Content properties
            'data.text' => 'nullable|string',
            'data.path' => 'nullable|string',
            'data.src' => 'nullable|string',
            'data.href' => 'nullable|string',
            'data.target' => 'nullable|string|in:_self,_blank,_parent,_top',
            'data.onClick' => 'nullable|string',
            'data.alt' => 'nullable|string',
            'data.title' => 'nullable',

            // Video properties
            'data.controls' => 'nullable|boolean',
            'data.autoPlay' => 'nullable|boolean',
            'data.muted' => 'nullable|boolean',
            'data.loop' => 'nullable|boolean',
            'data.allowFullScreen' => 'nullable|boolean',

            // Countdown properties
            'data.datetime' => 'nullable|date_format:Y-m-d H:i:s',

            // RSVP properties
            'data.description' => 'nullable|string',
            'data.buttonText' => 'nullable|string',

            // Gift properties
            'data.bankName' => 'nullable|string',
            'data.accountNumber' => 'nullable|string',
            'data.accountName' => 'nullable|string',
            'data.accounts' => 'nullable|array',

            // Style objects
            'data.textStyle' => 'nullable|array',
            'data.imageStyle' => 'nullable|array',
            'data.wrapperStyle' => 'nullable|array',
            'data.buttonStyle' => 'nullable|array',
            'data.videoStyle' => 'nullable|array',
            'data.iframeStyle' => 'nullable|array',
            'data.itemStyle' => 'nullable|array',
            'data.countdownStyle' => 'nullable|array',
            'data.titleStyle' => 'nullable|array',
            'data.timerStyle' => 'nullable|array',
            'data.unitStyle' => 'nullable|array',
            'data.rsvpStyle' => 'nullable|array',
            'data.rsvpTitleStyle' => 'nullable|array',
            'data.rsvpDescriptionStyle' => 'nullable|array',
            'data.rsvpFormStyle' => 'nullable|array',
            'data.rsvpInputStyle' => 'nullable|array',
            'data.rsvpButtonStyle' => 'nullable|array',
            'data.giftStyle' => 'nullable|array',
            'data.giftBoxStyle' => 'nullable|array',
            'data.giftBankNameStyle' => 'nullable|array',
            'data.giftAccountNameStyle' => 'nullable|array',
            'data.giftAccountNumberStyle' => 'nullable|array',
            'data.giftButtonStyle' => 'nullable|array',
        ]);

        // PERBAIKAN: Decode JSON string menjadi array terlebih dahulu
        $sections = json_decode($invitation->sections_json, true);
        $index = $request->route('index');

        if (!isset($sections[$index])) {
            return back()->with('error', 'Section not found!');
        }

        $fieldName = $request->input('fieldName');
        $data = $this->prepareElementData($request->input('data'));

        // Navigasi ke nested element menggunakan fieldName
        $fieldParts = explode('.', $fieldName);
        $current = &$sections[$index];

        // Traverse ke parent element
        for ($i = 0; $i < count($fieldParts) - 1; $i++) {
            if (!isset($current[$fieldParts[$i]])) {
                return back()->with('error', 'Invalid element path!');
            }
            $current = &$current[$fieldParts[$i]];
        }

        // Update final element
        $finalKey = end($fieldParts);
        if (!isset($current[$finalKey])) {
            $current[$finalKey] = [];
        }

        // Merge dengan data yang sudah ada (untuk mempertahankan properti lain)
        $current[$finalKey] = array_merge($current[$finalKey] ?? [], $data);

        // PERBAIKAN: Encode kembali menjadi JSON string sebelum disimpan
        $invitation->sections_json = json_encode($sections, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        $invitation->save();

        return back()->with('success', ucfirst(str_replace('.', ' > ', $fieldName)) . ' updated successfully!');
    }

    /**
     * Prepare and clean element data - sama seperti di InvitationThemeController
     */
    private function prepareElementData(array $data): array
    {
        $cleanData = [];

        // 1. Properti umum untuk semua element
        if (isset($data['type'])) $cleanData['type'] = $data['type'];
        if (isset($data['order'])) $cleanData['order'] = (int) $data['order'];
        if (isset($data['animation']) && !empty($data['animation'])) $cleanData['animation'] = $data['animation'];

        // 2. Content properties
        if (isset($data['text'])) $cleanData['text'] = $data['text'];
        if (isset($data['path'])) $cleanData['path'] = $data['path'];
        if (isset($data['src'])) $cleanData['src'] = $data['src'];
        if (isset($data['href'])) $cleanData['href'] = $data['href'];
        if (isset($data['target'])) $cleanData['target'] = $data['target'];
        if (isset($data['onClick'])) $cleanData['onClick'] = $data['onClick'];
        if (isset($data['alt'])) $cleanData['alt'] = $data['alt'];
        if (isset($data['title'])) {
            $cleanData['title'] = $data['title'];
        }

        // 3. Video properties
        if (isset($data['controls'])) $cleanData['controls'] = (bool) $data['controls'];
        if (isset($data['autoPlay'])) $cleanData['autoPlay'] = (bool) $data['autoPlay'];
        if (isset($data['muted'])) $cleanData['muted'] = (bool) $data['muted'];
        if (isset($data['loop'])) $cleanData['loop'] = (bool) $data['loop'];
        if (isset($data['allowFullScreen'])) $cleanData['allowFullScreen'] = (bool) $data['allowFullScreen'];

        // 4. Countdown properties
        if (isset($data['datetime'])) $cleanData['datetime'] = $data['datetime'];

        // 5. RSVP properties
        if (isset($data['description'])) $cleanData['description'] = $data['description'];
        if (isset($data['buttonText'])) $cleanData['buttonText'] = $data['buttonText'];

        // 6. Gift properties
        if (isset($data['bankName'])) $cleanData['bankName'] = $data['bankName'];
        if (isset($data['accountNumber'])) $cleanData['accountNumber'] = $data['accountNumber'];
        if (isset($data['accountName'])) $cleanData['accountName'] = $data['accountName'];
        if (isset($data['accounts'])) $cleanData['accounts'] = $data['accounts'];

        // 7. Style objects
        $styleTypes = [
            'textStyle',
            'imageStyle',
            'wrapperStyle',
            'buttonStyle',
            'videoStyle',
            'iframeStyle',
            'itemStyle',
            'countdownStyle',
            'titleStyle',
            'timerStyle',
            'unitStyle',
            'rsvpStyle',
            'rsvpTitleStyle',
            'rsvpDescriptionStyle',
            'rsvpFormStyle',
            'rsvpInputStyle',
            'rsvpButtonStyle',
            'giftStyle',
            'giftBoxStyle',
            'giftBankNameStyle',
            'giftAccountNameStyle',
            'giftAccountNumberStyle',
            'giftButtonStyle'
        ];

        foreach ($styleTypes as $styleType) {
            if (isset($data[$styleType])) {
                if (is_array($data[$styleType])) {
                    $cleanData[$styleType] = $data[$styleType];
                } elseif (is_string($data[$styleType])) {
                    $decoded = json_decode($data[$styleType], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $cleanData[$styleType] = $decoded;
                    }
                }
            }
        }

        return $cleanData;
    }
}
