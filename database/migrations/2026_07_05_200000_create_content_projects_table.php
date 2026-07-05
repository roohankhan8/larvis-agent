<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_projects', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('device_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->longText('source_content')->nullable();
            $table->string('content_type')->nullable();
            $table->string('audience')->nullable();
            $table->string('tone')->nullable();
            $table->string('goal')->nullable();
            $table->string('status')->default('brief');
            $table->longText('current_draft')->nullable();
            $table->json('latest_analysis')->nullable();
            $table->json('model_settings')->nullable();
            $table->json('drafts')->nullable();
            $table->uuid('conversation_id')->nullable();
            $table->longText('final_output')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_projects');
    }
};
