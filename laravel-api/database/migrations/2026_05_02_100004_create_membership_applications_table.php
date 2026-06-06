<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('membership_applications')) return;
        Schema::create('membership_applications', function (Blueprint $table) {
            $table->id();
            $table->string('user_id', 255);
            $table->string('applicant_name');
            $table->string('email');
            $table->string('phone', 50)->nullable();
            $table->text('motivation')->nullable();
            $table->json('interests')->default('[]');
            $table->string('preferred_club')->nullable();
            $table->string('status', 20)->default('pending');
            $table->string('reviewed_by', 255)->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_applications');
    }
};
