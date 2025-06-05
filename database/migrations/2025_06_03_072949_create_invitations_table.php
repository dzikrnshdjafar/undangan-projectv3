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
            // invitation_category_id bisa didapatkan melalui relasi theme->category

            $table->string('slug')->unique()->comment('Unique slug for the invitation URL');
            $table->string('title'); // Judul undangan, mis. "Pernikahan Dzikri & Aisyah"
            $table->string('cover_image_path')->nullable();

            // Detail Acara Utama
            $table->string('event_name')->nullable()->comment('Nama acara utama, misal "Akad Nikah & Resepsi"');
            $table->date('event_date');
            $table->time('event_time_start')->nullable();
            $table->time('event_time_end')->nullable();
            $table->string('venue_name')->nullable();
            $table->text('venue_address')->nullable();
            $table->string('venue_maps_link')->nullable();

            // Detail Acara Tambahan (opsional, misal acara adat, siraman, dll.)
            $table->string('secondary_event_name')->nullable();
            $table->date('secondary_event_date')->nullable();
            $table->time('secondary_event_time_start')->nullable();
            $table->time('secondary_event_time_end')->nullable();
            $table->string('secondary_venue_name')->nullable();
            $table->text('secondary_venue_address')->nullable();
            $table->string('secondary_venue_maps_link')->nullable();

            $table->text('greeting_message')->nullable()->comment('Salam pembuka dari tuan rumah');
            $table->text('closing_message')->nullable()->comment('Salam penutup atau doa');

            // JSON untuk menyimpan data spesifik per kategori/tema
            // Contoh untuk pernikahan: bride_name, groom_name, bride_parents, groom_parents, etc.
            // Contoh untuk ulang tahun: celebrant_name, age, etc.
            // Contoh untuk seminar: speaker_name, topic, etc.
            $table->json('details')->nullable();

            $table->string('rsvp_contact_name')->nullable();
            $table->string('rsvp_contact_phone')->nullable(); // Bisa juga email

            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->integer('view_count')->default(0);

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
