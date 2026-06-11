<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('smtp_settings')) {
            Schema::create('smtp_settings', function (Blueprint $table) {
                $table->string('id')->primary()->default('default');
                $table->boolean('enabled')->default(false);
                $table->string('host')->nullable();
                $table->integer('port')->default(587);
                $table->boolean('secure')->default(false);
                $table->string('username')->nullable();
                $table->string('password')->nullable();
                $table->string('from_name')->nullable();
                $table->string('from_email')->nullable();
                $table->string('updated_by')->nullable();
                $table->timestamps();
            });

            \Illuminate\Support\Facades\DB::table('smtp_settings')->insert([
                'id'         => 'default',
                'enabled'    => false,
                'port'       => 587,
                'secure'     => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if (!Schema::hasTable('email_log')) {
            Schema::create('email_log', function (Blueprint $table) {
                $table->id();
                $table->string('to');
                $table->string('subject');
                $table->text('body')->nullable();
                $table->enum('status', ['sent', 'failed'])->default('sent');
                $table->text('error_message')->nullable();
                $table->string('type')->default('manual');
                $table->string('sent_by')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('email_log');
        Schema::dropIfExists('smtp_settings');
    }
};
