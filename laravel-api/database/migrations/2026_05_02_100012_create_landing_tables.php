<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('landing_sections')) {
            Schema::create('landing_sections', function (Blueprint $table) {
                $table->id();
                $table->string('slug', 100)->unique();
                $table->string('title');
                $table->string('section_type', 50);
                $table->integer('ordering')->default(0);
                $table->boolean('is_active')->default(true);
                $table->string('background_color', 50)->nullable();
                $table->unsignedBigInteger('background_media_id')->nullable();
                $table->string('title_font_size', 50)->default('32px');
                $table->string('title_color', 50)->default('#112250');
                $table->text('custom_css')->nullable();
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('section_blocks')) {
            Schema::create('section_blocks', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('section_id');
                $table->string('block_type', 50);
                $table->integer('ordering')->default(0);
                $table->json('content')->default('{}');
                $table->boolean('is_active')->default(true);
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('focus_items')) {
            Schema::create('focus_items', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('icon', 100)->nullable();
                $table->text('description');
                $table->integer('ordering')->default(0);
                $table->boolean('is_active')->default(true);
                $table->unsignedBigInteger('media_id')->nullable();
                $table->string('created_by', 255)->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('team_members')) {
            Schema::create('team_members', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('role');
                $table->text('bio')->nullable();
                $table->unsignedBigInteger('photo_id')->nullable();
                $table->string('email')->nullable();
                $table->string('phone', 50)->nullable();
                $table->json('social_links')->default('{}');
                $table->integer('ordering')->default(0);
                $table->boolean('is_active')->default(true);
                $table->string('created_by', 255)->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('landing_testimonials')) {
            Schema::create('landing_testimonials', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('role')->nullable();
                $table->unsignedBigInteger('photo_id')->nullable();
                $table->integer('rating')->default(5);
                $table->text('feedback');
                $table->boolean('is_approved')->default(false);
                $table->boolean('is_active')->default(true);
                $table->integer('ordering')->default(0);
                $table->string('user_id', 255)->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('site_stats')) {
            Schema::create('site_stats', function (Blueprint $table) {
                $table->id();
                $table->string('label');
                $table->string('value', 100);
                $table->string('icon', 100)->nullable();
                $table->string('suffix', 20)->nullable();
                $table->integer('ordering')->default(0);
                $table->boolean('is_active')->default(true);
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('partners')) {
            Schema::create('partners', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->unsignedBigInteger('logo_id')->nullable();
                $table->string('website_url', 500)->nullable();
                $table->text('description')->nullable();
                $table->integer('ordering')->default(0);
                $table->boolean('is_active')->default(true);
                $table->string('created_by', 255)->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('booking_page_settings')) {
            Schema::create('booking_page_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary();
                $table->string('title');
                $table->string('subtitle')->nullable();
                $table->string('header_background_image', 500)->nullable();
                $table->text('footer_text')->nullable();
                $table->string('contact_email')->nullable();
                $table->string('contact_phone', 50)->nullable();
                $table->boolean('enable_reviews')->default(true);
                $table->boolean('enable_similar_events')->default(true);
                $table->boolean('enable_image_gallery')->default(true);
                $table->integer('max_participants')->default(25);
                $table->integer('minimum_booking_hours')->default(24);
                $table->text('custom_css')->nullable();
                $table->string('seo_title')->nullable();
                $table->text('seo_description')->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }
    }

    public function down(): void
    {
        foreach (['booking_page_settings','partners','site_stats','landing_testimonials','team_members','focus_items','section_blocks','landing_sections'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
