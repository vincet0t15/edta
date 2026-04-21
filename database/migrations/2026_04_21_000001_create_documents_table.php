<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->text('description')->nullable();

            $table->foreignId('document_type_id')->nullable()->constrained('document_types')->nullOnDelete();
            $table->foreignId('priority_id')->nullable()->constrained('document_priorities')->nullOnDelete();
            $table->foreignId('current_status_id')->nullable()->constrained('document_statuses')->nullOnDelete();
            $table->foreignId('current_office_id')->nullable()->constrained('offices')->nullOnDelete();
            $table->foreignId('retention_policy_id')->nullable()->constrained('retention_policies')->nullOnDelete();

            $table->timestamp('sla_response_due_at')->nullable();
            $table->timestamp('sla_resolution_due_at')->nullable();

            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('resolved_at')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->index(['current_status_id']);
            $table->index(['current_office_id']);
            $table->index(['priority_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
