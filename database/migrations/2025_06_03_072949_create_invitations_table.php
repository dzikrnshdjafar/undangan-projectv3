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
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('invitation_theme_id')->constrained()->onDelete('cascade');
            $table->string('slug')->unique()->comment('Unique slug for the invitation URL');
            $table->string('title')->comment('Title of the invitation');
            $table->json('sections_json')->nullable()->comment('Section structure for dynamic rendering');
            $table->string('background_image_path')->nullable()->comment('Background image for the invitation');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
