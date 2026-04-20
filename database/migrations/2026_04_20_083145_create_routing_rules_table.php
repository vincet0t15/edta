<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routing_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_type_id')->constrained('document_types')->onDelete('cascade');
            $table->foreignId('office_id')->constrained('offices')->onDelete('cascade');
            $table->integer('order')->default(1)->comment('Routing sequence');
            $table->boolean('is_initial_recipient')->default(false);
            $table->timestamps();
            $table->unique(['document_type_id', 'office_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routing_rules');
    }
};
