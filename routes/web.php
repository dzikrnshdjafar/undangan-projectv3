<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\InvitationThemeController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/invitation/{slug}', [InvitationController::class, 'show'])->name('invitation.show');
Route::get('/themes/{slug}', [InvitationThemeController::class, 'show'])->name('themes.show');

Route::get('/themes/{slug}/edit', [InvitationThemeController::class, 'edit'])->name('themes.edit'); // Pastikan hanya user terautentikasi yang bisa edit
Route::put('/themes/{theme}/sections/{index}', [InvitationThemeController::class, 'updateSection']);

Route::get('/themes', [InvitationThemeController::class, 'index'])->name('themes.index');
Route::get('/plans', [PlanController::class, 'index'])->name('plans.inertia');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
