<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- 1. Tambahkan ini
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; // <-- 2. Tambahkan ini

class ImageUploadController extends Controller
{
    /**
     * Store a newly created image in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function index()
    {
        $user = Auth::user();
        $userNameSlug = Str::slug($user->name);

        // PERBARUI BARIS INI: Sesuaikan direktori dengan path baru
        $directory = 'images/uploads/' . $userNameSlug; //

        // Ambil semua file dari direktori pengguna di disk 'public'
        $files = Storage::disk('public')->files($directory);

        // Ubah path file menjadi URL yang bisa diakses publik
        $imageUrls = array_map(function ($file) {
            return Storage::url($file);
        }, $files);

        // Urutkan dari yang terbaru (opsional)
        rsort($imageUrls);

        return response()->json($imageUrls);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 3. Dapatkan nama pengguna dan buat path yang aman
        $user = Auth::user();
        $userNameSlug = Str::slug($user->name); // Mengubah "Nama Pengguna" menjadi "nama-pengguna"
        $path = 'images/uploads/' . $userNameSlug; // Path akan menjadi 'uploads/nama-pengguna'

        $filePath = $request->file('image')->store($path, 'public');

        // Kembalikan path yang bisa diakses publik
        return response()->json([
            'success' => true,
            'path' => Storage::url($filePath),
            'relative_path' => $filePath // <-- HANYA $filePath, bukan '/storage/'.$filePath
        ]);
    }
}
