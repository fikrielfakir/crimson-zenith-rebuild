<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('club_memberships')) return;
        Schema::create('club_memberships', function (Blueprint $table) {
            $table->id();
            $table->string('user_id', 255);
            $table->unsignedBigInteger('club_id');
            $table->string('role', 50)->default('member');
            $table->timestamp('joined_at')->useCurrent();
            $table->boolean('is_active')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('club_memberships');
    }
};
