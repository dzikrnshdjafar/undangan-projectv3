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
        Schema::create('invitation_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., "Pernikahan", "Ulang Tahun", "Seminar"
            $table->string('slug')->unique(); // e.g., "pernikahan", "ulang-tahun", "seminar"
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitation_categories');
    }
};
