-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 08, 2026 at 05:53 PM
-- Server version: 11.8.6-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u279218004_thejourney`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_settings`
--

CREATE TABLE `about_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL DEFAULT 'About Us',
  `subtitle` text DEFAULT NULL,
  `description` text NOT NULL,
  `image_id` bigint(20) UNSIGNED DEFAULT NULL,
  `background_image_id` bigint(20) UNSIGNED DEFAULT NULL,
  `background_color` varchar(50) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`tags`)),
  `featured_image` varchar(500) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `views` int(11) NOT NULL DEFAULT 0,
  `author_id` varchar(255) NOT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_events`
--

CREATE TABLE `booking_events` (
  `id` varchar(255) NOT NULL,
  `club_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_association_event` tinyint(1) NOT NULL DEFAULT 0,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `location_details` varchar(255) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `event_date` timestamp NULL DEFAULT NULL,
  `price` int(11) NOT NULL,
  `original_price` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `review_count` int(11) NOT NULL DEFAULT 0,
  `category` varchar(100) DEFAULT NULL,
  `languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '["English"]' CHECK (json_valid(`languages`)),
  `age_range` varchar(100) DEFAULT NULL,
  `min_age` int(11) DEFAULT NULL,
  `group_size` varchar(100) DEFAULT NULL,
  `max_people` int(11) DEFAULT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `current_participants` int(11) NOT NULL DEFAULT 0,
  `cancellation_policy` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`images`)),
  `image` varchar(500) DEFAULT NULL,
  `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`highlights`)),
  `included` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`included`)),
  `not_included` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`not_included`)),
  `schedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`schedule`)),
  `important_info` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'upcoming',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `booking_events`
--

INSERT INTO `booking_events` (`id`, `club_id`, `is_association_event`, `title`, `subtitle`, `description`, `location`, `location_details`, `latitude`, `longitude`, `duration`, `start_date`, `end_date`, `event_date`, `price`, `original_price`, `rating`, `review_count`, `category`, `languages`, `age_range`, `min_age`, `group_size`, `max_people`, `max_participants`, `current_participants`, `cancellation_policy`, `images`, `image`, `highlights`, `included`, `not_included`, `schedule`, `important_info`, `status`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
('85c829cc-d86d-45d1-9128-d2769e88a7fa', NULL, 1, 'lkpjlpds', NULL, 'aamowe pewwije', 'sasoa', NULL, NULL, NULL, NULL, '2026-05-08', '2026-05-05', '2026-05-08 04:44:00', 120, NULL, 5, 0, 'meetup', '[\"amazight , darijaa\"]', NULL, 16, NULL, 120, NULL, 0, NULL, '[]', 'blob:http://192.168.56.1:5000/cfc061a6-50ba-4310-8423-0efcf342eaf5', '[]', '[\"transport ,each , drinks\"]', '[\"lorem\"]', '[]', 'should be take identity', 'upcoming', 1, NULL, '2026-05-08 10:44:54', '2026-05-08 11:39:14'),
('97c9d390-987a-4dbe-89c1-6f4e7e2613ef', 2, 0, 'laskoak', NULL, 'lsakaskan saokoskao ps', 'Tanger Morocco', NULL, NULL, NULL, NULL, '2026-05-09', '2026-05-07', '2026-05-09 05:53:00', 150, NULL, 5, 0, 'webinar', '[\"amazight , darijaa\"]', NULL, 16, NULL, 160, 14, 0, NULL, '[]', '/uploads/b4dfce9b-829c-4802-899a-0525e31bd560.jpg', '[\"slaoks\"]', '[\"lakskj\"]', '[\"nsasj sha\"]', '[]', NULL, 'ongoing', 1, NULL, '2026-05-08 11:54:49', '2026-05-08 16:50:13');

-- --------------------------------------------------------

--
-- Table structure for table `booking_page_settings`
--

CREATE TABLE `booking_page_settings` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `header_background_image` varchar(500) DEFAULT NULL,
  `footer_text` text DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `enable_reviews` tinyint(1) NOT NULL DEFAULT 1,
  `enable_similar_events` tinyint(1) NOT NULL DEFAULT 1,
  `enable_image_gallery` tinyint(1) NOT NULL DEFAULT 1,
  `max_participants` int(11) NOT NULL DEFAULT 25,
  `minimum_booking_hours` int(11) NOT NULL DEFAULT 24,
  `custom_css` text DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_tickets`
--

CREATE TABLE `booking_tickets` (
  `id` char(36) NOT NULL,
  `booking_reference` varchar(50) NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) DEFAULT NULL,
  `number_of_participants` int(11) NOT NULL DEFAULT 1,
  `event_date` timestamp NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `payment_status` varchar(20) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `special_requests` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clubs`
--

CREATE TABLE `clubs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `long_description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `member_count` int(11) NOT NULL DEFAULT 0,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`features`)),
  `contact_phone` varchar(50) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `social_media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`social_media`)),
  `rating` int(11) NOT NULL DEFAULT 5,
  `established` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `owner_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clubs`
--

INSERT INTO `clubs` (`id`, `name`, `slug`, `description`, `long_description`, `image`, `location`, `member_count`, `features`, `contact_phone`, `contact_email`, `website`, `social_media`, `rating`, `established`, `is_active`, `is_featured`, `latitude`, `longitude`, `owner_id`, `created_at`, `updated_at`) VALUES
(1, 'Ensah', 'ensah', 'Mountain trekking and hiking adventures', NULL, 'https://api.thejourney-ma.org/uploads/clubs/club_69fdabad924b29.77435244.png', 'Atlas Mountains', 250, '[\"Hiking\",\"Camping\",\"Photography\"]', '+212696126701', 'elfakirfikri@gmail.com', 'https://magneseo.com/', '{\"facebook\":\"facebook.com\\/club\",\"instagram\":\"facebook.com\\/club.com\",\"twitter\":\"facebook.com\\/club\"}', 5, NULL, 1, 0, 35.742320, -5.405317, NULL, '2026-05-02 10:40:06', '2026-05-08 09:24:30'),
(2, 'Desert Explorers', 'desert-explorers', 'Sahara expeditions and desert camping', NULL, 'https://api.thejourney-ma.org/uploads/clubs/club_69fdac4a671ac1.91183351.png', 'Sahara Desert', 180, '[\"Desert Tours\",\"Camping\",\"Camel Rides\"]', '+212696126701', 'elfakirfikri@gmail.com', 'https://magneseo.com/', '{}', 5, NULL, 1, 0, 33.784193, -7.147504, NULL, '2026-05-02 10:40:06', '2026-05-08 09:27:04'),
(3, 'Coastal Adventures', 'coastal-adventures', 'Beach activities and water sports', NULL, 'https://api.thejourney-ma.org/uploads/clubs/club_69fdad74e05da5.35008730.png', 'Atlantic Coast', 320, '[\"Surfing\",\"Beach Volleyball\",\"Swimming\"]', '+212696126701', 'elfakirfikri@gmail.com', 'https://magneseo.com/', '{}', 4, NULL, 1, 0, 34.115471, -4.483266, NULL, '2026-05-02 10:40:06', '2026-05-08 09:31:51');

-- --------------------------------------------------------

--
-- Table structure for table `club_gallery`
--

CREATE TABLE `club_gallery` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `club_id` bigint(20) UNSIGNED NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `club_memberships`
--

CREATE TABLE `club_memberships` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `club_id` bigint(20) UNSIGNED NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'member',
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `club_reviews`
--

CREATE TABLE `club_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `club_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_settings`
--

CREATE TABLE `contact_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `office_address` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `office_hours` text DEFAULT NULL,
  `map_latitude` decimal(9,6) DEFAULT NULL,
  `map_longitude` decimal(9,6) DEFAULT NULL,
  `form_recipients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`form_recipients`)),
  `auto_reply_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `auto_reply_message` text DEFAULT NULL,
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`social_links`)),
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events_clubs`
--

CREATE TABLE `events_clubs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `club_id` bigint(20) UNSIGNED NOT NULL,
  `is_primary_club` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_gallery`
--

CREATE TABLE `event_gallery` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_participants`
--

CREATE TABLE `event_participants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `attended` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_prices`
--

CREATE TABLE `event_prices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `travelers` int(11) NOT NULL,
  `price_per_person` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_reviews`
--

CREATE TABLE `event_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `review` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_schedule`
--

CREATE TABLE `event_schedule` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `day_number` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `focus_items`
--

CREATE TABLE `focus_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `media_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `focus_items`
--

INSERT INTO `focus_items` (`id`, `title`, `icon`, `description`, `ordering`, `is_active`, `media_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Adventure & Exploration', 'mountain', 'Experience thrilling outdoor adventures from Atlas Mountains to Sahara Desert', 1, 1, NULL, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(2, 'Cultural Immersion', 'globe', 'Connect with local communities and discover authentic Moroccan traditions', 2, 1, NULL, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(3, 'Sustainable Tourism', 'leaf', 'Travel responsibly while supporting local economies and preserving nature', 3, 1, NULL, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(4, 'Community Building', 'users', 'Join a vibrant network of adventurers and culture enthusiasts', 4, 1, NULL, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `footer_settings`
--

CREATE TABLE `footer_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `copyright_text` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`links`)),
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`social_links`)),
  `newsletter_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `newsletter_title` varchar(255) DEFAULT NULL,
  `newsletter_description` text DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_settings`
--

CREATE TABLE `hero_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `title` text NOT NULL DEFAULT 'Where Adventure Meets\nTransformation',
  `subtitle` text NOT NULL DEFAULT 'Experience Morocco\'s soul through sustainable journeys.',
  `primary_button_text` varchar(100) NOT NULL DEFAULT 'Start Your Journey',
  `primary_button_link` varchar(500) NOT NULL DEFAULT '/discover',
  `secondary_button_text` varchar(100) NOT NULL DEFAULT 'Explore Clubs',
  `secondary_button_link` varchar(500) NOT NULL DEFAULT '/clubs',
  `background_type` varchar(20) NOT NULL DEFAULT 'image',
  `background_media_id` bigint(20) UNSIGNED DEFAULT NULL,
  `background_overlay_color` varchar(50) NOT NULL DEFAULT 'rgba(26, 54, 93, 0.7)',
  `background_overlay_opacity` int(11) NOT NULL DEFAULT 70,
  `title_font_size` varchar(50) NOT NULL DEFAULT '65px',
  `title_color` varchar(50) NOT NULL DEFAULT '#ffffff',
  `subtitle_font_size` varchar(50) NOT NULL DEFAULT '20px',
  `subtitle_color` varchar(50) NOT NULL DEFAULT '#ffffff',
  `enable_typewriter` tinyint(1) NOT NULL DEFAULT 1,
  `typewriter_texts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`typewriter_texts`)),
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hero_settings`
--

INSERT INTO `hero_settings` (`id`, `title`, `subtitle`, `primary_button_text`, `primary_button_link`, `secondary_button_text`, `secondary_button_link`, `background_type`, `background_media_id`, `background_overlay_color`, `background_overlay_opacity`, `title_font_size`, `title_color`, `subtitle_font_size`, `subtitle_color`, `enable_typewriter`, `typewriter_texts`, `updated_by`, `updated_at`) VALUES
('default', 'Where Adventure Meets\nTransformation', 'Experience Morocco\'s soul through sustainable journeys.', 'Start Your Journey', '/discover', 'Explore Clubs', '/clubs', 'image', NULL, 'rgba(26, 54, 93, 0.7)', 70, '65px', '#ffffff', '20px', '#ffffff', 1, '[]', NULL, '2026-05-02 10:41:26');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `landing_sections`
--

CREATE TABLE `landing_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `slug` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `section_type` varchar(50) NOT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `background_color` varchar(50) DEFAULT NULL,
  `background_media_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title_font_size` varchar(50) NOT NULL DEFAULT '32px',
  `title_color` varchar(50) NOT NULL DEFAULT '#112250',
  `custom_css` text DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `landing_testimonials`
--

CREATE TABLE `landing_testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `photo_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `feedback` text NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `user_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `landing_testimonials`
--

INSERT INTO `landing_testimonials` (`id`, `name`, `role`, `photo_id`, `rating`, `feedback`, `is_approved`, `is_active`, `ordering`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Sarah Martinez', 'Adventure Traveler', NULL, 5, 'The Atlas Mountains trek was absolutely incredible!', 1, 1, 1, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(2, 'James Wilson', 'Cultural Explorer', NULL, 5, 'I loved the cultural immersion.', 1, 1, 2, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(3, 'Emma Thompson', 'Photography Enthusiast', NULL, 5, 'The desert sunset was magical.', 1, 1, 3, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `media_assets`
--

CREATE TABLE `media_assets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_url` varchar(1000) NOT NULL,
  `thumbnail_url` varchar(1000) DEFAULT NULL,
  `alt_text` varchar(500) DEFAULT NULL,
  `focal_point` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`focal_point`)),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`metadata`)),
  `uploaded_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `membership_applications`
--

CREATE TABLE `membership_applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `applicant_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `motivation` text DEFAULT NULL,
  `interests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`interests`)),
  `preferred_club` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `reviewed_by` varchar(255) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_02_090157_create_personal_access_tokens_table', 1),
(5, '2026_05_02_100001_create_media_assets_table', 1),
(6, '2026_05_02_100002_modify_users_table', 2),
(7, '2026_05_02_100003_create_clubs_table', 2),
(8, '2026_05_02_100004_create_membership_applications_table', 2),
(9, '2026_05_02_100005_create_booking_events_table', 2),
(10, '2026_05_02_100006_create_booking_tickets_table', 2),
(11, '2026_05_02_100007_create_club_memberships_table', 2),
(12, '2026_05_02_100008_create_event_tables', 2),
(13, '2026_05_02_100009_create_club_gallery_reviews_table', 2),
(14, '2026_05_02_100010_create_blog_posts_table', 2),
(15, '2026_05_02_100011_create_cms_tables', 2),
(16, '2026_05_02_100012_create_landing_tables', 2),
(17, '2026_05_02_130000_fix_personal_access_tokens_tokenable_id', 3),
(18, '2026_05_02_160000_fix_sessions_user_id_and_storage', 4),
(19, '2026_05_08_100001_add_is_featured_to_clubs_table', 5),
(20, '2026_05_09_000002_create_payment_settings_table', 6),
(21, '2026_05_09_100000_fix_booking_tickets_id_to_uuid', 7);

-- --------------------------------------------------------

--
-- Table structure for table `navbar_settings`
--

CREATE TABLE `navbar_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `logo_type` varchar(20) NOT NULL DEFAULT 'image',
  `logo_image_id` bigint(20) UNSIGNED DEFAULT NULL,
  `logo_svg` text DEFAULT NULL,
  `logo_text` varchar(255) DEFAULT NULL,
  `logo_size` int(11) NOT NULL DEFAULT 135,
  `logo_link` varchar(500) NOT NULL DEFAULT '/',
  `navigation_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`navigation_links`)),
  `show_language_switcher` tinyint(1) NOT NULL DEFAULT 1,
  `available_languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '["EN","FR","AR"]' CHECK (json_valid(`available_languages`)),
  `show_dark_mode_toggle` tinyint(1) NOT NULL DEFAULT 1,
  `login_button_text` varchar(100) NOT NULL DEFAULT 'Login',
  `login_button_link` varchar(500) NOT NULL DEFAULT '/admin/login',
  `show_login_button` tinyint(1) NOT NULL DEFAULT 1,
  `join_button_text` varchar(100) NOT NULL DEFAULT 'Join Us',
  `join_button_link` varchar(500) NOT NULL DEFAULT '/join',
  `join_button_style` varchar(50) NOT NULL DEFAULT 'secondary',
  `show_join_button` tinyint(1) NOT NULL DEFAULT 1,
  `background_color` varchar(50) NOT NULL DEFAULT '#112250',
  `text_color` varchar(50) NOT NULL DEFAULT '#ffffff',
  `hover_color` varchar(50) NOT NULL DEFAULT '#D8C18D',
  `font_family` varchar(100) NOT NULL DEFAULT 'Inter',
  `font_size` varchar(50) NOT NULL DEFAULT '14px',
  `is_sticky` tinyint(1) NOT NULL DEFAULT 1,
  `is_transparent` tinyint(1) NOT NULL DEFAULT 0,
  `transparent_bg` varchar(50) NOT NULL DEFAULT 'rgba(0,0,0,0.3)',
  `scrolled_bg` varchar(50) NOT NULL DEFAULT '#112250',
  `height` int(11) NOT NULL DEFAULT 80,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `navbar_settings`
--

INSERT INTO `navbar_settings` (`id`, `logo_type`, `logo_image_id`, `logo_svg`, `logo_text`, `logo_size`, `logo_link`, `navigation_links`, `show_language_switcher`, `available_languages`, `show_dark_mode_toggle`, `login_button_text`, `login_button_link`, `show_login_button`, `join_button_text`, `join_button_link`, `join_button_style`, `show_join_button`, `background_color`, `text_color`, `hover_color`, `font_family`, `font_size`, `is_sticky`, `is_transparent`, `transparent_bg`, `scrolled_bg`, `height`, `updated_by`, `updated_at`) VALUES
('default', 'image', NULL, NULL, NULL, 135, '/', '[{\"label\":\"Discover\",\"url\":\"\\/discover\",\"isExternal\":false,\"hasDropdown\":true},{\"label\":\"Activities\",\"url\":\"\\/activities\",\"isExternal\":false},{\"label\":\"Projects\",\"url\":\"\\/projects\",\"isExternal\":false},{\"label\":\"Clubs\",\"url\":\"\\/clubs\",\"isExternal\":false},{\"label\":\"Gallery\",\"url\":\"\\/gallery\",\"isExternal\":false},{\"label\":\"Blog\",\"url\":\"\\/blog\",\"isExternal\":false},{\"label\":\"Talents\",\"url\":\"\\/talents\",\"isExternal\":false,\"hasDropdown\":true},{\"label\":\"Contact\",\"url\":\"\\/contact\",\"isExternal\":false}]', 1, '[\"EN\",\"FR\",\"AR\"]', 1, 'Login', '/admin/login', 1, 'Join Us', '/join', 'secondary', 1, '#112250', '#ffffff', '#D8C18D', 'Inter', '14px', 1, 0, 'rgba(0,0,0,0.3)', '#112250', 80, NULL, '2026-05-02 10:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo_id` bigint(20) UNSIGNED DEFAULT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partner_settings`
--

CREATE TABLE `partner_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL DEFAULT 'Our Partners',
  `subtitle` text DEFAULT NULL,
  `background_color` varchar(50) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_settings`
--

CREATE TABLE `payment_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `cmi_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `cash_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `cmi_merchant_id` varchar(255) DEFAULT NULL,
  `cmi_store_key` text DEFAULT NULL,
  `cmi_gateway_url` varchar(500) NOT NULL DEFAULT 'https://testpayment.cmi.co.ma/fim/est3Dgate',
  `cmi_currency` varchar(10) NOT NULL DEFAULT '504',
  `cmi_mode` varchar(10) NOT NULL DEFAULT 'test',
  `cmi_ok_url` varchar(500) DEFAULT NULL,
  `cmi_fail_url` varchar(500) DEFAULT NULL,
  `cmi_callback_url` varchar(500) DEFAULT NULL,
  `stripe_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `stripe_publishable_key` text DEFAULT NULL,
  `stripe_secret_key` text DEFAULT NULL,
  `stripe_mode` varchar(10) NOT NULL DEFAULT 'test',
  `updated_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_settings`
--

INSERT INTO `payment_settings` (`id`, `cmi_enabled`, `cash_enabled`, `cmi_merchant_id`, `cmi_store_key`, `cmi_gateway_url`, `cmi_currency`, `cmi_mode`, `cmi_ok_url`, `cmi_fail_url`, `cmi_callback_url`, `stripe_enabled`, `stripe_publishable_key`, `stripe_secret_key`, `stripe_mode`, `updated_by`, `created_at`, `updated_at`) VALUES
('default', 1, 1, NULL, NULL, 'https://testpayment.cmi.co.ma/fim/est3Dgate', '504', 'test', NULL, NULL, NULL, 0, NULL, NULL, 'test', '9b00000e-dd3d-46c9-a02f-8328b6da1f2f', '2026-05-08 17:23:23', '2026-05-08 17:23:44');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` varchar(36) NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `president_message_settings`
--

CREATE TABLE `president_message_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL DEFAULT 'A word from the president',
  `president_name` varchar(255) NOT NULL DEFAULT 'Dr. Aderahim Azrkan',
  `president_role` varchar(255) NOT NULL DEFAULT 'President, The Journey Association',
  `message` text NOT NULL DEFAULT '',
  `quote` text DEFAULT NULL,
  `photo_id` bigint(20) UNSIGNED DEFAULT NULL,
  `signature_id` bigint(20) UNSIGNED DEFAULT NULL,
  `background_image_id` bigint(20) UNSIGNED DEFAULT NULL,
  `background_color` varchar(50) NOT NULL DEFAULT '#112250',
  `background_gradient` varchar(255) NOT NULL DEFAULT 'linear-gradient(180deg, #112250 0%, #1a3366 100%)',
  `title_font_family` varchar(100) NOT NULL DEFAULT 'Poppins',
  `title_font_size` varchar(50) NOT NULL DEFAULT '48px',
  `title_color` varchar(50) NOT NULL DEFAULT '#ffffff',
  `title_alignment` varchar(20) NOT NULL DEFAULT 'left',
  `name_font_family` varchar(100) NOT NULL DEFAULT 'Poppins',
  `name_font_size` varchar(50) NOT NULL DEFAULT '28px',
  `name_color` varchar(50) NOT NULL DEFAULT '#ffffff',
  `role_font_family` varchar(100) NOT NULL DEFAULT 'Poppins',
  `role_font_size` varchar(50) NOT NULL DEFAULT '18px',
  `role_color` varchar(50) NOT NULL DEFAULT '#D8C18D',
  `message_font_family` varchar(100) NOT NULL DEFAULT 'Poppins',
  `message_font_size` varchar(50) NOT NULL DEFAULT '16px',
  `message_color` varchar(50) NOT NULL DEFAULT '#ffffff',
  `quote_color` varchar(50) NOT NULL DEFAULT '#D8C18D',
  `quote_font_size` varchar(50) NOT NULL DEFAULT '18px',
  `image_position` varchar(20) NOT NULL DEFAULT 'left',
  `image_alignment` varchar(20) NOT NULL DEFAULT 'center',
  `image_width` varchar(50) NOT NULL DEFAULT '42%',
  `section_padding` varchar(50) NOT NULL DEFAULT '80px 0',
  `content_gap` varchar(50) NOT NULL DEFAULT '48px',
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `president_message_settings`
--

INSERT INTO `president_message_settings` (`id`, `is_active`, `title`, `president_name`, `president_role`, `message`, `quote`, `photo_id`, `signature_id`, `background_image_id`, `background_color`, `background_gradient`, `title_font_family`, `title_font_size`, `title_color`, `title_alignment`, `name_font_family`, `name_font_size`, `name_color`, `role_font_family`, `role_font_size`, `role_color`, `message_font_family`, `message_font_size`, `message_color`, `quote_color`, `quote_font_size`, `image_position`, `image_alignment`, `image_width`, `section_padding`, `content_gap`, `updated_by`, `updated_at`) VALUES
('default', 1, 'A word from the president', 'Dr. Aderahim Azrkan', 'President, The Journey Association', '', NULL, NULL, NULL, NULL, '#112250', 'linear-gradient(180deg, #112250 0%, #1a3366 100%)', 'Poppins', '48px', '#ffffff', 'left', 'Poppins', '28px', '#ffffff', 'Poppins', '18px', '#D8C18D', 'Poppins', '16px', '#ffffff', '#D8C18D', '18px', 'left', 'center', '42%', '80px 0', '48px', NULL, '2026-05-02 10:41:29');

-- --------------------------------------------------------

--
-- Table structure for table `section_blocks`
--

CREATE TABLE `section_blocks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_id` bigint(20) UNSIGNED NOT NULL,
  `block_type` varchar(50) NOT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`content`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seo_settings`
--

CREATE TABLE `seo_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `site_title` varchar(255) DEFAULT NULL,
  `site_description` text DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `og_image` bigint(20) UNSIGNED DEFAULT NULL,
  `twitter_handle` varchar(100) DEFAULT NULL,
  `google_analytics_id` varchar(100) DEFAULT NULL,
  `facebook_pixel_id` varchar(100) DEFAULT NULL,
  `custom_head_code` text DEFAULT NULL,
  `custom_body_code` text DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('08dKRkfg1pxdHvjRnsBpdJOuqIzawpRNUZHiQkpJ', NULL, '34.31.253.191', 'curl/8.14.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSGR3d1NqcEZTbGpqVG8xY3lTYWpzNmF2T1Bnb0R5ZERsVHVQTGdUbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778257493),
('1kR2cMaogd5oH6Mjnz50Po5iiHoJ3bKHIcHUD3bZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTXllcFhKb1F1SnQzbnFkYURidHpkZ0o2Tmh5RWVmZTR3Rzl0N1RjRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmJOSTdSMXJwa1BPZ2xSVDciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778262606),
('1nCQRNsXqMWSgAfARQeoxE34SIoiko89vU9Udbft', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSHF1NDNTZjFrSnNSTjNpQ1dja2ZZUUtjeTFjeUJiUlNIWUdNRzBvSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778257260),
('2Fpi9bGe4IZyK1E9e9B7fw411ALvEo8avGAv6974', NULL, '34.11.190.141', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM3BxZW05MnRmekRTN1lhSlpneEcyblM0SVpvNTUxUEN3Rkd5UlpxZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cy84NWM4MjljYy1kODZkLTQ1ZDEtOTEyOC1kMjc2OWU4OGE3ZmEvcmV2aWV3cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778259873),
('2MYuWUiLJuk3EFkNDv7JpkbGvfFL9ufymP692G3l', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVGdaTlJDTHljdFdqVzh3MXFNZ2JsSW9WMlpQd21DdVprekRPTER0ZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778259870),
('35YHdRlfknHzSfbO6dgpPY1dN6fGedDGGvk4NCqb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMVVjQ1FjamJEcGlIVWRaY2NtazZ3blRod0tDYlNwaGVJenVNT0tIaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778257260),
('3qe9K7asxWlojYrkf9W3Wjjb9N3LeUmOdRpiAKMZ', NULL, '34.23.48.124', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYTk3cnUzRFdvREJaSnRUWUQ3dmlmMER3UkZKV3R4TktCc3M0a2VtUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778255100),
('7K9J0uyFB7S5h5pBN3VbnBhxPezVq44GTDLQFPUI', NULL, '34.23.48.124', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTE1zYlJuRFNtdzF6d2tYMVFaQlE2NmlsV3l1aXlFS0RrTm1OaDczdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778255100),
('81sLiw0Imw3Z99u2kZ2Bqk9gPHjB8a4J1g6AtUiH', NULL, '196.74.145.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQzJ1RzNwN3NFa01nam1qdHdDSHNocWVzNXV1ZGpaT1NBV0pUQVVPRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpkV0NkSElNTkpobmZDUkZPIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262499),
('9DdVkC03bdSxHcAuJqZMZqBzeFj1BbPxIj6mKHFN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2J1ZkExVHN1UU1UVDZXbDEwalBrSmNUUkp5dXVTdkt2U0RHTm1GbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778257260),
('a4tDQASLbnpLlYxMbUyfL6SVG3oYBxRsd37gAmEU', NULL, '34.11.190.141', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidG5kV3FBVzlJbW1pMk1teWZtUDJPMVJab2EycE50TGdmUGp2R1B4VyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778259854),
('aKHwICBrzDgXGz524MPZOdgC61HfCmvAiDCVzqIS', NULL, '196.74.145.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNE5Ramw5N1o2UmRnQXBrZzFNRU81ZnBKMzNOWmpMMGd5UmRnZ3BiQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmJOSTdSMXJwa1BPZ2xSVDciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778262499),
('Bk3sqqacMEAYVWFWRbRDISudfu7Pucai9akMcOaU', NULL, '34.23.48.124', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMldjZk91bFdOaXY4ZnBSaHRaUjU1enZWQ0w2RUx0amlXNmFZUHdwMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778255099),
('bt0Y1NDZ21bnaHjoR0fem1CUWWdgILivmMAirwj9', NULL, '34.11.190.141', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkpxd2RuNFlWMXZjSTUzSm9ZQjVTQzVudU54MGNFRnMwYVFzZ0N6VyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778259854),
('BYVU9Ezu5vKZukTR27VK7blSllOVh8TILg0paAgd', NULL, '34.31.253.191', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRENRcDlRZHZkWlpDYlhaZVZhbzl1NkQzaGRZaXp4MkF0d0hPbzd4QiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778259250),
('C21S4Mse1SRLJfAzreUGNI1McLcOTHL1WsP1xDJm', NULL, '34.31.253.191', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVUlIUHRzU1BXUWJzUUJVT05jVlBxbU9McnFzcHlQOUFqUEx4aHRlVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778257257),
('D2bRAWR4JwBfPN1i2EvOui0kUOqP6fdPa3vIkLmB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicHN3b0NVSWZyb05DcUNzT2FySWtXTldmTTBzVGltMUNucGJReTRraSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778257259),
('D3FToL0NHvPgytwpGks7115IxZEAegeJjwJnMCBk', NULL, '196.74.145.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMDNkdXlZRGI4RkhXWndaT050dHFPS2F3RTJYMVpkZllPQzEzbm1WRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OllKYndxTkJPWm5jdktCQ00iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778262523),
('dDisktQYPdkRlJNLVbODJHnnacgKplap1W9Cqq1i', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic1FYYXk3TmdGZjc2bHlZckxSRExwdFlsZHVndHdUSHVpMFFKdGVuTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpFNWtieFBJalYwTUVybmtxIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262600),
('DMT291OF6ZgP2HV1r9WxPkKZpoZ2cGCE970D6DWv', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmhLWXBuTkQ2dUttdEJ6QkNoR1djWmNRY1dFVFk2Y3l5ZWhVdGdyRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpBclYxSjQ0VVNENmpTdnhTIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262600),
('E04HQUjDrw15peox5n8Z7cIw0whVCf6VcxKabfoL', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaVo4bE5zVERIaEtJRGlaaDdjVUNrNGdRa09FWFRMR3BoMmluWXVxMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6Z0IzT1hPQ0h0MzBoQ0ZxSSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778262600),
('F390PqSNXaAkC0mmANCtfsNIQf9ccc6tqbuJeNJU', NULL, '34.23.48.124', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWRYbWxTSVRBY2FpMng3TGJ5ZmQyMks4aUtuNURQN3haSnE4OHhzSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778255100),
('FdTGHjQaEiR10DQw63s1JQkeZcmFh7ZSVJhZE9QP', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFRDRDBhRXpMcDlJM3BIMEFZRWM3YWZjT1BuZTkxZG9yY3dPTGZEQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6MmowUWJTOERhc256eDZjYiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778262600),
('FkEU9Drtia3OwbsabfWzbBFoYBP1C48Omfnv31zS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVzNZY1hMR1BtSXdTOFpzYnM5ZmNUQ2JyZlROT1pMMWJYOEQydW4zVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778259870),
('Fp3Lazf3Hd7IPeGVg0NhVp0WNVecdS2yQ554ObJz', NULL, '34.11.190.141', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYk9JWjI2YjlpVlVwSjltNjBkQm12dEh5UnFQeEdSeHFMUXVDenU4MyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778259854),
('gJtdFfyoA5iDVn6yHOsG2aKqfFP0KGMw99vHvb7H', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSVAzbWxqNm1TSUVoSHFxR0p2aHViUm5DbFprVUdXNDdXR253bjdCdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6MmowUWJTOERhc256eDZjYiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778262606),
('HEk9sXf12zTzXjt6z2ZLt3Zo2ZqfrzTjFuuaOl5i', NULL, '34.31.253.191', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoianFCcFFJMDIyN3BtQ0FlVHdhcnFsdEp1YU0xTm5WQ2lkdHZlTTE4diI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cy85N2M5ZDM5MC05ODdhLTRkYmUtODljMS02ZjRlN2UyNjEzZWYvcmV2aWV3cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778259374),
('hEvVj6lUViM4LPfXiQS90FsC9SvPCn4AUMHj8ATT', NULL, '196.74.145.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZHU5d1ZIY0M4Z2lhU2JTSXo3eU9PR0dsSVVQRWJkZEZaTTFSbDRIcyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fX0=', 1778254460),
('IJRrAWT5oKtCQ0PZnXOm8hjT8v4MGhaLwJFuFWwC', NULL, '34.31.253.191', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZWpsM1dTM3c4MTk3Y25NTnphb3FiczNsTFVlZGpBa0ZNUng2cTZsNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778257257),
('IT6ZYNBxrlXWNwn5KnPjPRd5RXPUNY8PRIBuCrGF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2dSTUMxakNOaEFHTjJadUhwaVRnaUZVcmZ4UEcxbnZ6MER2ZjI3bSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778259586),
('j8DJE69yVlmbY72ftYNJGLU1RjiykurwSPmVhSBP', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVDVyTW9oY3VCRmk5bWJubzFneFRNeXcyUEFhVThsQUtwd1MxcWF2eCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpFNWtieFBJalYwTUVybmtxIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262600),
('jcdEKovYHgpBHCtxBJh7ynDhz80fKkCUMECmqgJl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOHhxSUJid2ZOSjFJQXpyN01Ecm4zYlg5R1NLYVlkNHV6Y1FBYlUzOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778257259),
('jvCrCApYEJa3z0tbSCZRZzAeAB0JgRtu4Ud3mjgO', NULL, '196.74.145.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkJwZndJSjllcHM3QlNVWHB2Y1Juc1FtTElReXhscEFIWVBqT2V5TiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fX0=', 1778254848),
('k4nPRpUrxVyQUEGkgffdSYuhHtzP9nskfznHNGtg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ29jRlZNTmV4Z3JsS3FkVkRFUFdHMGJJTDRWUmtkc2pkdGVsSU85QyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpFNWtieFBJalYwTUVybmtxIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262606),
('KxizOAbXM0tfOXKt6epliaOmElCdskW5NUYWmWmY', NULL, '34.31.253.191', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibjF4WFdhb1NOMG1pMm1rV0tMTVZHSjlBWXcxMjdvT0tVaXpXZGN0SiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778257518),
('KxYgJxOylOGRUVJvbHNgbRFI9z86Fwkj6sijStKh', NULL, '34.23.48.124', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRTNiQlhxS1hDSkwzYzJKaVgxVjU0cXFvUEF1QVpWaHNIUXF5THJPZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778255099),
('n2T3wVy65nE9xVINyqEWGkkc3uRNNQbrrW5Gz46Q', NULL, '196.74.145.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUjBzWGpoZTl1Mnl4UWJLMUNRMjkwbHU0RGRYVnN3MFc1aEU3QWNVbCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpkV0NkSElNTkpobmZDUkZPIjt9fQ==', 1778262209),
('nKgdvPF0ASPOJka3zVA1yCtCgFpCqRTOMvxyKEKb', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUxJbTU0M05IajZ1UXZUaXJyZjFubFNseWg0UjdkWmxBbk5WaWlzZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpkV0NkSElNTkpobmZDUkZPIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262600),
('Nwq0eCEBLeZ3VZkAr67fypanJvY7pTGHRVSxnsa7', NULL, '34.11.190.141', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSEphaFB3YVc2TGx6YndTa0FpbFo5Vk81OEY5UXBEc2RycjROMW9lOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6Y21TQzB6NFdCT0lBeXJQZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778261485),
('oCSFC7gxcgleWoW9C4I57cotNWLwkZI0HETW5rkX', NULL, '34.23.48.124', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUmRzdTNSWFhYT0VyRXVmSDd4WFNVa09PQXlBSEN2ZzExRmVRYzlreSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778256500),
('oJEVpCCCkMLg4qz0BXHwv51IXmwlaCaWMRObX02L', NULL, '34.11.190.141', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaVV1NHFkZ09uYlBvWVY2d3JwRWRSSDBwTG1VME82WUplNnhZandtQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778259854),
('opEG5is7Qj9TP8JSlFthS3YL7MdVwdeRVPP2Nc2p', NULL, '34.31.253.191', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicExBclNISjUzZERoS2ZTMTN6QUs1T1daR3BYa0FCdTc3eU0zREp1WCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778257257),
('oSyACL8GNrlSiqfyuyvD2wKQ8SErp6SooaRB7U72', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicVlMYkdOdlZCcXduZUQ2TU1vT3Exc3hnMFFjcXl1VGdlVHpwVEVPTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6Z0IzT1hPQ0h0MzBoQ0ZxSSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778262606),
('OxQjmZQWm3Au56zyFHQ1nWGkKbej1p2u6eKCC5Vs', NULL, '34.11.190.141', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZERibXVpYTlCaGN3dTV3ZFhUSmlVdGxVV3JCcDlzd3ZrNWJjN3UyQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6Om1ZdlliUVlaU3BEMzhJR3MiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778261732),
('Q2H8Ow1suPYeJCCH5Fe7RvXOtNvJlQuMsfQAvcnU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVmtyWGFXQTRpTExYT3dMWGduOHNHaG15SkNORlU0ck5RR1lTMkdVUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778256844),
('QNtLmbOkA3uNiYWxDc2Ex2omzH2ZXcnSgHQwARYG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU3BvaXZEU0ozeWpxZlFSYm9NN2VkOTdKTXpsaXdJdGNhaWkzeVBFVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpkV0NkSElNTkpobmZDUkZPIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262786),
('R2spDumojmdrrYFg2WLyCzMsOUhRurzxPwBm74DL', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieGdsMVZUcXJzU092UVVQVnNLTXBHTU9Ca3NIblBaMVNONmFNYmI1biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmJOSTdSMXJwa1BPZ2xSVDciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778262600),
('r4kuFLlPivOllmhMckHEr3o8pX4yuYjVf9FoEVR8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmd1UVlSWHVOVlNKV0ZaQmZ6bUlMZGZDN1NiYklhS3NSazV6R3NoMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778259870),
('SljNQLomNcAjw0aH4q25RmKcgQ9nN0wzaxLxHDH8', NULL, '34.31.253.191', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidWZWaDN5VjdzRFVQUUkyVFVVVUoxcmVIMWJMS2NXVmZ0a1NsTDQzTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778259250),
('t7V03roJy23FZ6oC9r07mdLaqQaHkHfnVGlPdTVz', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaU02TjBDbG8xSUNlaW1Tc1FRdWFtTnRJclMwaEFNUDdRdEZmbXJ4ZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpBclYxSjQ0VVNENmpTdnhTIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262606),
('twXfkzS19pjEwaElgFE2w53uoWJleAcXvSltOITm', NULL, '196.74.145.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWE1KMGJtc3NCZDI2SHBaWDZVTnRUVXFwcUhIcFB1VHpkM0Y2NG9JSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6Z0IzT1hPQ0h0MzBoQ0ZxSSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778262499),
('uL0lEHF2yyE5y2l1TSp5LiKuQajq0qLTKovB6Rdb', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT0pmTWM4ZkE1YTBnSnM1WW50RzJWTktaUVJOUkpCdXM3dXE5T0pRaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpkV0NkSElNTkpobmZDUkZPIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262600),
('ULA4m9q6WWcZAoAHFsLQFZJutmbbiysuexU3SiV0', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZnpiZ0ZRTjRodEkxOHh3S0dDQVAyb1Jzc044aEVTTWFyNHpsQ3hvaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6Z0IzT1hPQ0h0MzBoQ0ZxSSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778262600),
('urnLPWKnR8L6wNOZ8fmZAY8LGEaH3CNb7Gn54KbE', NULL, '34.31.253.191', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOHhsanlwelZPT291ZFZtVDRWVlljV3lWWWYzcHhjVEpvaFFsQzJVOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778257257),
('uuuFO4LmvUlgje4hLSiW8x34NMzLshRU7zQn2Pcr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTWRsSVlFaTRTWDhnSmhuTUpmd0Fna0lpYmR4dlV1bFE1S0dpVGxocyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778259870),
('vQd6ypcFhrZsxKQpZzypzInaSwEzu02CJVsBrNQ2', NULL, '34.11.190.141', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU0dYdGgyTG1TTEJYYWo1QnlzMDVUZ1Zxck1XVVBXUFZyN0w0MnpjTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778259854),
('wkTb4o3EbwL9U7s1eLlXn2x2HsQXAqiqdeEssubY', NULL, '34.23.48.124', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaDNNSkI2c1FqTGV4Y21LQjNsRHRsbU1TanZMeExNektuY3c3T09uTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778255100),
('WRMHmtNz2ZzxlKe44rNOpMR4t544YJDxp24f0UNv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibDE3QTVTWE9FcFN4T0paOGRWa0ExZFB3bzFFQUxFSUpKeXFWWllwdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778259870),
('wYUmxKZTORLNbrqDnmu2svPn8smymIWdpUbM380k', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2xLTnRyaVFuUEdjd2xTN09zWTN2Zk0waFU1YlJiTWMwMXhMTWNBWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmJOSTdSMXJwa1BPZ2xSVDciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778262600),
('WZpFMFVqcMHm9ZoS6Q4FrgePW9BvjQ8SyOpI3yaJ', NULL, '196.74.145.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiejBOWWYyVExNZnNHRnE2Rk1wTFVKbjR3ZHVNUExTRnRuZUZUMm1XVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpkV0NkSElNTkpobmZDUkZPIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262345),
('XEerQoqK7fiq738oLvdbkzpHmZ6ewBCc53IYCccZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibDkzRmFyQksxSWxJUk13d1RCUzlzZURIV2loUTU4M0xMZ3dSYVhCbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpkV0NkSElNTkpobmZDUkZPIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778261983),
('Y3eJZyE8cFXx2WDzrmhA4Dp62EkfCX4CK9BS5c0N', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSzZBTFZVY2xIT1hGRWhlR2lYelM4OXhaMHZLeHBwRkFFTkZ3dXZhZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6MmowUWJTOERhc256eDZjYiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778262600),
('YiDhjaSR1O02m3WI8nfDvFvpDeLBOIm0iUjWCEEV', NULL, '34.148.47.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkh1ZGRFVFlHa2pUN1Jvb2hER3BjZ0tobmZoV2d1VGdnQTVLYnJ3MSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpBclYxSjQ0VVNENmpTdnhTIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778262600),
('zBDg0acj4wrbtPmBw9z5bzyZPTSbEWmn8y8gZp8A', NULL, '34.31.253.191', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibnc4ejUwVnlZcjN5NlFmVndaenR4NTFHV1dMUXlWRkNsVml5NkNwSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778257257);

-- --------------------------------------------------------

--
-- Table structure for table `site_stats`
--

CREATE TABLE `site_stats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_stats`
--

INSERT INTO `site_stats` (`id`, `label`, `value`, `icon`, `suffix`, `ordering`, `is_active`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'Happy Travelers', '2500', 'users', '+', 1, 1, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(2, 'Active Clubs', '15', 'map', '', 2, 1, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(3, 'Events Per Year', '120', 'calendar', '+', 3, 1, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(4, 'Countries', '25', 'globe', '+', 4, 1, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `photo_id` bigint(20) UNSIGNED DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`social_links`)),
  `ordering` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `name`, `role`, `bio`, `photo_id`, `email`, `phone`, `social_links`, `ordering`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Ahmed Benali', 'Founder & CEO', 'Passionate about sustainable tourism and cultural preservation.', NULL, NULL, NULL, '{\"linkedin\":\"#\",\"twitter\":\"#\"}', 1, 1, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(2, 'Fatima El Amrani', 'Operations Director', 'With 15 years of experience in tourism management.', NULL, NULL, NULL, '{\"linkedin\":\"#\"}', 2, 1, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(3, 'Youssef Kadiri', 'Head Guide', 'Born and raised in the Atlas Mountains.', NULL, NULL, NULL, '{\"instagram\":\"#\"}', 3, 1, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `theme_settings`
--

CREATE TABLE `theme_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `primary_color` varchar(7) NOT NULL DEFAULT '#112250',
  `secondary_color` varchar(7) NOT NULL DEFAULT '#D8C18D',
  `custom_css` text DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `theme_settings`
--

INSERT INTO `theme_settings` (`id`, `primary_color`, `secondary_color`, `custom_css`, `updated_by`, `updated_at`) VALUES
('default', '#112250', '#D8C18D', NULL, NULL, '2026-05-08 15:24:06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `profile_image_url` varchar(500) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `interests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`interests`)),
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `username`, `first_name`, `last_name`, `profile_image_url`, `bio`, `phone`, `location`, `interests`, `role`, `is_admin`, `is_active`, `email_verified`) VALUES
('9b00000e-dd3d-46c9-a02f-8328b6da1f2f', 'Admin User', 'admin@morocclubs.com', NULL, '$2y$12$/KYTyClmYjHRc26DnvQrS.goZG.hjquakizLE0IKTlW0DUk4ihOVi', NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06', 'admin', 'Admin', 'User', NULL, NULL, NULL, NULL, '[]', 'admin', 1, 1, 0),
('user_1778254877_FvY6eUp0A', 'ef rer', 'elfakirfikri@gmail.com', NULL, '$2y$12$UPa2Mz3l22TXRKI13sYHq.QtfbA0TVVK.OhiIong/bxunrirv/w2y', NULL, '2026-05-08 15:41:17', '2026-05-08 16:00:00', 'elfakirfikri@gmail.com', 'fikri', 'rer', NULL, NULL, NULL, NULL, '[]', 'user', 0, 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_settings`
--
ALTER TABLE `about_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blog_posts_slug_unique` (`slug`);

--
-- Indexes for table `booking_events`
--
ALTER TABLE `booking_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booking_page_settings`
--
ALTER TABLE `booking_page_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booking_tickets`
--
ALTER TABLE `booking_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_tickets_booking_reference_unique` (`booking_reference`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clubs_slug_unique` (`slug`);

--
-- Indexes for table `club_gallery`
--
ALTER TABLE `club_gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `club_memberships`
--
ALTER TABLE `club_memberships`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `club_reviews`
--
ALTER TABLE `club_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_settings`
--
ALTER TABLE `contact_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events_clubs`
--
ALTER TABLE `events_clubs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_gallery`
--
ALTER TABLE `event_gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_participants`
--
ALTER TABLE `event_participants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_prices`
--
ALTER TABLE `event_prices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_reviews`
--
ALTER TABLE `event_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_schedule`
--
ALTER TABLE `event_schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `focus_items`
--
ALTER TABLE `focus_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `footer_settings`
--
ALTER TABLE `footer_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hero_settings`
--
ALTER TABLE `hero_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `landing_sections`
--
ALTER TABLE `landing_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `landing_sections_slug_unique` (`slug`);

--
-- Indexes for table `landing_testimonials`
--
ALTER TABLE `landing_testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media_assets`
--
ALTER TABLE `media_assets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `membership_applications`
--
ALTER TABLE `membership_applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `navbar_settings`
--
ALTER TABLE `navbar_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partner_settings`
--
ALTER TABLE `partner_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment_settings`
--
ALTER TABLE `payment_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `president_message_settings`
--
ALTER TABLE `president_message_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `section_blocks`
--
ALTER TABLE `section_blocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seo_settings`
--
ALTER TABLE `seo_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `site_stats`
--
ALTER TABLE `site_stats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `theme_settings`
--
ALTER TABLE `theme_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `club_gallery`
--
ALTER TABLE `club_gallery`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `club_memberships`
--
ALTER TABLE `club_memberships`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `club_reviews`
--
ALTER TABLE `club_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events_clubs`
--
ALTER TABLE `events_clubs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_gallery`
--
ALTER TABLE `event_gallery`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_participants`
--
ALTER TABLE `event_participants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_prices`
--
ALTER TABLE `event_prices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_reviews`
--
ALTER TABLE `event_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_schedule`
--
ALTER TABLE `event_schedule`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `focus_items`
--
ALTER TABLE `focus_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `landing_sections`
--
ALTER TABLE `landing_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `landing_testimonials`
--
ALTER TABLE `landing_testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `media_assets`
--
ALTER TABLE `media_assets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `membership_applications`
--
ALTER TABLE `membership_applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `partners`
--
ALTER TABLE `partners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `section_blocks`
--
ALTER TABLE `section_blocks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_stats`
--
ALTER TABLE `site_stats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
