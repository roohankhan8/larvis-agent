<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('streaming_lab_entries', function (Blueprint $table): void {
            $table->id();
            $table->text('prompt');
            $table->longText('response');
            $table->string('provider', 50);
            $table->string('model', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('streaming_lab_entries');
    }
};
