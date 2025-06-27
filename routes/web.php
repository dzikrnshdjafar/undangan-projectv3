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
Route::get('/themes/{slug}', [InvitationThemeController::class, 'show'])->name('themes.show');

Route::get('/themes/{slug}/edit', [InvitationThemeController::class, 'edit'])->name('themes.edit'); // Pastikan hanya user terautentikasi yang bisa edit
Route::put('/themes/{theme}/sections/{index}', [InvitationThemeController::class, 'updateSection']);
Route::post('/themes/{themeId}/sections', [InvitationThemeController::class, 'addSection'])->name('themes.sections.add');
Route::post('/themes/{themeId}/sections/{sectionIndex}/elements', [InvitationThemeController::class, 'addElement'])->name('themes.sections.elements.add');
Route::delete('/themes/{themeId}/sections/{sectionIndex}/elements', [InvitationThemeController::class, 'deleteElement'])->name('themes.sections.elements.delete');
Route::delete('/themes/{themeId}/sections/{sectionIndex}', [InvitationThemeController::class, 'deleteSection'])->name('themes.sections.delete');



Route::get('/themes', [InvitationThemeController::class, 'index'])->name('themes.index');
Route::get('/plans', [PlanController::class, 'index'])->name('plans.inertia');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // --- Invitation Routes ---
    Route::get('/my-invitations', [InvitationController::class, 'index'])->name('invitations.index');
    Route::post('/invitations/create-from-theme', [InvitationController::class, 'store'])->name('invitations.store');
    Route::get('/invitations/{invitation:slug}/edit', [InvitationController::class, 'edit'])->name('invitations.edit');
    Route::put('/invitations/{invitation:slug}/sections/{index}', [InvitationController::class, 'updateSection'])->name('invitations.sections.update');
    Route::post('/invitations/{invitation:slug}/sections', [InvitationController::class, 'addSection'])->name('invitations.sections.add');
    Route::delete('/invitations/{invitation:slug}/sections/{sectionIndex}', [InvitationController::class, 'deleteSection'])->name('invitations.sections.delete');
    Route::post('/invitations/{invitation:slug}/sections/{sectionIndex}/elements', [InvitationController::class, 'addElement'])->name('invitations.elements.add');
    Route::delete('/invitations/{invitation:slug}/sections/{sectionIndex}/elements', [InvitationController::class, 'deleteElement'])->name('invitations.elements.delete');
});

Route::get('/invitation/{slug}', [InvitationController::class, 'show'])->name('invitations.show');

require __DIR__ . '/auth.php';
