<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prompt_playground_entries', function (Blueprint $table): void {
            $table->id();
            $table->text('prompt');
            $table->longText('response');
            $table->string('provider', 50);
            $table->string('model', 255)->nullable();
            $table->string('tone', 50);
            $table->string('length', 50);
            $table->decimal('temperature', 3, 2);
            $table->decimal('top_p', 3, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prompt_playground_entries');
    }
};
