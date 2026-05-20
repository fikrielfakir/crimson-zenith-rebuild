<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('volunteer_opportunities')) {
            Schema::create('volunteer_opportunities', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('location')->nullable();
                $table->string('duration')->nullable();
                $table->unsignedInteger('max_participants')->default(10);
                $table->unsignedInteger('current_participants')->default(0);
                $table->text('description')->nullable();
                $table->json('skills')->nullable();
                $table->enum('urgency', ['high', 'medium', 'low'])->default('medium');
                $table->enum('status', ['draft', 'published'])->default('draft');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('volunteer_posts')) {
            Schema::create('volunteer_posts', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('location')->nullable();
                $table->string('type')->nullable();
                $table->string('duration')->nullable();
                $table->string('commitment')->nullable();
                $table->date('start_date')->nullable();
                $table->date('deadline')->nullable();
                $table->text('description')->nullable();
                $table->json('responsibilities')->nullable();
                $table->json('requirements')->nullable();
                $table->json('benefits')->nullable();
                $table->string('category')->nullable();
                $table->enum('status', ['draft', 'published'])->default('draft');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('experts')) {
            Schema::create('experts', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('title')->nullable();
                $table->string('location')->nullable();
                $table->string('image')->nullable();
                $table->json('expertise')->nullable();
                $table->decimal('rating', 3, 1)->default(5.0);
                $table->unsignedInteger('projects_count')->default(0);
                $table->unsignedInteger('years_experience')->default(0);
                $table->json('languages')->nullable();
                $table->text('bio')->nullable();
                $table->json('achievements')->nullable();
                $table->json('certifications')->nullable();
                $table->boolean('is_available')->default(true);
                $table->enum('status', ['draft', 'published'])->default('draft');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('work_offers')) {
            Schema::create('work_offers', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('company')->nullable();
                $table->string('location')->nullable();
                $table->string('type')->nullable();
                $table->string('salary')->nullable();
                $table->string('experience_level')->nullable();
                $table->text('description')->nullable();
                $table->json('responsibilities')->nullable();
                $table->json('requirements')->nullable();
                $table->json('benefits')->nullable();
                $table->string('category')->nullable();
                $table->enum('status', ['draft', 'published'])->default('draft');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('projects')) {
            Schema::create('projects', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('category')->nullable();
                $table->enum('status', ['active', 'ongoing', 'planning', 'completed'])->default('planning');
                $table->unsignedInteger('progress')->default(0);
                $table->string('image')->nullable();
                $table->string('location')->nullable();
                $table->unsignedInteger('participants_count')->default(0);
                $table->unsignedInteger('impact_people')->default(0);
                $table->string('impact_co2')->nullable();
                $table->unsignedInteger('impact_sites')->default(0);
                $table->boolean('is_featured')->default(false);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_opportunities');
        Schema::dropIfExists('volunteer_posts');
        Schema::dropIfExists('experts');
        Schema::dropIfExists('work_offers');
        Schema::dropIfExists('projects');
    }
};
