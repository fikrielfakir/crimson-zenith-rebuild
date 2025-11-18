CREATE TABLE `about_settings` (
	`id` varchar(255) NOT NULL DEFAULT 'default',
	`is_active` boolean DEFAULT true,
	`title` varchar(255) DEFAULT 'About Us',
	`subtitle` text,
	`description` text NOT NULL,
	`image_id` int,
	`background_image_id` int,
	`background_color` varchar(50),
	`updated_by` varchar(255),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `about_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_events` (
	`id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`description` text NOT NULL,
	`location` varchar(255) NOT NULL,
	`duration` varchar(100),
	`price` int NOT NULL,
	`original_price` int,
	`rating` int DEFAULT 5,
	`review_count` int DEFAULT 0,
	`category` varchar(100),
	`languages` json DEFAULT (JSON_ARRAY('English')),
	`age_range` varchar(100),
	`group_size` varchar(100),
	`cancellation_policy` text,
	`images` json DEFAULT (JSON_ARRAY()),
	`highlights` json DEFAULT (JSON_ARRAY()),
	`included` json DEFAULT (JSON_ARRAY()),
	`not_included` json DEFAULT (JSON_ARRAY()),
	`schedule` json DEFAULT (JSON_ARRAY()),
	`is_active` boolean DEFAULT true,
	`created_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `booking_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_page_settings` (
	`id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`header_background_image` varchar(500),
	`footer_text` text,
	`contact_email` varchar(255),
	`contact_phone` varchar(50),
	`enable_reviews` boolean DEFAULT true,
	`enable_similar_events` boolean DEFAULT true,
	`enable_image_gallery` boolean DEFAULT true,
	`max_participants` int DEFAULT 25,
	`minimum_booking_hours` int DEFAULT 24,
	`custom_css` text,
	`seo_title` varchar(255),
	`seo_description` text,
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `booking_page_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `club_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`club_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`event_date` timestamp NOT NULL,
	`location` varchar(255),
	`max_participants` int,
	`current_participants` int DEFAULT 0,
	`status` varchar(20) DEFAULT 'upcoming',
	`created_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `club_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `club_gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`club_id` int NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`caption` varchar(255),
	`uploaded_by` varchar(255),
	`uploaded_at` timestamp DEFAULT (now()),
	CONSTRAINT `club_gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `club_memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`club_id` int NOT NULL,
	`role` varchar(50) DEFAULT 'member',
	`joined_at` timestamp DEFAULT (now()),
	`is_active` boolean DEFAULT true,
	CONSTRAINT `club_memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `club_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`club_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `club_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clubs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`long_description` text,
	`image` varchar(500),
	`location` varchar(255) NOT NULL,
	`member_count` int DEFAULT 0,
	`features` json DEFAULT (JSON_ARRAY()),
	`contact_phone` varchar(50),
	`contact_email` varchar(255),
	`website` varchar(500),
	`social_media` json DEFAULT (JSON_OBJECT()),
	`rating` int DEFAULT 5,
	`established` varchar(100),
	`is_active` boolean DEFAULT true,
	`latitude` decimal(9,6),
	`longitude` decimal(9,6),
	`owner_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `clubs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_settings` (
	`id` varchar(255) NOT NULL DEFAULT 'default',
	`office_address` text,
	`email` varchar(255),
	`phone` varchar(50),
	`office_hours` text,
	`map_latitude` decimal(9,6),
	`map_longitude` decimal(9,6),
	`form_recipients` json DEFAULT (JSON_ARRAY()),
	`auto_reply_enabled` boolean DEFAULT false,
	`auto_reply_message` text,
	`social_links` json DEFAULT (JSON_OBJECT()),
	`updated_by` varchar(255),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `contact_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`registered_at` timestamp DEFAULT (now()),
	`attended` boolean DEFAULT false,
	CONSTRAINT `event_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `focus_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`icon` varchar(100),
	`description` text NOT NULL,
	`ordering` int NOT NULL DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`media_id` int,
	`created_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `focus_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `footer_settings` (
	`id` varchar(255) NOT NULL DEFAULT 'default',
	`copyright_text` varchar(500),
	`description` text,
	`links` json DEFAULT (JSON_ARRAY()),
	`social_links` json DEFAULT (JSON_OBJECT()),
	`newsletter_enabled` boolean DEFAULT true,
	`newsletter_title` varchar(255),
	`newsletter_description` text,
	`updated_by` varchar(255),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `footer_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_settings` (
	`id` varchar(255) NOT NULL DEFAULT 'default',
	`title` text NOT NULL DEFAULT ('Where Adventure Meets
Transformation'),
	`subtitle` text NOT NULL DEFAULT ('Experience Morocco''s soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.'),
	`primary_button_text` varchar(100) DEFAULT 'Start Your Journey',
	`primary_button_link` varchar(500) DEFAULT '/discover',
	`secondary_button_text` varchar(100) DEFAULT 'Explore Clubs',
	`secondary_button_link` varchar(500) DEFAULT '/clubs',
	`background_type` varchar(20) DEFAULT 'image',
	`background_media_id` int,
	`background_overlay_color` varchar(50) DEFAULT 'rgba(26, 54, 93, 0.7)',
	`background_overlay_opacity` int DEFAULT 70,
	`title_font_size` varchar(50) DEFAULT '65px',
	`title_color` varchar(50) DEFAULT '#ffffff',
	`subtitle_font_size` varchar(50) DEFAULT '20px',
	`subtitle_color` varchar(50) DEFAULT '#ffffff',
	`enable_typewriter` boolean DEFAULT true,
	`typewriter_texts` json DEFAULT (JSON_ARRAY()),
	`updated_by` varchar(255),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `hero_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `landing_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`section_type` varchar(50) NOT NULL,
	`ordering` int NOT NULL DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`background_color` varchar(50),
	`background_media_id` int,
	`title_font_size` varchar(50) DEFAULT '32px',
	`title_color` varchar(50) DEFAULT '#112250',
	`custom_css` text,
	`updated_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `landing_sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `landing_sections_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `landing_testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(255),
	`photo_id` int,
	`rating` int DEFAULT 5,
	`feedback` text NOT NULL,
	`is_approved` boolean DEFAULT false,
	`is_active` boolean DEFAULT true,
	`ordering` int NOT NULL DEFAULT 0,
	`user_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `landing_testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`file_type` varchar(50) NOT NULL,
	`file_url` varchar(1000) NOT NULL,
	`thumbnail_url` varchar(1000),
	`alt_text` varchar(500),
	`focal_point` json,
	`metadata` json DEFAULT (JSON_OBJECT()),
	`uploaded_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `media_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `navbar_settings` (
	`id` varchar(255) NOT NULL DEFAULT 'default',
	`logo_type` varchar(20) DEFAULT 'image',
	`logo_image_id` int,
	`logo_svg` text,
	`logo_text` varchar(255),
	`navigation_links` json DEFAULT (JSON_ARRAY()),
	`show_language_switcher` boolean DEFAULT true,
	`available_languages` json DEFAULT (JSON_ARRAY('EN', 'FR', 'AR')),
	`show_dark_mode_toggle` boolean DEFAULT true,
	`login_button_text` varchar(100) DEFAULT 'Login',
	`login_button_link` varchar(500) DEFAULT '/admin/login',
	`show_login_button` boolean DEFAULT true,
	`join_button_text` varchar(100) DEFAULT 'Join Us',
	`join_button_link` varchar(500) DEFAULT '/join',
	`join_button_style` varchar(50) DEFAULT 'secondary',
	`show_join_button` boolean DEFAULT true,
	`updated_by` varchar(255),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `navbar_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_settings` (
	`id` varchar(255) NOT NULL DEFAULT 'default',
	`is_active` boolean DEFAULT true,
	`title` varchar(255) DEFAULT 'Our Partners',
	`subtitle` text,
	`background_color` varchar(50),
	`updated_by` varchar(255),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `partner_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`logo_id` int,
	`website_url` varchar(500),
	`description` text,
	`ordering` int NOT NULL DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `president_message_settings` (
	`id` varchar(255) NOT NULL DEFAULT 'default',
	`is_active` boolean DEFAULT true,
	`title` varchar(255) DEFAULT 'Message from Our President',
	`president_name` varchar(255) NOT NULL,
	`president_role` varchar(255) DEFAULT 'President',
	`message` text NOT NULL,
	`photo_id` int,
	`signature_id` int,
	`background_image_id` int,
	`background_color` varchar(50),
	`updated_by` varchar(255),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `president_message_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `section_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section_id` int NOT NULL,
	`block_type` varchar(50) NOT NULL,
	`ordering` int NOT NULL DEFAULT 0,
	`content` json NOT NULL DEFAULT (JSON_OBJECT()),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `section_blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seo_settings` (
	`id` varchar(255) NOT NULL DEFAULT 'default',
	`site_title` varchar(255),
	`site_description` text,
	`keywords` text,
	`og_image` int,
	`twitter_handle` varchar(100),
	`google_analytics_id` varchar(100),
	`facebook_pixel_id` varchar(100),
	`custom_head_code` text,
	`custom_body_code` text,
	`updated_by` varchar(255),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `seo_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sid` varchar(255) NOT NULL,
	`sess` json NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_sid` PRIMARY KEY(`sid`)
);
--> statement-breakpoint
CREATE TABLE `site_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(255) NOT NULL,
	`value` varchar(100) NOT NULL,
	`icon` varchar(100),
	`suffix` varchar(20),
	`ordering` int NOT NULL DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`updated_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `site_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`bio` text,
	`photo_id` int,
	`email` varchar(255),
	`phone` varchar(50),
	`social_links` json DEFAULT (JSON_OBJECT()),
	`ordering` int NOT NULL DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `theme_settings` (
	`id` varchar(255) NOT NULL DEFAULT 'default',
	`primary_color` varchar(7) DEFAULT '#112250',
	`secondary_color` varchar(7) DEFAULT '#D8C18D',
	`custom_css` text,
	`updated_by` varchar(255),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `theme_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL DEFAULT (UUID()),
	`username` varchar(255),
	`password` varchar(255),
	`email` varchar(255),
	`first_name` varchar(255),
	`last_name` varchar(255),
	`profile_image_url` varchar(500),
	`bio` text,
	`phone` varchar(50),
	`location` varchar(255),
	`interests` json DEFAULT (JSON_ARRAY()),
	`is_admin` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `about_settings` ADD CONSTRAINT `about_settings_image_id_media_assets_id_fk` FOREIGN KEY (`image_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `about_settings` ADD CONSTRAINT `about_settings_background_image_id_media_assets_id_fk` FOREIGN KEY (`background_image_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `about_settings` ADD CONSTRAINT `about_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_events` ADD CONSTRAINT `booking_events_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `club_events` ADD CONSTRAINT `club_events_club_id_clubs_id_fk` FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `club_events` ADD CONSTRAINT `club_events_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `club_gallery` ADD CONSTRAINT `club_gallery_club_id_clubs_id_fk` FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `club_gallery` ADD CONSTRAINT `club_gallery_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `club_memberships` ADD CONSTRAINT `club_memberships_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `club_memberships` ADD CONSTRAINT `club_memberships_club_id_clubs_id_fk` FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `club_reviews` ADD CONSTRAINT `club_reviews_club_id_clubs_id_fk` FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `club_reviews` ADD CONSTRAINT `club_reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clubs` ADD CONSTRAINT `clubs_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contact_settings` ADD CONSTRAINT `contact_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_participants` ADD CONSTRAINT `event_participants_event_id_club_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `club_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_participants` ADD CONSTRAINT `event_participants_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `focus_items` ADD CONSTRAINT `focus_items_media_id_media_assets_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `focus_items` ADD CONSTRAINT `focus_items_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `footer_settings` ADD CONSTRAINT `footer_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hero_settings` ADD CONSTRAINT `hero_settings_background_media_id_media_assets_id_fk` FOREIGN KEY (`background_media_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hero_settings` ADD CONSTRAINT `hero_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `landing_sections` ADD CONSTRAINT `landing_sections_background_media_id_media_assets_id_fk` FOREIGN KEY (`background_media_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `landing_sections` ADD CONSTRAINT `landing_sections_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `landing_testimonials` ADD CONSTRAINT `landing_testimonials_photo_id_media_assets_id_fk` FOREIGN KEY (`photo_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `landing_testimonials` ADD CONSTRAINT `landing_testimonials_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media_assets` ADD CONSTRAINT `media_assets_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `navbar_settings` ADD CONSTRAINT `navbar_settings_logo_image_id_media_assets_id_fk` FOREIGN KEY (`logo_image_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `navbar_settings` ADD CONSTRAINT `navbar_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partner_settings` ADD CONSTRAINT `partner_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partners` ADD CONSTRAINT `partners_logo_id_media_assets_id_fk` FOREIGN KEY (`logo_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partners` ADD CONSTRAINT `partners_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `president_message_settings` ADD CONSTRAINT `president_message_settings_photo_id_media_assets_id_fk` FOREIGN KEY (`photo_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `president_message_settings` ADD CONSTRAINT `president_message_settings_signature_id_media_assets_id_fk` FOREIGN KEY (`signature_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `president_message_settings` ADD CONSTRAINT `president_message_settings_background_image_id_media_assets_id_fk` FOREIGN KEY (`background_image_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `president_message_settings` ADD CONSTRAINT `president_message_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `section_blocks` ADD CONSTRAINT `section_blocks_section_id_landing_sections_id_fk` FOREIGN KEY (`section_id`) REFERENCES `landing_sections`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seo_settings` ADD CONSTRAINT `seo_settings_og_image_media_assets_id_fk` FOREIGN KEY (`og_image`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seo_settings` ADD CONSTRAINT `seo_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_stats` ADD CONSTRAINT `site_stats_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_photo_id_media_assets_id_fk` FOREIGN KEY (`photo_id`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `theme_settings` ADD CONSTRAINT `theme_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `IDX_session_expire` ON `sessions` (`expires`);