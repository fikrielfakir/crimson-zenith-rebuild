-- Focus Areas Migration
-- Run this on your Hostinger MySQL database (u279218004_thejourney)
-- to enable background images and section settings for Focus Areas.

-- 1. Add image_url column to focus_items (safe - skips if already exists)
ALTER TABLE `focus_items`
  ADD COLUMN IF NOT EXISTS `image_url` VARCHAR(1000) NULL AFTER `media_id`;

-- 2. Create focus_section_settings table
CREATE TABLE IF NOT EXISTS `focus_section_settings` (
  `id`         VARCHAR(50)  NOT NULL,
  `title`      VARCHAR(255) NOT NULL DEFAULT 'Our Focus',
  `subtitle`   VARCHAR(500)          DEFAULT NULL,
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `updated_by` VARCHAR(100)          DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Insert default row (safe - skips if already exists)
INSERT IGNORE INTO `focus_section_settings` (`id`, `title`, `subtitle`, `is_active`)
VALUES ('default', 'Our Focus', 'Tourism, Culture, Entertainment', 1);
