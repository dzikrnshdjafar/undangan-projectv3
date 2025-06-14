<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invitation_themes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_category_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g., "Elegant Blue", "Funky Birthday Blast"
            $table->string('slug')->unique(); // e.g., "elegant-blue", "funky-birthday-blast"
            $table->text('description')->nullable();
            $table->string('preview_image_path')->nullable(); // Path to a thumbnail/preview image
            $table->json('sections_json')->nullable()->comment('Section structure for dynamic rendering');

            $table->string('background_image_path')->nullable()->comment('Background image for the theme');
            // Anda bisa menambahkan kolom lain seperti 'colors_json', 'fonts_json' jika diperlukan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitation_themes');
    }
};
