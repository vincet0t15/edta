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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();

            $table->foreignId('document_type_id')->nullable()->constrained('document_types')->nullOnDelete();
            $table->foreignId('document_category_id')->nullable()->constrained('document_categories')->nullOnDelete();
            $table->foreignId('document_priority_id')->nullable()->constrained('document_priorities')->nullOnDelete();
            $table->foreignId('current_status_id')->nullable()->constrained('document_statuses')->nullOnDelete();
            $table->foreignId('current_office_id')->nullable()->constrained('offices')->nullOnDelete();
            $table->foreignId('retention_policy_id')->nullable()->constrained('retention_policies')->nullOnDelete();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_public')->default(false);

            $table->timestamp('due_date_response')->nullable();
            $table->timestamp('due_date_resolution')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('resolved_at')->nullable();

            $table->json('metadata')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->index(['current_status_id']);
            $table->index(['current_office_id']);
            $table->index(['document_priority_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
