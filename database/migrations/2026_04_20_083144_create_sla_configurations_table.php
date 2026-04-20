<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sla_configurations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_type_id')->constrained('document_types')->onDelete('cascade');
            $table->foreignId('document_priority_id')->constrained('document_priorities')->onDelete('cascade');
            $table->integer('response_hours')->comment('Hours to first response');
            $table->integer('resolution_hours')->comment('Hours to resolve');
            $table->timestamps();
            $table->unique(['document_type_id', 'document_priority_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sla_configurations');
    }
};
