<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('theme_settings')) {
            Schema::create('theme_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');
                $table->string('primary_color', 7)->default('#112250');
                $table->string('secondary_color', 7)->default('#D8C18D');
                $table->text('custom_css')->nullable();
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('navbar_settings')) {
            Schema::create('navbar_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');
                $table->string('logo_type', 20)->default('image');
                $table->unsignedBigInteger('logo_image_id')->nullable();
                $table->text('logo_svg')->nullable();
                $table->string('logo_text')->nullable();
                $table->integer('logo_size')->default(135);
                $table->string('logo_link', 500)->default('/');
                $table->json('navigation_links')->default('[]');
                $table->boolean('show_language_switcher')->default(true);
                $table->json('available_languages')->default('["EN","FR","AR"]');
                $table->boolean('show_dark_mode_toggle')->default(true);
                $table->string('login_button_text', 100)->default('Login');
                $table->string('login_button_link', 500)->default('/admin/login');
                $table->boolean('show_login_button')->default(true);
                $table->string('join_button_text', 100)->default('Join Us');
                $table->string('join_button_link', 500)->default('/join');
                $table->string('join_button_style', 50)->default('secondary');
                $table->boolean('show_join_button')->default(true);
                $table->string('background_color', 50)->default('#112250');
                $table->string('text_color', 50)->default('#ffffff');
                $table->string('hover_color', 50)->default('#D8C18D');
                $table->string('font_family', 100)->default('Inter');
                $table->string('font_size', 50)->default('14px');
                $table->boolean('is_sticky')->default(true);
                $table->boolean('is_transparent')->default(false);
                $table->string('transparent_bg', 50)->default('rgba(0,0,0,0.3)');
                $table->string('scrolled_bg', 50)->default('#112250');
                $table->integer('height')->default(80);
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('hero_settings')) {
            Schema::create('hero_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');
                $table->text('title')->default("Where Adventure Meets\nTransformation");
                $table->text('subtitle')->default('Experience Morocco\'s soul through sustainable journeys.');
                $table->string('primary_button_text', 100)->default('Start Your Journey');
                $table->string('primary_button_link', 500)->default('/discover');
                $table->string('secondary_button_text', 100)->default('Explore Clubs');
                $table->string('secondary_button_link', 500)->default('/clubs');
                $table->string('background_type', 20)->default('image');
                $table->unsignedBigInteger('background_media_id')->nullable();
                $table->string('background_overlay_color', 50)->default('rgba(26, 54, 93, 0.7)');
                $table->integer('background_overlay_opacity')->default(70);
                $table->string('title_font_size', 50)->default('65px');
                $table->string('title_color', 50)->default('#ffffff');
                $table->string('subtitle_font_size', 50)->default('20px');
                $table->string('subtitle_color', 50)->default('#ffffff');
                $table->boolean('enable_typewriter')->default(true);
                $table->json('typewriter_texts')->default('[]');
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('contact_settings')) {
            Schema::create('contact_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');
                $table->text('office_address')->nullable();
                $table->string('email')->nullable();
                $table->string('phone', 50)->nullable();
                $table->text('office_hours')->nullable();
                $table->decimal('map_latitude', 9, 6)->nullable();
                $table->decimal('map_longitude', 9, 6)->nullable();
                $table->json('form_recipients')->default('[]');
                $table->boolean('auto_reply_enabled')->default(false);
                $table->text('auto_reply_message')->nullable();
                $table->json('social_links')->default('{}');
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('footer_settings')) {
            Schema::create('footer_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');
                $table->string('copyright_text', 500)->nullable();
                $table->text('description')->nullable();
                $table->json('links')->default('[]');
                $table->json('social_links')->default('{}');
                $table->boolean('newsletter_enabled')->default(true);
                $table->string('newsletter_title')->nullable();
                $table->text('newsletter_description')->nullable();
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('seo_settings')) {
            Schema::create('seo_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');
                $table->string('site_title')->nullable();
                $table->text('site_description')->nullable();
                $table->text('keywords')->nullable();
                $table->unsignedBigInteger('og_image')->nullable();
                $table->string('twitter_handle', 100)->nullable();
                $table->string('google_analytics_id', 100)->nullable();
                $table->string('facebook_pixel_id', 100)->nullable();
                $table->text('custom_head_code')->nullable();
                $table->text('custom_body_code')->nullable();
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('about_settings')) {
            Schema::create('about_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');
                $table->boolean('is_active')->default(true);
                $table->string('title')->default('About Us');
                $table->text('subtitle')->nullable();
                $table->text('description');
                $table->unsignedBigInteger('image_id')->nullable();
                $table->unsignedBigInteger('background_image_id')->nullable();
                $table->string('background_color', 50)->nullable();
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('president_message_settings')) {
            Schema::create('president_message_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');
                $table->boolean('is_active')->default(true);
                $table->string('title')->default('A word from the president');
                $table->string('president_name')->default('Dr. Aderahim Azrkan');
                $table->string('president_role')->default('President, The Journey Association');
                $table->text('message')->default('');
                $table->text('quote')->nullable();
                $table->unsignedBigInteger('photo_id')->nullable();
                $table->unsignedBigInteger('signature_id')->nullable();
                $table->unsignedBigInteger('background_image_id')->nullable();
                $table->string('background_color', 50)->default('#112250');
                $table->string('background_gradient', 255)->default('linear-gradient(180deg, #112250 0%, #1a3366 100%)');
                $table->string('title_font_family', 100)->default('Poppins');
                $table->string('title_font_size', 50)->default('48px');
                $table->string('title_color', 50)->default('#ffffff');
                $table->string('title_alignment', 20)->default('left');
                $table->string('name_font_family', 100)->default('Poppins');
                $table->string('name_font_size', 50)->default('28px');
                $table->string('name_color', 50)->default('#ffffff');
                $table->string('role_font_family', 100)->default('Poppins');
                $table->string('role_font_size', 50)->default('18px');
                $table->string('role_color', 50)->default('#D8C18D');
                $table->string('message_font_family', 100)->default('Poppins');
                $table->string('message_font_size', 50)->default('16px');
                $table->string('message_color', 50)->default('#ffffff');
                $table->string('quote_color', 50)->default('#D8C18D');
                $table->string('quote_font_size', 50)->default('18px');
                $table->string('image_position', 20)->default('left');
                $table->string('image_alignment', 20)->default('center');
                $table->string('image_width', 50)->default('42%');
                $table->string('section_padding', 50)->default('80px 0');
                $table->string('content_gap', 50)->default('48px');
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('partner_settings')) {
            Schema::create('partner_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');
                $table->boolean('is_active')->default(true);
                $table->string('title')->default('Our Partners');
                $table->text('subtitle')->nullable();
                $table->string('background_color', 50)->nullable();
                $table->string('updated_by', 255)->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }
    }

    public function down(): void
    {
        foreach (['partner_settings','president_message_settings','about_settings','seo_settings','footer_settings','contact_settings','hero_settings','navbar_settings','theme_settings'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
