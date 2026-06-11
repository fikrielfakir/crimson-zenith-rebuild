-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 23, 2026 at 02:40 PM
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
('85c829cc-d86d-45d1-9128-d2769e88a7fa', NULL, 1, 'lkpjlpds', NULL, 'aamowe pewwije', 'sasoa', NULL, NULL, NULL, NULL, '2026-05-08', '2026-05-05', '2026-05-08 04:44:00', 120, NULL, 5, 0, 'meetup', '[\"amazight , darijaa\"]', NULL, 16, NULL, 120, NULL, 12, NULL, '[]', 'blob:http://192.168.56.1:5000/cfc061a6-50ba-4310-8423-0efcf342eaf5', '[]', '[\"transport ,each , drinks\"]', '[\"lorem\"]', '[]', 'should be take identity', 'upcoming', 1, NULL, '2026-05-08 10:44:54', '2026-05-10 14:36:20'),
('97c9d390-987a-4dbe-89c1-6f4e7e2613ef', 2, 0, 'laskoak', NULL, 'lsakaskan saokoskao ps', 'Tanger Morocco', NULL, NULL, NULL, NULL, '2026-05-09', '2026-05-07', '2026-05-09 05:53:00', 150, NULL, 5, 0, 'webinar', '[\"amazight , darijaa\"]', NULL, 16, NULL, 160, 14, 16, NULL, '[]', '/uploads/b4dfce9b-829c-4802-899a-0525e31bd560.jpg', '[\"slaoks\"]', '[\"lakskj\"]', '[\"nsasj sha\"]', '[]', NULL, 'ongoing', 1, NULL, '2026-05-08 11:54:49', '2026-05-10 15:52:39');

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

--
-- Dumping data for table `booking_tickets`
--

INSERT INTO `booking_tickets` (`id`, `booking_reference`, `event_id`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `number_of_participants`, `event_date`, `total_price`, `payment_status`, `payment_method`, `transaction_id`, `special_requests`, `status`, `confirmed_at`, `cancelled_at`, `cancellation_reason`, `created_at`, `updated_at`) VALUES
('289f1aa0-1094-4c03-9bc0-89c55867f7cb', 'TJ-CRKAUC3D', '97c9d390-987a-4dbe-89c1-6f4e7e2613ef', 'guest', 'fikri rer', 'elfakirfikri@gmail.com', '+212 6961267', 2, '2026-05-09 04:53:00', 300.00, 'pending', 'cash', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-05-10 15:46:39', '2026-05-10 15:46:39'),
('586eeb2b-ee95-4477-b4c4-fbbe305e3833', 'TJ-QN6IMGS9', '97c9d390-987a-4dbe-89c1-6f4e7e2613ef', 'guest', 'fikri rer', 'elfakirfikri@gmail.com', '+212696126701', 2, '2026-05-09 04:53:00', 300.00, 'pending', 'cmi', 'DEMO-N8NDDXJH8G', NULL, 'pending', NULL, NULL, NULL, '2026-05-10 15:50:26', '2026-05-10 15:50:26'),
('9c40c383-d572-4b98-941e-ff2f21109889', 'TJ-P5QXCNHV', '97c9d390-987a-4dbe-89c1-6f4e7e2613ef', 'guest', 'fikri rer', 'elfakirfikri@gmail.com', '+212696126701', 2, '2026-05-09 04:53:00', 300.00, 'confirmed', 'cash', NULL, NULL, 'confirmed', '2026-05-10 16:14:02', NULL, NULL, '2026-05-10 15:41:07', '2026-05-10 16:14:02'),
('aa3bb533-5952-4111-9701-df33febbeb0b', 'TJ-PUKTCYAX', '97c9d390-987a-4dbe-89c1-6f4e7e2613ef', 'guest', 'fikri rer', 'elfakirfikri@gmail.com', '+212696126701', 2, '2026-05-09 04:53:00', 300.00, 'pending', 'cash', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-05-10 15:47:54', '2026-05-10 15:47:54'),
('b55ffa15-a781-4460-9ba8-aff9c3729cfc', 'TJ-3S7ANIJQ', '97c9d390-987a-4dbe-89c1-6f4e7e2613ef', 'guest', 'fikri rer', 'elfakirfikri@gmail.com', '+212696126701', 2, '2026-05-09 04:53:00', 300.00, 'pending', 'cash', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-05-10 15:52:39', '2026-05-10 15:52:39'),
('c3f467f1-b9ca-4d6b-a146-a6e68b0cb05c', 'TJ-KTHNA5WQ', '85c829cc-d86d-45d1-9128-d2769e88a7fa', 'guest', 'fikri rer', 'elfakirfikri@gmail.com', NULL, 2, '2026-05-08 03:44:00', 240.00, 'confirmed', 'cmi', 'DEMO-SHOD9QZOOP', NULL, 'confirmed', '2026-05-10 14:37:52', NULL, NULL, '2026-05-10 14:32:16', '2026-05-10 14:37:52');

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
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `title` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `hero_type` varchar(20) NOT NULL DEFAULT 'image',
  `hero_video` text DEFAULT NULL,
  `hero_overlay` tinyint(3) UNSIGNED NOT NULL DEFAULT 50,
  `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`highlights`)),
  `culture` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`culture`)),
  `cuisine` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cuisine`)),
  `activities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`activities`)),
  `best_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`best_time`)),
  `getting_there` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`getting_there`)),
  `travel_tips` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`travel_tips`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `slug`, `title`, `description`, `image`, `hero_type`, `hero_video`, `hero_overlay`, `highlights`, `culture`, `cuisine`, `activities`, `best_time`, `getting_there`, `travel_tips`, `is_active`, `ordering`, `created_at`, `updated_at`) VALUES
(1, 'Tangier', 'tangier', 'Gateway Between Continents', 'Tangier2, Morocco\'s gateway between Africa and Europe, is a captivating city where cultures converge at the crossroads of the Mediterranean Sea and the Atlantic Ocean.', '/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png', 'video', '/uploads/hero-media/2d29b3ad-45bb-470e-a029-ccb48c5e659d.mp4', 50, '[{\"text\":\"Historic Kasbah\",\"image\":\"\\/uploads\\/478f6834-7a89-44b4-8644-c7004da02eb7.jpg\"},\"Caf\\u00e9 Hafa\",\"Strait of Gibraltar\",\"American Legation Museum\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"Tangier\'s rich cultural tapestry reflects centuries of cross-continental exchange.\",\"highlights\":[\"Multicultural heritage spanning three continents\",\"Famous artistic community and literary history\",\"Blend of Moroccan, Spanish, and French influences\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Fresh Seafood\",\"description\":\"Mediterranean and Atlantic catch prepared with Moroccan spices\"},{\"name\":\"Tangia\",\"description\":\"Slow-cooked meat stew unique to Northern Morocco\"},{\"name\":\"Pastilla\",\"description\":\"Sweet and savory pastry with pigeon or chicken\"},{\"name\":\"Mint Tea\",\"description\":\"Traditional Moroccan tea served at legendary caf\\u00e9s\"}]}', '[{\"name\":\"Explore the Medina\",\"icon\":\"map\",\"description\":\"Wander through ancient streets filled with artisan workshops\"},{\"name\":\"Visit Hercules Caves\",\"icon\":\"mountain\",\"description\":\"Discover mythological caves with stunning Atlantic Ocean views\"},{\"name\":\"Relax at Caf\\u00e9 Hafa\",\"icon\":\"coffee\",\"description\":\"Enjoy mint tea at the legendary cliffside caf\\u00e9\"},{\"name\":\"Beach Activities\",\"icon\":\"waves\",\"description\":\"Swim, surf, or sunbathe on pristine Mediterranean beaches\"}]', '{\"season\":\"Spring & Fall\",\"months\":\"April-May, September-October\",\"description\":\"Mild temperatures and fewer crowds make these months ideal.\",\"temperature\":\"18-25\\u00b0C (64-77\\u00b0F)\"}', '{\"airport\":\"Tangier Ibn Battouta Airport (TNG)\",\"transport\":[\"Direct flights from major European cities\",\"High-speed train from Casablanca (2h 10min)\",\"Ferry connections from Spain\"],\"localTransport\":\"Taxis, rental cars, and local buses are readily available.\"}', '[\"The medina is best explored on foot\",\"Bargaining is expected in souks and markets\",\"Learn basic French or Spanish phrases\",\"Visit Caf\\u00e9 Hafa during sunset\",\"Book ferry tickets in advance during peak season\"]', 1, 1, '2026-05-11 09:57:00', '2026-05-11 18:28:59'),
(2, 'Tetouan', 'tetouan', 'The White Dove', 'Tetouan, known as the White Dove, is a gem of Andalusian heritage nestled between the Rif Mountains and the Mediterranean, with one of Morocco\'s best-preserved medinas.', '/attached_assets/generated_images/Tetouan_medina_panorama_b1f6dcbc.png', 'image', NULL, 50, '[\"UNESCO Medina\",\"Andalusian Architecture\",\"Place Hassan II\",\"Royal Palace\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"Tetouan is the most Andalusian of all Moroccan cities, shaped by Moorish refugees from Spain.\",\"highlights\":[\"UNESCO World Heritage medina since 1997\",\"Strongest Andalusian influence in Morocco\",\"Renowned school of traditional music\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Couscous Tetouan\",\"description\":\"Seven-vegetable couscous in the Andalusian tradition\"},{\"name\":\"Briouats\",\"description\":\"Crispy pastry parcels filled with meat or cheese\"},{\"name\":\"Harira\",\"description\":\"Rich tomato and lentil soup, a Moroccan staple\"},{\"name\":\"Chebakia\",\"description\":\"Sesame and honey pastry dusted with powdered sugar\"}]}', '[{\"name\":\"Medina Walking Tour\",\"icon\":\"map\",\"description\":\"Explore the UNESCO-listed medina on foot\"},{\"name\":\"Museum of Tetouan\",\"icon\":\"mountain\",\"description\":\"Discover Amazigh art and artefacts\"},{\"name\":\"Martil Beach\",\"icon\":\"waves\",\"description\":\"Relax on the nearby Mediterranean beach\"},{\"name\":\"Artisan Crafts\",\"icon\":\"coffee\",\"description\":\"Shop for embroidery and zellige tilework\"}]', '{\"season\":\"Spring & Fall\",\"months\":\"April-June, September-October\",\"description\":\"Ideal weather for exploring the medina and nearby beaches.\",\"temperature\":\"17-27\\u00b0C (63-81\\u00b0F)\"}', '{\"airport\":\"Tangier Ibn Battouta Airport (TNG) \\u2014 60 km\",\"transport\":[\"Regular buses from Tangier (1 hour)\",\"Grand taxis from Tangier or Chefchaouen\",\"CTM bus from major Moroccan cities\"],\"localTransport\":\"Petit taxis and walking are the best ways around the medina.\"}', '[\"Hire a local guide for the medina\",\"Visit the souk on Friday morning\",\"Try local pastries at the medina bakeries\",\"The beach resort of Martil is 5 km away\",\"Dress modestly inside the medina\"]', 1, 2, '2026-05-11 09:57:00', '2026-05-11 12:21:09'),
(3, 'Al Hoceima', 'al-hoceima', 'Mediterranean Paradise', 'Al Hoceima is a breathtaking coastal city set against the dramatic backdrop of the Rif Mountains. Its crystal-clear Mediterranean waters and rugged landscapes make it one of Morocco\'s most unspoiled destinations.', '/attached_assets/generated_images/Al_Hoceima_coastal_view_9e4e9e0c.png', 'image', NULL, 50, '[\"Al Hoceima National Park\",\"Plage Quemado\",\"Rif Mountains\",\"Spanish Island\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"Al Hoceima is the heartland of the Amazigh Riffian culture, with a strong sense of local identity.\",\"highlights\":[\"Amazigh Riffian cultural heartland\",\"Hirak civil movement history\",\"Traditional Riffian music and festivals\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Grilled Octopus\",\"description\":\"Freshly caught and grilled with chermoula sauce\"},{\"name\":\"Fried Calamari\",\"description\":\"Crispy squid rings served with lemon\"},{\"name\":\"Amazigh Bread\",\"description\":\"Traditional Riffian flatbread baked in clay ovens\"},{\"name\":\"Fresh Sea Bream\",\"description\":\"Mediterranean fish prepared simply with olive oil and herbs\"}]}', '[{\"name\":\"National Park Hiking\",\"icon\":\"mountain\",\"description\":\"Trek through Mediterranean forests and cliffs\"},{\"name\":\"Snorkelling & Diving\",\"icon\":\"waves\",\"description\":\"Explore crystal-clear Mediterranean waters\"},{\"name\":\"Plage Quemado\",\"icon\":\"waves\",\"description\":\"Swim at the stunning crescent beach\"},{\"name\":\"Boat to Spanish Island\",\"icon\":\"map\",\"description\":\"Visit the historic Pe\\u00f1\\u00f3n de Alhucemas island\"}]', '{\"season\":\"Summer\",\"months\":\"June-September\",\"description\":\"The warmest and sunniest months for beach and water activities.\",\"temperature\":\"22-32\\u00b0C (72-90\\u00b0F)\"}', '{\"airport\":\"Cherif Al Idrissi Airport (AHU)\",\"transport\":[\"Seasonal flights from European cities\",\"CTM buses from Fes, Casablanca, and Tangier\",\"Grand taxis from Nador or Tetouan\"],\"localTransport\":\"Taxis and rental cars. Many beaches require a car or boat.\"}', '[\"Book accommodation early in summer\",\"Rent a car to reach hidden beaches\",\"Respect local Amazigh customs\",\"Try the freshly caught seafood at harbour restaurants\",\"Avoid peak July\\u2013August if you prefer fewer crowds\"]', 1, 3, '2026-05-11 09:57:00', '2026-05-11 12:21:29'),
(4, 'Chefchaouen', 'chefchaouen', 'The Blue Pearl', 'Chefchaouen, affectionately known as the Blue Pearl of Morocco, is a mesmerizing mountain town where every corner reveals a new shade of blue.', '/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png', 'image', NULL, 50, '[\"Blue Medina\",\"Spanish Mosque\",\"Ras El Maa Waterfall\",\"Traditional Crafts\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"The iconic blue color originated with Jewish refugees in the 1930s.\",\"highlights\":[\"Iconic blue-washed buildings\",\"Blend of Berber, Moorish, and Jewish heritage\",\"Traditional weaving workshops\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Goat Cheese\",\"description\":\"Fresh local cheese made from Rif Mountain goat milk\"},{\"name\":\"Bissara\",\"description\":\"Hearty fava bean soup topped with olive oil and cumin\"},{\"name\":\"Tajine Kefta\",\"description\":\"Spiced meatballs in rich tomato sauce\"},{\"name\":\"Moroccan Pancakes\",\"description\":\"Msemen served with honey and butter\"}]}', '[{\"name\":\"Wander Blue Streets\",\"icon\":\"map\",\"description\":\"Get lost in the photogenic blue-washed medina\"},{\"name\":\"Spanish Mosque Sunset\",\"icon\":\"mountain\",\"description\":\"Hike to the mosque for panoramic sunset views\"},{\"name\":\"Ras El Maa Waterfall\",\"icon\":\"waves\",\"description\":\"Visit the mountain spring and waterfall\"},{\"name\":\"Artisan Shopping\",\"icon\":\"coffee\",\"description\":\"Browse handwoven blankets and traditional crafts\"}]', '{\"season\":\"Spring & Fall\",\"months\":\"April-May, September-October\",\"description\":\"Perfect mountain weather for exploring.\",\"temperature\":\"12-24\\u00b0C (54-75\\u00b0F)\"}', '{\"airport\":\"Tangier Ibn Battouta Airport (TNG)\",\"transport\":[\"2.5 hours from Tangier by bus\",\"3 hours from Fes\",\"Regular CTM bus services\"],\"localTransport\":\"The medina is entirely pedestrian.\"}', '[\"Wear comfortable shoes\",\"Best photos early morning\",\"Bargain politely in shops\",\"Stay overnight for the atmosphere\",\"Visit the kasbah for panoramic views\"]', 1, 4, '2026-05-11 09:57:00', '2026-05-11 09:57:00'),
(5, 'Fes', 'fes', 'Spiritual & Cultural Heart', 'Fes el-Bali is one of the best-preserved medieval cities in the Arab world, home to the world\'s oldest continuously operating university.', '/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png', 'video', '/uploads/hero-media/6b56b1ce-098e-443d-8231-f334776a7c24.mp4', 50, '[\"Al Quaraouiyine University\",\"Chouara Tannery\",\"Bou Inania Madrasa\",\"Royal Palace Gates\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"Founded in 789 AD, Fes is Morocco\'s spiritual and intellectual capital.\",\"highlights\":[\"World\'s oldest university since 859 AD\",\"UNESCO World Heritage medina\",\"Center of traditional craftsmanship\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Fes Pastilla\",\"description\":\"Legendary sweet-savory pigeon pie with almonds\"},{\"name\":\"Rfissa\",\"description\":\"Shredded msemen bread with chicken in fenugreek sauce\"},{\"name\":\"Mechoui\",\"description\":\"Slow-roasted whole lamb\"},{\"name\":\"Zaalouk\",\"description\":\"Smoky eggplant and tomato salad\"}]}', '[{\"name\":\"Navigate the Medina\",\"icon\":\"map\",\"description\":\"Explore 9,000 alleyways with a local guide\"},{\"name\":\"Visit Tanneries\",\"icon\":\"coffee\",\"description\":\"Watch leather dyed using 1,000-year-old techniques\"},{\"name\":\"Madrasa Architecture\",\"icon\":\"map\",\"description\":\"Marvel at intricate tilework and carved plaster\"},{\"name\":\"Artisan Workshops\",\"icon\":\"coffee\",\"description\":\"See craftsmen making pottery and metalwork\"}]', '{\"season\":\"Spring & Fall\",\"months\":\"March-May, September-November\",\"description\":\"Comfortable temperatures for walking the medina.\",\"temperature\":\"10-26\\u00b0C (50-79\\u00b0F)\"}', '{\"airport\":\"Fes\\u2013Sa\\u00efss Airport (FEZ)\",\"transport\":[\"Direct flights from European cities\",\"High-speed train from Casablanca (2.5h)\",\"Regular bus services\"],\"localTransport\":\"The medina is pedestrian-only. Hire a guide for your first visit.\"}', '[\"Hire an official guide for your first medina visit\",\"Visit tanneries in the morning\",\"Bring mint leaves near the tanneries\",\"Stay in a traditional riad\",\"Visit during the Sacred Music Festival in June\"]', 1, 5, '2026-05-11 09:57:00', '2026-05-11 18:41:18'),
(6, 'Essaouira', 'essaouira', 'Wind City of Africa', 'Essaouira is a laid-back coastal gem where Atlantic breezes sweep through whitewashed streets, a UNESCO World Heritage site beloved by artists and musicians.', '/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png', 'image', NULL, 50, '[\"Skala de la Ville\",\"Fishing Port\",\"Gnaoua Festival\",\"Windsurfing\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"The UNESCO-listed medina reflects its history as a cosmopolitan trading port.\",\"highlights\":[\"UNESCO World Heritage fortified medina\",\"Annual Gnaoua World Music Festival\",\"Thriving contemporary art and music scene\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Fresh Grilled Sardines\",\"description\":\"Daily catch grilled at the harbor\"},{\"name\":\"Seafood Tagine\",\"description\":\"Mixed seafood in aromatic chermoula sauce\"},{\"name\":\"Oysters\",\"description\":\"Fresh Atlantic oysters from local farms\"},{\"name\":\"Argan Oil Amlou\",\"description\":\"Sweet spread made from argan oil and almonds\"}]}', '[{\"name\":\"Windsurfing\",\"icon\":\"waves\",\"description\":\"Ride consistent Atlantic winds at world-class beaches\"},{\"name\":\"Explore the Ramparts\",\"icon\":\"map\",\"description\":\"Walk along Skala de la Ville fortifications\"},{\"name\":\"Art Gallery Hopping\",\"icon\":\"coffee\",\"description\":\"Browse contemporary Moroccan art galleries\"},{\"name\":\"Beach Horseback Riding\",\"icon\":\"mountain\",\"description\":\"Gallop along Atlantic beaches at sunset\"}]', '{\"season\":\"Year-Round\",\"months\":\"April-June, September-November\",\"description\":\"Mild temperatures year-round thanks to ocean breezes.\",\"temperature\":\"16-24\\u00b0C (61-75\\u00b0F)\"}', '{\"airport\":\"Essaouira-Mogador Airport (ESU) or Marrakech (RAK)\",\"transport\":[\"2.5-3 hours from Marrakech by bus\",\"Direct flights from European cities (seasonal)\",\"Regular Supratours buses\"],\"localTransport\":\"The compact medina is walkable.\"}', '[\"Book early during Gnaoua Festival (late June)\",\"Bring layers for the ocean winds\",\"Visit the fish market for fresh seafood\",\"Take a day trip to Sidi Kaouki beach\",\"Thursday souk in Diabat village is authentic\"]', 1, 6, '2026-05-11 09:57:00', '2026-05-11 09:57:00');

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
(1, 'Ensah', 'ensah', 'Mountain trekking and hiking adventures', NULL, 'https://api.thejourney-ma.org/uploads/clubs/club_69fdabad924b29.77435244.png', 'Atlas Mountains', 250, '[]', '+212696126701', 'elfakirfikri@gmail.com', 'https://magneseo.com/', '{\"facebook\":\"facebook.com\\/club\",\"instagram\":\"facebook.com\\/club.com\",\"twitter\":\"facebook.com\\/club\"}', 5, NULL, 1, 0, 35.743100, -5.408207, NULL, '2026-05-02 10:40:06', '2026-05-10 17:57:23'),
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

--
-- Dumping data for table `contact_settings`
--

INSERT INTO `contact_settings` (`id`, `office_address`, `email`, `phone`, `office_hours`, `map_latitude`, `map_longitude`, `form_recipients`, `auto_reply_enabled`, `auto_reply_message`, `social_links`, `updated_by`, `updated_at`) VALUES
('default', NULL, NULL, NULL, NULL, NULL, NULL, '[]', 0, NULL, '{}', NULL, '2026-05-23 10:59:23');

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

CREATE TABLE `contact_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
  `admin_notes` text DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_submissions`
--

INSERT INTO `contact_submissions` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `admin_notes`, `read_at`, `created_at`, `updated_at`) VALUES
(1, 'FIKRI EL FAKIR', 'elfakirfikri@gmail.com', '+212696126701', 'Contact Form Submission', 'deder', 'read', NULL, '2026-05-20 14:26:48', '2026-05-20 13:20:51', '2026-05-20 14:26:48');

-- --------------------------------------------------------

--
-- Table structure for table `discover_page_settings`
--

CREATE TABLE `discover_page_settings` (
  `id` varchar(255) NOT NULL,
  `hero_title` varchar(255) NOT NULL DEFAULT 'Discover',
  `hero_subtitle` text DEFAULT NULL,
  `hero_bg_image` varchar(255) DEFAULT NULL,
  `intro_heading` varchar(255) DEFAULT NULL,
  `intro_description` text DEFAULT NULL,
  `cta_heading` varchar(255) DEFAULT NULL,
  `cta_description` text DEFAULT NULL,
  `cta_button_text` varchar(255) DEFAULT NULL,
  `cta_button_link` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `discover_page_settings`
--

INSERT INTO `discover_page_settings` (`id`, `hero_title`, `hero_subtitle`, `hero_bg_image`, `intro_heading`, `intro_description`, `cta_heading`, `cta_description`, `cta_button_text`, `cta_button_link`, `updated_by`) VALUES
('default', 'Discover', 'Embark on a journey through Morocco\'s most enchanting destinations. From ancient medinas to coastal paradises, discover the soul of this magnificent country.', '/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png', 'Morocco, a melting pot of dynasties and cultures', 'From the northern coastal cities touching the Mediterranean to the ancient imperial cities steeped in history, Morocco offers an incredible tapestry of experiences. Each city tells its own unique story, shaped by centuries of diverse cultural influences, from Berber traditions to Arab, Andalusian, and European heritage. Discover the soul of Morocco through its most captivating cities, where ancient medinas meet modern vitality, and every street corner reveals a new chapter in this nation\'s rich cultural narrative.', 'Ready to Start Your Journey?', 'Join us to explore these magnificent cities and create unforgettable memories in Morocco.', 'JOIN THE JOURNEY', '/join-us', NULL);

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
-- Table structure for table `event_translations`
--

CREATE TABLE `event_translations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `locale` varchar(10) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `location_details` varchar(255) DEFAULT NULL,
  `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`highlights`)),
  `included` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`included`)),
  `not_included` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`not_included`)),
  `important_info` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `experts`
--

CREATE TABLE `experts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `expertise` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`expertise`)),
  `rating` decimal(3,1) NOT NULL DEFAULT 5.0,
  `projects_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `years_experience` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`languages`)),
  `bio` text DEFAULT NULL,
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`achievements`)),
  `certifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`certifications`)),
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `experts`
--

INSERT INTO `experts` (`id`, `name`, `title`, `location`, `image`, `linkedin_url`, `contact_email`, `expertise`, `rating`, `projects_count`, `years_experience`, `languages`, `bio`, `achievements`, `certifications`, `is_available`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Fikri', 'Dev', 'AL hoceima', '/uploads/b5104403-f23b-4f58-80ce-8483a8c4790b.png', 'kjocdhub', NULL, '[\"it\"]', 5.0, 0, 4, '[\"fr\"]', 'sknwsbwb', '[\"kjsdbhsd\"]', '[]', 1, 'published', '2026-05-20 16:21:10', '2026-05-20 16:46:35');

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
  `image_url` varchar(1000) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `focus_items`
--

INSERT INTO `focus_items` (`id`, `title`, `icon`, `description`, `ordering`, `is_active`, `media_id`, `image_url`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Adventure & Exploration', 'mountain', 'Experience thrilling outdoor adventures from Atlas Mountains to Sahara Desert', 1, 1, NULL, NULL, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(2, 'Cultural Immersion', 'globe', 'Connect with local communities and discover authentic Moroccan traditions', 2, 1, NULL, NULL, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(3, 'Sustainable Tourism', 'leaf', 'Travel responsibly while supporting local economies and preserving nature', 3, 1, NULL, NULL, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06'),
(4, 'Community Building', 'users', 'Join a vibrant network of adventurers and culture enthusiasts', 4, 1, NULL, NULL, NULL, '2026-05-02 10:40:06', '2026-05-02 10:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `focus_section_settings`
--

CREATE TABLE `focus_section_settings` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Our Focus',
  `subtitle` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `focus_section_settings`
--

INSERT INTO `focus_section_settings` (`id`, `title`, `subtitle`, `is_active`, `updated_by`) VALUES
('default', 'Our Focus', 'Tourism, Culture, Entertainment', 1, NULL);

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
-- Table structure for table `gallery_items`
--

CREATE TABLE `gallery_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `photographer` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(2000) NOT NULL,
  `panorama_url` varchar(2000) DEFAULT NULL,
  `has_360` tinyint(1) NOT NULL DEFAULT 0,
  `hotspots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hotspots`)),
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `aspect` varchar(255) NOT NULL DEFAULT 'landscape',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gallery_items`
--

INSERT INTO `gallery_items` (`id`, `title`, `location`, `category`, `photographer`, `description`, `image_url`, `panorama_url`, `has_360`, `hotspots`, `is_featured`, `sort_order`, `aspect`, `created_at`, `updated_at`) VALUES
(9, 'soajs', NULL, 'cultural', NULL, NULL, '/uploads/7cf699ec-36e7-4fdb-8491-673a94f30b59.jpg', '/uploads/750c10ad-6959-4965-8465-423a007b337c.jpg', 1, NULL, 0, 0, 'landscape', '2026-05-11 15:35:45', '2026-05-11 15:55:35'),
(10, 'kjhh', NULL, 'cultural', NULL, NULL, '/uploads/c7085d05-aa3c-443e-b3e4-1788b987fa63.jpg', '/uploads/66deb44c-87b2-4f76-b0ea-e01acca4678e.jpg', 1, NULL, 0, 0, 'landscape', '2026-05-11 15:55:57', '2026-05-11 15:55:57'),
(11, 'lj;lj', NULL, 'cultural', NULL, NULL, '/uploads/c6bb5278-0b06-4381-ab40-0610db819a13.jpg', '/uploads/74aec7b2-9565-4e9b-9c7b-f32f16fdcde6.jpg', 1, NULL, 0, 0, 'landscape', '2026-05-11 15:56:19', '2026-05-11 15:56:19'),
(12, 'hjhj', NULL, 'cultural', NULL, NULL, '/uploads/8dbd8395-6e49-4eaa-9b4a-1fad5a2ff757.jpg', '/uploads/a2fd4c99-9b0f-483c-bd04-941d4d1136b4.jpg', 1, NULL, 0, 0, 'landscape', '2026-05-11 15:56:41', '2026-05-11 15:56:58'),
(13, 'xzx', NULL, 'cultural', NULL, NULL, '/uploads/565a0cb7-82f0-431a-b2bd-f880e1dd02e3.png', NULL, 0, NULL, 0, 0, 'landscape', '2026-05-11 16:37:56', '2026-05-11 16:37:56'),
(14, 'sasas', NULL, 'cultural', NULL, NULL, '/uploads/9610731b-7ba2-406b-a0bb-3f22e6162740.jpg', NULL, 0, NULL, 0, 0, 'landscape', '2026-05-11 16:38:07', '2026-05-11 16:38:07'),
(15, 'sas', NULL, 'cultural', NULL, NULL, '/uploads/d4435e04-ad2a-42eb-b89b-da8ab27ab1ed.jpg', NULL, 0, NULL, 0, 0, 'landscape', '2026-05-11 16:38:16', '2026-05-11 16:38:16'),
(16, 'as', 'lllll', 'cultural', NULL, NULL, '/uploads/d215e212-0619-4db6-91ca-bb00cf60730b.jpg', NULL, 0, NULL, 0, 0, 'landscape', '2026-05-11 16:38:27', '2026-05-11 16:48:55'),
(17, 'sas', NULL, 'cultural', NULL, NULL, '/uploads/3bf934ef-2956-459b-bd75-6f1c0eebd1df.jpg', NULL, 0, NULL, 0, 0, 'landscape', '2026-05-11 16:38:41', '2026-05-11 16:38:41');

-- --------------------------------------------------------

--
-- Table structure for table `hero_settings`
--

CREATE TABLE `hero_settings` (
  `id` varchar(255) NOT NULL DEFAULT 'default',
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`title`)),
  `subtitle` text NOT NULL DEFAULT 'Experience Morocco\'s soul through sustainable journeys.',
  `primary_button_text` varchar(100) NOT NULL DEFAULT 'Start Your Journey',
  `primary_button_link` varchar(500) NOT NULL DEFAULT '/discover',
  `secondary_button_text` varchar(100) NOT NULL DEFAULT 'Explore Clubs',
  `secondary_button_link` varchar(500) NOT NULL DEFAULT '/clubs',
  `show_primary_button` tinyint(1) NOT NULL DEFAULT 1,
  `show_secondary_button` tinyint(1) NOT NULL DEFAULT 1,
  `background_type` varchar(20) NOT NULL DEFAULT 'image',
  `background_media_id` bigint(20) UNSIGNED DEFAULT NULL,
  `background_image_url` varchar(1000) DEFAULT NULL,
  `background_video_url` varchar(1000) DEFAULT NULL,
  `background_overlay_color` varchar(50) NOT NULL DEFAULT 'rgba(26, 54, 93, 0.7)',
  `background_overlay_opacity` int(11) NOT NULL DEFAULT 70,
  `title_font_size` varchar(50) NOT NULL DEFAULT '65px',
  `title_color` varchar(50) NOT NULL DEFAULT '#ffffff',
  `title_alignment` varchar(20) NOT NULL DEFAULT 'center',
  `subtitle_font_size` varchar(50) NOT NULL DEFAULT '20px',
  `subtitle_color` varchar(50) NOT NULL DEFAULT '#ffffff',
  `subtitle_alignment` varchar(20) NOT NULL DEFAULT 'center',
  `hero_height` varchar(20) NOT NULL DEFAULT '600',
  `content_max_width` varchar(20) NOT NULL DEFAULT '800',
  `enable_typewriter` tinyint(1) NOT NULL DEFAULT 1,
  `typewriter_texts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`typewriter_texts`)),
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hero_settings`
--

INSERT INTO `hero_settings` (`id`, `title`, `subtitle`, `primary_button_text`, `primary_button_link`, `secondary_button_text`, `secondary_button_link`, `show_primary_button`, `show_secondary_button`, `background_type`, `background_media_id`, `background_image_url`, `background_video_url`, `background_overlay_color`, `background_overlay_opacity`, `title_font_size`, `title_color`, `title_alignment`, `subtitle_font_size`, `subtitle_color`, `subtitle_alignment`, `hero_height`, `content_max_width`, `enable_typewriter`, `typewriter_texts`, `updated_by`, `updated_at`) VALUES
('default', '[{\"text\":\"Where Exploration Meets\\nInspiration\",\"twoLines\":true},{\"text\":\"Journey Within,\\nExplore Without\",\"twoLines\":true},{\"text\":\"Where Journeys Become\\nTransformations\",\"twoLines\":true},{\"text\":\"Where Adventure Meets\\nTransformation\",\"twoLines\":true},{\"text\":\"Where Journey Meets\\nDiscovery\",\"twoLines\":true}]', 'Inspiring Youth Through Purpose & Community', 'Start Your Journey', '/discover', 'Explore Clubs', '/clubs', 1, 1, 'image', NULL, NULL, NULL, 'rgba(26, 54, 93, 0.7)', 70, '65px', '#ffffff', 'center', '20px', '#ffffff', 'center', '600', '800', 1, '[]', '9b00000e-dd3d-46c9-a02f-8328b6da1f2f', '2026-05-23 09:35:20');

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

--
-- Dumping data for table `membership_applications`
--

INSERT INTO `membership_applications` (`id`, `user_id`, `applicant_name`, `email`, `phone`, `motivation`, `interests`, `preferred_club`, `status`, `reviewed_by`, `reviewed_at`, `review_notes`, `created_at`, `updated_at`) VALUES
(4, 'guest', 'fikri rer', 'elfakirfikri@gmail.com', '+212696126701', 'By submitting, you agree to our community guidelines, privacy policy, and terms of service. You consent to receive updates about events and activities.', '[\"Mountain Trekking\"]', '3', 'pending', NULL, NULL, NULL, '2026-05-11 08:54:45', '2026-05-11 08:54:45'),
(5, 'guest', 'FIKRI EL FAKIR', 'brandisly.reksin@gmail.com', '+212696126701', '[Volunteer Opportunity: enfj]\n\nllmkm', '[\"volunteering\"]', NULL, 'pending', NULL, NULL, NULL, '2026-05-20 16:17:39', '2026-05-20 16:17:39'),
(6, 'guest', 'FACULTY OF SCIENCES AND TECHNOLOGY', 'blazegame97@gmail.com', '+212696126701', '[Volunteer Opportunity: enfj]', '[\"volunteering\"]', NULL, 'pending', NULL, NULL, NULL, '2026-05-20 16:18:33', '2026-05-20 16:18:33');

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
(21, '2026_05_09_100000_fix_booking_tickets_id_to_uuid', 7),
(22, '2026_05_10_100000_add_demo_mode_to_payment_settings', 8),
(23, '2026_05_12_000001_create_cities_table', 9),
(24, '2026_05_12_000002_create_discover_page_settings_table', 10),
(25, '2026_05_11_000001_create_gallery_items_table', 11),
(26, '2026_05_12_000003_add_panorama_to_gallery_items', 12),
(27, '2026_05_13_000001_create_page_hero_settings_table', 13),
(28, '2026_05_13_000002_add_hero_video_to_cities', 14),
(29, '2026_05_13_000003_add_hero_overlay_to_cities', 15),
(30, '2026_05_20_100001_create_contact_submissions_table', 15),
(31, '2026_05_20_200001_create_talents_and_projects_tables', 16),
(32, '2026_05_20_200002_add_contact_fields_to_experts', 17),
(33, '2026_05_22_000001_create_event_translations_table', 18),
(34, '2026_05_22_175350_update_hero_settings_add_json_title', 19),
(35, '2026_05_22_180000_create_translations_table', 20),
(36, '2026_05_23_000001_create_translations_table', 21),
(37, '2026_05_23_100000_focus_section_settings_and_image_url', 22);

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
-- Table structure for table `page_hero_settings`
--

CREATE TABLE `page_hero_settings` (
  `page_key` varchar(50) NOT NULL,
  `background_type` varchar(20) NOT NULL DEFAULT 'image',
  `background_image_url` text DEFAULT NULL,
  `background_video_url` text DEFAULT NULL,
  `overlay_opacity` tinyint(3) UNSIGNED NOT NULL DEFAULT 50,
  `title` varchar(500) DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

--
-- Dumping data for table `partner_settings`
--

INSERT INTO `partner_settings` (`id`, `is_active`, `title`, `subtitle`, `background_color`, `updated_by`, `updated_at`) VALUES
('default', 1, 'Our Partners & Supporters', 'Associates & Clients', NULL, NULL, '2026-05-20 16:05:59');

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
  `demo_mode` tinyint(1) NOT NULL DEFAULT 0,
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

INSERT INTO `payment_settings` (`id`, `cmi_enabled`, `cash_enabled`, `cmi_merchant_id`, `cmi_store_key`, `cmi_gateway_url`, `cmi_currency`, `cmi_mode`, `demo_mode`, `cmi_ok_url`, `cmi_fail_url`, `cmi_callback_url`, `stripe_enabled`, `stripe_publishable_key`, `stripe_secret_key`, `stripe_mode`, `updated_by`, `created_at`, `updated_at`) VALUES
('default', 1, 1, NULL, NULL, 'https://testpayment.cmi.co.ma/fim/est3Dgate', '504', 'test', 1, NULL, NULL, 'https://api.thejourney-ma.org/api/payments/cmi/callback', 0, NULL, NULL, 'test', '9b00000e-dd3d-46c9-a02f-8328b6da1f2f', '2026-05-08 17:23:23', '2026-05-10 14:31:15');

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
('default', 1, 'A word from the president', 'Abderrahim AZARKANn', 'president', 'Welcome to The Journey Association.\nWe are committed to inspiring growth, connection, and positive change within our community. Together, we continue building a journey filled with purpose, support, and opportunity for everyone.\n\nThank you for being part of our mission.', '', NULL, NULL, NULL, '#112250', 'linear-gradient(180deg, #112250 0%, #1a3366 100%)', 'Poppins', '48px', '#ffffff', 'left', 'Poppins', '28px', '#ffffff', 'Poppins', '18px', '#D8C18D', 'Poppins', '16px', '#ffffff', '#D8C18D', '18px', 'left', 'center', '42%', '80px 0', '48px', '9b00000e-dd3d-46c9-a02f-8328b6da1f2f', '2026-05-23 14:17:49');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `status` enum('active','ongoing','planning','completed') NOT NULL DEFAULT 'planning',
  `progress` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `participants_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `impact_people` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `impact_co2` varchar(255) DEFAULT NULL,
  `impact_sites` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
('02Tg4iuDcCPDeJwp7gRXjNqg1BCxi3myamhbFGu5', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFlvcGVraVhrTkVyR21MOFhSWEdhQ2JJSkZQRDVIczZYc2JNTnRwWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545818),
('04XDXr3VrI9QAGZSBmGW1jpWJCeEfTY51SrPBwuv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUlZFWThsZ2V2cVFYNVBYTmk3S05CWndjZVhpVlRsWVprVjlDSHc2MCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546958),
('0klHuUGvrIkOa4rJ0LmbUGy7qhliZlt6Oy5XjtJi', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY1FaT3ZOY0s4cXkySVNQa0VLOVJYQWlHUkc3VE8zbDdLR0RseEN5UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hY3Rpdml0eSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545600),
('0KYOzLAbP1GMMXof2CMIXBIlHdeJveL8ETOSLVwu', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoid2IxUmI0NTZXRG81anByV2JEOG50Q2luWGlGaXJPbFdGS3RoNWFLUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546697),
('0yQmuqR29CAGKvDxy7Ubc5z8AVdQztjyudqKcCjO', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicDhBcXhZZk1yVjVjS1hVVTJ2YklscmpRdUdMWWpOSmxCcHhuUVY3biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545580),
('1nsSBxM1b0gdFiQuq5tCEKPcA9tpLs6TEsoPoCl9', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiazJBdDVaOVA4RW9ibEFLUldMSTdDc2RWVjAwaE9BWkpoRkFIRDJKeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546937),
('1vJN2cjyaJwNAlBPXbitPN6RRCdXv0HdlTULC019', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiakVDNDZRZE85Y3hpcFcyWTVzU0Q1MFE2N2Z3SElXTjM5ZjFNejJFeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547143),
('2EzYFy4QQKIk5xPzw2A8WWJf3V72yi2Z5PR9jDMj', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSUxLdmQ0MUlMZk82TldGZEhZN1B6V3B3TExEWmYydHJrZVJJdTRKVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545887),
('2gC9rGlnvGbGBLzqzpV3KNIPYmDsS2WEWByQ0Nvw', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUHV0Vjg5SW1lQ0IwSjJzNTNoQnpVa0ozRUlOdHBETnBkSXRqdUlHTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545589),
('2PxENH8a5fk1QaqaQK9yUIdVwU68MX0K37rQkuZE', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidUNlUm1jbTFtd1hMcU90WEhQNlZLamZmUXNuZHd2RkxJQUxvMEI5RyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547112),
('2Pzxe6w9i2QQSPjKpkE76y4pN0I8l72oA6S4mRrt', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSjdsSVZISEJvUUNmSEN4VFJJY3gzQTdaYXJvS1NoN3U1MElPbDRBMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545872),
('2qnDS17xngHUKK1yH0E3yCvkVyAPQbNXQANPu1CO', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYjhtQzRMMFNqNHR2SUh6dTBlakJyYnBtMXlBS1JkcjNqcnVLcXR3UiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547002),
('2t7XlwoifScQEYE2BmxDv6EFR83KW8iOUUW26vgW', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3hYb2VrRlRJcmVtSG1obERhdUl1a1NGRkd1M3pmTmhnWDJqNEg1YiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546345),
('2U44Ns4Pz352gyakplvcjA7zvTZ2fE5fxrhAz7QC', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNEhySjl3bW9MamxFampZa3U2VUVuZzJJcm9mN0JQeUUyaDA0d1BxVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545580),
('31ZjgqwRtUI0HDXgEuVLpb5mcq4SON2qUZcB2VnX', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHFYa2dhR2xVYkJBcWZTTGcwUDQxVGtRb0pES3Z4Nmt6bjdiSTdRMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546577),
('3NiCx0FpDwD8fBzepdyx84mkd6iidDYics09U8pc', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY1NlQjlkVlRldGJvbEdLY1NsemJGbnROSkkyMnY0Vnh2VHIzSkE5ZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545542),
('3qHNJXlPc0N82DgSfsCBK2G3IgyoixSmULW3PKRa', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMzBhckMzREl1TGVXVk42N2pvM2F4dlQ4ekFKWURDcjQ4OEdqckNiTyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546993),
('3qYGfsT8aBBUsUIAkFM2deFCQ7V7hKjZxXifi4UU', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidXRxWjdRTlo5elhoNEJYSmdsTXZ6NkM3c2tmcjQ1NXdJeHJRQnA5cSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545888),
('3yVnyukzmdZjkcGgmNz65YhQcGf6YWadh910EUwn', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiblJ6cWxxSFRvVnFITHdmVVpBUjJPSjNZZ2YzUFh5UXVVcGQ1M3FLcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545580),
('3ZBRR9CoQGJEm7TJMEhAyUxRZl754bxQ4u1fAFzT', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMGY5ZGlvb2ZXRmRjMkFuVWlBS2lUUHR6dWFBZHBuWVVJVkk3N3U4eSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546466),
('42V58qLWNDbzl3wLvt3XkVfltR0agKv9cB3CJnHX', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMnpzV2ZkT1NUQzZUVXJ1MTFseDR0T0tSSFhrSjZhaEo2cEtWWE83dyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779541272),
('460ZYQQcCpooUnOWfDS1dAbk1BaTXHDZ9KqvfHO9', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2YwNnVpVjhBMkNPZ0NwaUk2SWxRbkcyU1NRM3VQU3hxOUR2TXJFbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547024),
('47wrSgGOECMhkcBNxaVo1kf7eNhifCmc8hdSvZ6U', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNW1aYmsyZTdrY2Y0WUttYWk4cVlKb1h0OHpaNzFnUWprdGJvYjhhZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546463),
('4cHoup80y3OmpRf451X7j6R2qaFkZ7IlRoDVuw7g', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3FFTVZqRjF5WTZSbkZ2YXdwdTdYUDZBRklFOWdwQXBlWVlZNFNkeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546937),
('4HbfgCsm8xebKcTbO9RiIdhl7nop0Q9ZMX2q4tsI', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUVNQR3AyUURYRDZtOEFJUkU4Zk9jWVpGd0ZCNmVFWWpWU0tKZks1VCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546951),
('4pYsMZ5k7UCEC8LfZUOCOwzVOAnDLR7ZpUDOlNDv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUjJ0bnBOWWZzQWMyV1V6WFRySkdmOW5abUNwRGRUTEdTdTM1VVR5TyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545682),
('54SwfXGt5sOxfhzt0MPMPl7ivOido4dXAyRBtDUn', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVTJxV1lJVm9QZ21FWXNvRFpjWmFHZEo3cHlCUXo0dXZ1U0YyaFZUZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547140),
('552gZL2PqHNIVYHvOiqVXsriGwxCmK9Iv3DzPwYN', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmpWalJNbTF5ZFJXYXRPMjVNVGhTdWphMWVkelFPNFdZZWpyQ0dGSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545590),
('55TIeBAdrvkzqg6aejSHRAN0oSdRv7teNwfl2KQG', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVnJHQ0VzdmNtQmRjYzFxMTlybmdOd2twU1Q4SDdyY2JJQURQNWY4byI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547024),
('5AevoNaSy75yUt8LzGh0UU8hvZbOOk5Ua3VVI9y8', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTnpoMzZMWU1GSm1xOE1KS3N1anlidHJkbVFxbk9IajJFbHNZTGtkSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545580),
('5QzKMME6OGb2LZVihwIfQHATOmq21xaIcYXX12TW', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkpDRnlrVFhaSXA0VThCYnJmODdWWWVta01IdnpUU0I3TEJSUVprWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547024),
('5VtWNepCRiKcNBI1DLQb0KroPb2Sc7c4LxKQjZsX', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUkxNOGNjdm9XbVVJdThkaG54SkYyRWlpRGkxaWY3QjJQS1k2cVp6eCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545818),
('63YuuHsFrYIHbmRKfInzDeAw9dWUZr4IexmqlLQ7', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieEk3MVY2alRTYjVRb2VLdUdpS3R0ZUplU1RvUWFtcFVhTkNhWTNseSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546455),
('6BQ83rHzF4D1EPpoXIp02RGuQRaBEhARoZVIS2ZC', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUzF1cjhTb1pMcUFmbmM4Wjg3QlBaVWZZQ2dzOWpiVkZ2Nzk3akNVQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545600),
('6IdTF47pbVgqCuCPbAayKjPNI1MKvT5SObilCPfR', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2dSdGZoQWo2WmRxZTVxMW9pRWJyT0JHZUJXejBEQ2pZRlJtSUtnVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546666),
('6JSdHmrjYNbLsrzNJZX8JpTv7YWt0ad95Kgfw9j0', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNzNMMFd1dEoxWkJrTjVMb2pDMm11NUZXeEpOV3d2cTFad1QzTW5OQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546577),
('6qqpIGpzzVQfzRpf3ZpUNdhxEXgM8WhjJ0d1XIpq', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSnp2aVp0UkxJMjZQaDNSdWF4SU5CSW1uVnJSekFKN1lYTWZzTUZ5SSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545807),
('6Z1iyOHcF593RQPDKvOtkLP8on558nP664E5L0yQ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUnVjMGxqdFpBSFJySFVPSkZQWHh5TXJCVlBUbVhkWHdUcnZyYU10aiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546345),
('71e6gTomB05pdcSMwkH2wnlYOCguRi3qanxFEDXZ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid1dvRHFxSUszSVpXdWgwOGl4d1B0UmpZVUtibENSQ284TnhZZUJzdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545782),
('75RmWtcCXvEWDHqKWzpMMUTJPuPy1ChsotOL7nwv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1VWQ1dQV0RJeTY2SkF2RHB2UWxGVVZKOGFtRlYyT2gydEt3aTBSayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547024),
('7fSEtUsiAZNHKxOi3ADnvHXcmYFLTUj7SYWdZAkZ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT042VXZJTVdsWGl3dTc4eGk4aXZhUG9ZRWdEdWpFNFplU3diN3lzbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546546),
('7QwJZjPhZW0KCUbzsl9mnM29MfANBAceSpcw0gbJ', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODhydG9Vek1CV2tZRHlLbmluSFBVU1o0bnVlbUQ1NFM4eGVydGpPaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545716),
('7Rs09VdLAWrdZQvfdMRltzYXkOyRzWSv1aUhCtjc', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWc1Y05HUHp0OUFPRGNOUkVUMnh3OEl5OUVHMTR4UVhCU25lblVaQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547143),
('86Z4hD04XSGEr3eztzkDUAvnMeEww5aIyOWlQeHF', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoienF1Q1VNNkpadUg5ODNPcHE5UWtwZnJYMW5ZVERxVE9BUGc4UVZBRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547143),
('8bNwLnk2nkWJpzmjubkyN7PHb7f6lqbioVbBQmb7', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUGdBTUtPTm9RVFlqTU8yRG9kRlA2UjhzaG9aTDVSV0UzMVZLZTB5TCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545807),
('8IymIbEx8Fp8Tgu7b5Lt8M4WeZ8RS3DqL912cfAp', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidHBrR0tKUnpkVVlQdzBjOHM1cnBVa3I5QUFyNEpERU5kdWMxRHBaSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545716),
('9B5oY1yjgb63h9YGqZBjdf7dgcHeqaBK7TdDsjgw', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidHJRNU9nSkdyMTVPTUNtTnhoeHVUNENFcDBjdXdWU0RmNmRYQ2Q5ayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWVuIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545542),
('9IoMHbn3Fe1aMunLulBAzUImh5JzhsZxasER2RbU', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSTJzRkp5MFdQeTJOaHlnZHhUQWw4aG1PTktnYXQ1dXNaOUFaaXVZeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545589),
('9JNR3twW8XwLPAzhJBY4eKk6m4YE3mo6VMCh0PIn', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRUlHUjdQTXNWQklFdWlnTU44a3lCVmVnbHpDVzU0ZEJxZXk0cDMycyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546466),
('9LynhvXYIFE7WbK13YQ781pmXO9y6YUlWEZTf8KT', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZlZKVUVVQTNiQll4M2g1OVpHeFZPTFd5WGpmblIwNXVqa2U4QWJGRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546546),
('9nLmuAExSBixLgceUZf3EDJpAaGsx1ltcC3GPn7Q', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUzRYSlh2N2piZDJzdzNNMms0ZHdHMng4UlRldG9TOVh1M2s4ejJNcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547024),
('A3ypuEg3w0JXiPh6JMIPxUEYfyLlFnhrIkHICu7y', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUNXWm9HWkh2dVhjRlVxUXlWZUNld0JaUFg2aHNzUkNRU3JXUjF4bCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545580),
('AbCs8SFV7IeeYhoZoJTuKTIyS3y6TB1pWy1CGuQK', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibWZVM2NsNnU2MnVBRWtiWktRbUE1SUQ1WVNuOE5ET3NiVGZ1YjZVTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547143),
('abOuglNyV6sIYdGpwz5W3D4eePcQQmgKzstDduZe', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZDFZV0NMeEhOSm96REZYMHo5c1ZralYzRGMydTk4eWJjSGlQVkZuRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545855),
('AccqJzxhkz45PM8uezhOosZDGSNSoLljbWNC0Qgb', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQk81c0MzYlhNNXRkbnZGbzZwSXZFM0xUb1F3MEZ6VnR1RnhCQklmciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545614),
('aEcsgAK2sEx4ryNZqAwT5p54JPV1cTR12sP6PVJW', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODU1OXJPalp2TnA1ZGNFclZOUFpBQkpJMVdLWTg4Mm9FUmVnRTF0TyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545818),
('aeNNBqWqCWjbBQbhYv0hFZDymZTNHzy0wn0m06tm', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMmNEazlGMTBDZ3ljb2NSN05FMW5oenhrV3d2VzdtdGs4M09HZ0R1diI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545854),
('agBaAFTe9XQXLpPeWHKpBVEJf6Mrt9kbgKKEajl7', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibGx4N2lQWnJwSnRHNDRQQ01YNE5aUHZzY3hrY1VkR0g1cXNFUm1LUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545542),
('ahva3TA4DCYk2oJ4n6O5QfYp7CH9yVp8DqQKMt4O', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV09BSnc0Z24xRDlhMFdwam11aFdMTHhIeG5nOWdoV2dDd0dQU3g0WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546463),
('aiH8k9P0JfQkBHZnlC1lfAnzrTt4HnzLOZQ6ws7Z', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOVE5T3kycmRVWWZnMVhmRTNVdWg0a1hHbXYzVlQ3VXppa21ZeWJ1ayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545716),
('aoecfjqZfk03fvKJtqruf7huStUCNun391mRIuia', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibXBNWVBPZ1BDWVBEcUpwRTNJeGhVckFUSUtydmdTNU5DZGFEREVRTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545580),
('aTsxDbbdvClWF5hSz2yJO5nW7uuN8QT5mSNuSviq', NULL, '10.58.108.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicldEMzlSeEVKY2N5blRpZmZqYThBWUtvbW1kZzRCY1ptN3d1TzQ0YiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTM6Imh0dHBzOi8vZTIxNDU3YTMtMTkzMi00NWI3LTkyZDctYzgxNzc0NDQwNTVhLTAwLTJ5cnRsM3A4MXYxeGsuamFuZXdheS5yZXBsaXQuZGV2L2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545742),
('aVFeZDLkuCvpON2KZ1dfKkNudfwjCS6MgMKDXYAd', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUm4xenVJZ2FpbkFTazE5VEY4aVpvOWx1UFc1RnhXWVlYeDE2V3VMeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545818),
('be3RZWbc0VTRerOAAsFdfnOrJCVprUlS1FUmxiGE', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ1RvTGU5S3ZIZVNZVXVGQUF3dFBGdzRnQ2lqbjk3aUVzMkxDcGRuTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546467),
('bG9h7yzEvqDPmdFCdud3VfPgHpGV40J0Zj4X70uN', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidGw2aXE0T3hsd2czTktEOUluRk5zTXp2MUNRWDRWZzlxVFR1aFJKciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547215),
('BJfBQHjpA8PfLRDwI0p3a6KX3sOMpxlFpcvlLeox', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSjZwQ0N2dUlKU2ZnelFwdjJleTY0SzBJbzh0MGxGNE9MR2EzZDdrdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545716),
('BJZsTp0pLA25adbIfuelkJCuJcSp2sYIzl30VHQF', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDQ1cnp2RmwzejJCOXZFWFJGTm83V3FjRHNKelRjUk9kVWV2bWlwciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545682),
('boNyX8SiNmSunmSvQUR2ZXqzOyDiLjHvxCMqBNs8', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzZ0YU1MNnVBOUFqdGpJaHVabjczUHVQZUN2Q2Rsd21zb3dRSkdqNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546998),
('bugFkIAN0LDZjVP5kssXxKghD2covMgNNvcLLxDt', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS0xublpRdlphb1JLTE9ScVlIaHVySklNakVrOExZWHQ1RDdJWkJIVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546466),
('Bxje2CnWk258qnGBhirbMkg2BOfgssVMzPT6ezpA', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieTVlMVJnZm1sRENiZExwQVJ6VlBkeFBLTHZXMFdRODgzYXBoMm9uNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545840),
('cARLjDUAFxYFgYknmYrwNNrTQ4RqGOzlUWrTqL6C', NULL, '10.58.1.55', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTGNlblVrcVlSTEFNVkRwRXhVSUdYQ29WMFRINEl3Z3hZOXB0eUxZNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTQ6Imh0dHBzOi8vZTIxNDU3YTMtMTkzMi00NWI3LTkyZDctYzgxNzc0NDQwNTVhLTAwLTJ5cnRsM3A4MXYxeGsuamFuZXdheS5yZXBsaXQuZGV2L2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545742),
('CEDCa5bvVg1jIsGkusDaK28FVdjjke48ANcWn6fS', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN3hQaUlJSDQxN3p6eHA0Nk9IdXcxakFPcmpNMmkyMGRmZ0hJQU0yeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546546),
('CEk7ZL3EmzDtjTysBn6kWFnQpc40t3H0iUAtGGTB', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiejdhNXBYRjhLVTVGWEd4WTNQcDRrNzl1QU5ITXhrN2NQcVRSSzd2WCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545580),
('CFG48h2UjtEqt2kdgfsYExoffQvKKV6b9orPB28F', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaTNURXFpZmdnVG10RHVOamduemxEc1h3QnlYakJrall3VXFGdDd1VSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546157),
('cmYkfPXCnctplS18P28ITxFSS4g1BBuPDuXoZ2yN', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT25oOTNNTktwajltb1VYbXN1eVVZbEpSbFE3dW5qU1VxQW1ObFFueCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545873),
('COmBWEQkqtyWjIHGDYoXtH69eXiVgrLegSkR7jFs', NULL, '10.58.108.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYnE2OHN3SnUzM003S0d2cGgzQ2FLM1FocHRvZlRXZE5aaUlFdkRleiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTAyOiJodHRwczovL2UyMTQ1N2EzLTE5MzItNDViNy05MmQ3LWM4MTc3NDQ0MDU1YS0wMC0yeXJ0bDNwODF2MXhrLmphbmV3YXkucmVwbGl0LmRldi9hcGkvY21zL2ZvY3VzLXNlY3Rpb24iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545743),
('CWpvoi5i6NfmhJKBgeir2WgfVOCSf26xIP1rby8R', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUUwOXc1anZvbk1uUGhVNndURWdDeFY3RWRIZEVQdTYyd1NYU0lzVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545804),
('d0S9J8M66dzZmlqkWs6q6TF7bjNvC069JpQKuWDF', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOERKYnpJSWE4dHZUODB2bE5vZ3hsdlJKY1poUUk3bkdKNGdvNXV6WCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545614),
('d1Qn1FLbAOmVEOA5Jjdi2ibevwyYghMX27PjDzjO', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWlJma2c1eWhVbDExdU9ETjV1d1VuM2Z3R2dyQjZNYXFjYnVqMEZ5aSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547002),
('dAuSZ7minpcF645z4Gk6gkOF4DqTW6G56YXbzbiX', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieG80S0EySExEUHhMejlnODRqdzF3Q0NOR2RBY0tNakJXY2pSaU14RSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545807),
('ddNB4B6mADkQ7WtJnpHYNsxlGXldaLrewevxgQnt', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRkRSUEtXTGhiNmtVTm1WMzY2RE80eElmU3ZkaDA0a1JYQWNkTGJqZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545682),
('dEyFRvYkNAcAzBOuR4msP16Zv1pLy4HnyfJpTaQl', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNkZabnpUb2pVSjY5QmRTSlFvNFUwRWFXV1VJbU1FYzhtSXBwOFdrZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545553),
('dLMD8AEOZRcZXYsmaHScURCcaKz160b8P6r71duc', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3V6Y1h1cmRmbFdWcUp3V2s2b2l1YTZWbVZXRk5XSVdIRWM2R21PNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546455),
('dmWzxLZSRvAGEjzu6z7mqg6pLfGg8XY3SRQy8Qml', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMkpMRVkyY3BTNWUyVDc2V1p2V2dYbWhaUms0VWFVdldDdlBTQ0FPZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546681),
('dOXbIsZqg6bIgErQes6XI3ROkkKquKQujPzPsVTQ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiamJYOXRwN2hmVlViczAyeVdLSEV4bm82amJKZ2tRcUR5Q3k3QlEzUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545855),
('dPFIACGGfhZv2O6VNzJwbQRc7MFzzhp0rs5Uc2sn', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoia3FmblRTaFFqaHZ3SXhiaDdZY0lpZDBwV0xqbG84Qjl5bVhhOEczOCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545869),
('dXbpgYkq7l8orGlEQt8HUxg9VSuHSizx13vlIpUY', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNnRRdVBqbk1sUmJ5b2lPa0lERjYwTlJCcVFXRHpYWkZKbVA0OWtFSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545807),
('DZluvbyPZwDtcVvpDrNYkYLjwCisQJ1vdOyZkuPd', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDkzVDVOQkFDRUc5R0JqaVg1UnpIMDRoRWJZaXZ6R3NEUEtabnVDVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546345),
('E2AFLyRKhYjPaeK0fHgyp43oPAgbeSiaHcgeMnhY', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidzgyMlRqM2c4WjViMHVXYXVDaTZ5QllaVDlhT3o0dzdwMk85elNKMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545589),
('e7cK8FHusnwwUKc7Kis5LvtSdeM0zG066KImDnqO', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT1NWNjZ3Y2k3ZWR6dzFBSFBxZkhtMkVXQ3AwOW13TFRYeFN2eWpsYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545580),
('E7P2ck9Pixnw89kgVMdD7casGB70vpBXkkVLyHlV', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNk9jTFM5OW5Yd3U4Z2EzZFAyVHV6SlpvSUUwdHRKZk1hWFhDWmRkZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545818),
('EAYcEkm9gvZ208YmDodYKxqwu71HPe3yKvU3qPIH', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZXVmNTVoME01YUt2MjVzaUJzUjVNN2VGQUFBaWM4dVF3cVA1SExnVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545589),
('EEc2fR3lXf9bveusZmwxGysnyLnqJwjPr4meSkC9', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia1hoUERIR1dEU0V2bDBjbUlIdVhEYUxLcHdJc3lQaTdFRlR1WlU4TCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545614),
('eIXA9inYJr1s9oLslO1IJXjkUe8zyLJRuwKCP1ZT', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidTNlVXVKbjZuVlFIdmJXZ0tDNWswVElxTllHU3RMVVJ6bnhuU3AyRSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547178),
('emltPHHtQJaCSg5tgmnjvhga7KidXeilMXbf8sqi', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY1NFd3M5empzbVZ5TzlQM0dybzNLVWxlSHd4NUJYTTlSN2Ewdzc3ayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545589),
('Ep4B6BKt2SC8nipMv1JZFYFi0d0jptIypWo0TkFh', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSklLUkxabnlXOUtuTURIRDRSZXFCdmJwN2J2TDdxOGhjb3RpVDREYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547143),
('EYgpdOR4fc2PGjhVlBItwt9STWiEs0yEwvcF1Dl0', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUpOc3hJeU1SYXRhcld4Z05pQ0RLQW4yaVVFYWlUZDF1UHA3cUZQZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545807),
('ezDKVQvwEOP5ZhQQhAosqneIUx4J9xHY3yxPpqBW', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUVN3MG5kdERmQU9GTlJuOUFhSUlIT09zVHZXdlR2a2tpdlg4N2FTZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546345),
('f8UgCsUP7VJUeK8mbh81GnYXxFn3DEYFMlRTzqO7', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTlVXckNqdkViaXpJRXRaY3dhRUp0MkZGd0JmMlpENkFiRFpkdU41TyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545910),
('fDTM74ZETBH0EqDtF5OPc1AYsa9e1sUAiWD6zCwo', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZkNBVXM4aVBsRkNwTG05S21KdzN2eEJCSGhLZVdSeDg3ek9GNU96MyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546665),
('fDuVf2SNfbNLZ5wpsU9QxxxlnN2ZjcJTXvGl4Kyv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieDlWSXRyRlNMbFFpSmJqUmlGN3NnMzhCV21KWGM3M1NXZ0hvQ0d2dCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545580);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('FfENEOjQ8TYNZqsvAMIMeTGvDnGuW7DzhSjQRuZW', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRGVVOWhPVTAxbXpreXhEcGI0cnJ6NEdidkNJd2pIVlZ2WDM3cFlHcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547024),
('FFkOgNXBwgFR3ESgRkvWlVpXxNVJPiPtKFqg2VkU', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiamNMNWNKaTNBejVWc1g4MURxMDcybkNDUjQ1T3REb2ZGdXF3aXdUTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545888),
('fGcW4qHpeMLbnRgKSspzV7If6shCdvQ89FEwNShi', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVjRzNXNlMW1ONGJZenYzTDQ2WjFyMzVvTUhXU0R1RDlQNWRJWVRmQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546345),
('FghyLoVl5OIiTeFkNf5d8jX5WWUdQNqScPeDhnFr', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODhmR2RQeVFCczIyaDF2M2djM1k5eHlRUldGRXhVU3h0cmIyVjI5QiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545580),
('fkDMQIwxx26tYlOptma5x3yaqhcqctnircmjeMY3', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMWRUMGhmV3dUVEtNN2JlUkViU0MyelBOQUtGQUNZTjJaUTgyR3F6OSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545887),
('Fn6Jxz23B9td6AotVGqypzxcrpLpnVRu4P8DG7Ea', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQlZ5cm5yWENpeWVBQlN3N2N3eFNVWmU3ZGpubE1LbjdYRk5EaGNpbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546289),
('FO8oEsMIxDBrHqLke2jmJp9XChmF5Q4Am5yCXtEs', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY29xcXgxZnloeHJyR1d6ajdCQnNwb0RhUkh6aXFOZGFCT0NFRzgwaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546686),
('frU3yLZIoA7veoXA7eSIBAihJbZdjJecV3UgYZOf', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWHRxTjRDemN0NGhva0FaaEhnR3hSeXhsTUlJbEJZRHFwMWxUSGRmaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545614),
('fTahocaWgLJHgWRc6JQl2iNMpplYYRNBoK8OG3y6', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNmNCRmVTd1JYWjViRkJTaVpobDUyWDREUmFsdnhwbXAxV29TNm5JMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545845),
('G4n5UyifX8oax7MvHKbiyXSrEywFboIeaHanpGH4', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0ZXYVBmTFhCM0FYYmY3U29pV2VRQW5IQmV5a0ZtQWRhdUNhVjdodCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546937),
('GbnmXlvWcFc7Llq0nbRjHlDpORVXKmDB9zejHeJG', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMW5pa3VPMzJpZ25CcWN3MEp2bjhENjBMN3N1MU9yQlc1M0V1QlFCaSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546798),
('gqSMESnd1iUolhP0ruVFC5TDHbfNTf40Dfi4GiAt', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3RKaXdTNWsxMTVFazNvVUgzd0o0SGFrVUdGTE40bFpidWY2SXdOUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545555),
('Gu3XVjfN6LRhkivG2PkNA4655N1qfHarAamU6Zqk', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidEV1SVBWdEVnd1RhR2JJVktyWm1EMmNiV09KZzZYTkgySXpCallIOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545552),
('H0biUPPz6kiZ4olrvHa4qtK4DgmzJFXPgQKx2EFw', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSUZrR3lQcXA3NzZOdUZuR3l0cktWTHFvSnlTckJBclBuQVEwNGRPZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545541),
('H18n7NRg7H4ADw3ioWcD6spt5LaVMiftr1uPNRDC', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV0xIaVJBa1lNWXY4cVlWNFcwaWpiYmhGQ3NnZVVYQUtGUHRVaFhVWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545717),
('HFbS4Jb6ad8wYlEkKQ5m0k56Fb9VkWiyJuPyZMis', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN01uQkRYYXdFRVNZeXVQNUVMcG1uYkFhanVrTXhRMWdCRzhacU9ncyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545888),
('hIlkFIQz5qKXuwAxakE6IEJAAEx7BbdffoZ0eID4', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMENWWWdpNUpQQ21yeFQ4MTBJM29KN1J0NDNvNGxGZW5QT2hzNWNhcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547001),
('Hn8v8cJKCFdOTUixfaWU5GeywpLpUuvZn43vTdov', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidU1EOE1tTXdIYVNSS2hTOUl0aHBidXF3ZzhKTFBrbkVmN2k5b2xLYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545580),
('hO5uiU3rrbF00tW0co472oM6LcucZ8PwSFc7QQea', NULL, '10.58.1.55', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOVNBVzZDdExiREVWTFdFZG9TNzVXdlN4NTJueHl1bUwycUtyUk8wViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTA6Imh0dHBzOi8vZTIxNDU3YTMtMTkzMi00NWI3LTkyZDctYzgxNzc0NDQwNTVhLTAwLTJ5cnRsM3A4MXYxeGsuamFuZXdheS5yZXBsaXQuZGV2L2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547230),
('hPdjMPAfh9l2COsFYZEJsmX1gYgzJk96KZfibnjv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWVNMeXcyQjlJeE53ZG5VcG43T1RKNGJoV3FIWU82TDVGbTM5VVVaeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546686),
('hs5855d95V2kWTVMII08C9Bol4FYu7hhn01qdc4U', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZHVNb2RGeUhZNFFJQXVlWjlhSjloSEtOYUFMcEl2ZE1Hb1VNem9TMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546608),
('huuhhu7JLOmpsQNoTsIfIAQm2ticHcXCG0HbgUJX', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidm85SUVrc3ZkN1l3WHVwOTFReUhCd3pRNnpXbGVIZTJyTHBvenRXZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545888),
('HVHpnuagqw9r1XnyKmHD2nOq0d2zSF2JauXk4fHP', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmFyWDFrdWRtWUx3RWs2QWE1YjVPQ2pKR2RGV0JiUlJjY21YV0tvSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545580),
('hzh87ancE5GjpV7K8rU56gcnyBzOab2HoPafXs4W', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSTIzY1NXMUp3a0piR2NKdkFUNk8xSVYya2hFYmgzeW41ZjVyanNBMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547024),
('I0QYmGLNsneD3tVTwXSy1myBFjF0q9XSdyUbu6dk', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSk1mVnVIR3NkY1AyYjFZRzhDbXVxVmY4clVtRjQ0bUVYZGpEc1R3TCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546937),
('i8Fux4ml9qpLXjeRyEfWg4UCwWZQjIuehidB3jX0', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT2M3T2VIc0ZHNndraEJRc0NvVjFGZ1hVRXVPaWJnOGpWS3BBRGZlciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545872),
('iBv43BdZjBItBhpu1EIZW8YZxjB9SThWzESvenyN', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUkNTeWZRdG5qRGVpMzJyY3JsSGcxZ2J3YUptaHNPOXFBdlNWZ0RqVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWVuIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545614),
('idCGEeYZwvhPU2N92bvS7PvDmT82giHUkPtTFR6I', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMEhDc2tEdkxZbGhMNzlJUjB1OFM2STBRTHhTVEhrUGxzeWRKYkhtSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545580),
('idchIXETGjUCNLXzITDt7uFxcyVVF04xkBJeY680', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2JoWUpZZkh1QzhveDNYMnhsM3c5c1JvNTZRblFzdWVhV0tISDVTaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545854),
('iGEHGmByvWZmbi6IUWQNevLi2i5fdCs4eB12kmQp', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibWZ3Z3M1Y09rZXpySGV5enVrbHFHdTVMUU5HSEVpRTlDRzAzZ0E1TSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545716),
('IGr0npvt9iaGC0hvw45Yo2OrzWFcLt4R4VHkMJ8s', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTEtPTUwxTEFqWEx5c3ZkNk50UmEzVVdyMFM5U1M4bzdjQmR1eGNuWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547024),
('iHVbDwbP4HzCije3kdOZSzZpg9nTQoxxqZfGp1kT', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUEhYUWpvREdCUG1jMUI2SDRGckl5dnBSUjBJSE5JdUZmaHVES1lHNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545553),
('iIKkW5rieK7FeO2rznYMM9ahisslB9SBjOOrQ9q7', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieDZvOE1Ka3pJOGFJdk5CcXdqdjRncEpBaVFqNUo5VFVMa1dOdUdWbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547112),
('IJiST6gXed0smofSl8qVbcVe2rWB8FCOZ2xNj8y0', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYnpIaUNhT0loWFkyZXFwYndUTVZkeUZSNGRZckhyWHZ5bnNjaW1rNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545814),
('Il770BAjby6gY4S2ifb60eW7xjDG9oSCzQweLBfj', NULL, '10.58.108.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2hwcWMzMllqRUhzZnRpSWhlUlpJM2J3V1RndWRKVVdWaUZRTFhaViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTU6Imh0dHBzOi8vZTIxNDU3YTMtMTkzMi00NWI3LTkyZDctYzgxNzc0NDQwNTVhLTAwLTJ5cnRsM3A4MXYxeGsuamFuZXdheS5yZXBsaXQuZGV2L2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545742),
('ioPRv0TsNqHiSon7baROnLyqqzZSZgpIY33zhLeX', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic1pCZXZXbldjRVJFc2VMdzlQRm5WdDFpRmNpeWxLNVRSblNXaUp4USI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545888),
('ISbu7zicPBAGSKUsUwjJwCtHBKiHQ71GYA4fRDXD', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoielRvWHozeDRTUzJUd2NQajRSZFlmbjRrWE9ETDF5SjlobFlpcnpDaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546345),
('isRNMQZGNX4Bmnr88oKGNkNrLPRfKWgWQHIaQHZ4', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDNPVGJRdkZZNTJ0eGRuOExuVm1CamhSenJERnRnWEdVR3pGcFF1biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545580),
('itLjc8OznkBKXf4SiSbX6xA1DI5v4gRpXNiSTlAq', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQVhFYnd4c3JFWDRlbVZvcEZxcTl5YzM3OEgzRjZLblBhR2k0R3ZIeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545886),
('IxZvFVQLFzP5xRqnwT3svW0KBBPCOdiCco1lOjUs', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFQ2SjQ4YUNHYTBYYThhNm9sTXlwVjV2V2pPZU96a0JXYTAySFp0WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545888),
('IzERIXQVMccq0UA3Y4QASZ1Og6mHGBfJR9I1lPFa', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVjhsa3k3RzVrTmNoT3plaHp6V1pod3F0dDZtc1ZYaHJISWJ3TmxHbSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546632),
('j4My6sJPVNNL2LoE9rdKoLBO9dGzacP9ZFHWY0wm', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMkR6OWZ3WTd1Mm1uNlhySnZNZ2MzWjBmYXJxalg0anN3TUp2eUJzRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545855),
('j98juECLnGx0KCzYbFCxcnNcBckJ2r3WvhjhnfX4', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT25OMUtmOVVWdXFmYmZmSklibllIRmVsVHhTbnZEMFJKcDh2WnVuMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545818),
('J9iGt1TjBVjEbPc85rini1OT2zR4I9kW8dKK7fCE', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWWRFN3BVcjhycTFJYVlRUWdBdUN4cW1PVUlXeVl6RnhFcnFMN05aWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545717),
('jbrbxRsoXXsAFOFOov2dJEELpOBDi4Wgzzi0fRhk', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR3R2bGlmdjUwWEhMbmtjRVNtMnp2eGNCVWpERjF5YVo4eUhNRmZPZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546466),
('jCBtTN8ynyngXAqkl9XcaBF4tYbVVkyTmK25alqs', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZnNiYkR1Vk1ablRkOXBLTXl4MmV2T3pCVmpobXN6b3Qya2pFZjJocyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545542),
('jCJD7cIGdTXS2DJdUVNfqKa8uJBvbR6nbzsqPGrY', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDdQMVRBNDRjNWtja2hVeG9vRlNJNUtLc09DS0VocThpN2tVMUR5ViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546466),
('JGBHk87HjX9hmlIQ8mNllEmI2yx0tqqF2ydbIieQ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWt5eTJCRHp1cDl2aVp6UVloT1dJbXhFeFRwdWlSZm9QdTZOQzBDRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547002),
('jGHBHo1ArTlfr2CUc7iGe4sEHL0HTC7Kic0SXA5n', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTTdVS0ZMbGE5NUs0YkZvakw5VWxMTWFFeWpxWHVMZTNEN3p0SVBteiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545887),
('jHhmQPP6NvSf8HqL2BV8cs5aEixsjxSSubwtWF58', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOFNqQmt0d0g2ZmJXWms5eDQxMGtVUEtIcHVnWkZPMFJ4VFRLaHh0SyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546937),
('Jmhr11xzP8SD4b0fngExUhZCRIvVvYPkyVhGB0tS', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS3lORm1GRjQyQ0F0Q2dDRjBhUTJvSllUa3FUMG9wV0lCRXVWUUQ2dSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546998),
('jn29MUwmeCRJuswXZdOpq7G8Vi3AhGwkkjpgLEeF', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNzRIQnJObUpiaVBzdUk5RkhmZU9EYllkQlhZeDBUQmFMV3dTckRHTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545818),
('JO1QTjwZNOVaTzn2ujQpBC6wbLdyxg5PwxshKggb', NULL, '10.58.108.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNDJRY3RFb2RzV29ZdE5lenhZZlFjQ1lzMHZqb2xqTG9RTVczWnJ6aSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTA1OiJodHRwczovL2UyMTQ1N2EzLTE5MzItNDViNy05MmQ3LWM4MTc3NDQ0MDU1YS0wMC0yeXJ0bDNwODF2MXhrLmphbmV3YXkucmVwbGl0LmRldi9hcGkvY21zL3BhcnRuZXItc2V0dGluZ3MiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545743),
('jp9fnA4IWM2ee0jUGVThA8IirMGgVuK7HREFp6vs', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVTVYUGIwWUVleVRvakdlaXR5UVhDTVp4cTB6MUVPYzJnTFJFV1BMdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547001),
('JS0pqLnsJP8t5qGil0zU5QSeMnpqe2uVnFyT3ABt', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUU2RHA1V2NNczFMeFh3T2tHbTFkaU9sOVlCeTU2YlBhQ0RpSFJKTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545873),
('JVNx9daQN7Hkbw8Mpf74Oa5uEHZbvB17FXkpBgZ0', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ29yY2tBMHhiNlBwbGpCS3U1YjA1QnVSS3ZDejFORGtXbG05cTZhQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547143),
('K03ZHosJOQDY1BykcQhHcH3nzNDSPG4Q5ED492M0', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2xSSjBPUFJ2djh2SzQwMnQ5bzJtM0tIV0VIS291VmJ1MmdwbVJOeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545854),
('k5AEcs6IAtDMHIe2f6FteQC8qzSnRfkYaPqsq1dm', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3lPUUVVeTdiUko0TnZrY3Z5cVR0S05DOEFBTHdXbDM5RTlGTkVNaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545888),
('K9hgWKxKiuEj3NGePUTU8fky3kGaVJvEflIlElkT', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibWhSWVJNaExsQnkwSUpRYjEzS1lSR1hXQUt4NXdVWEx1U1lSeUNqaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547002),
('KaLz8cYk4R3JydDeQCt7tPqtXtK6uYhStKt4fBos', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUYwS3hzelJEMmk3ZTVzcEVCaTlQRGJ6RGFzRDRZbjAwaU1FeGNxSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546462),
('KBXCgdXZyZygMywNCH0BVZeibn2VttCJQWBWvsDW', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2JiNnhlMHl2TlZ4d2xnTHptb0xGRXJacUk3dzhMTzVabk9aTU1nRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545589),
('kCKtOTjcTs4UZtVxMm6fA7QhBUBQtVJAx30vajHY', NULL, '10.58.108.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZHhGRU9UNHF6OHFhRnpTZXgzekZYU29QMWk2ZnJNNTNEbHJrMnBUZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTAwOiJodHRwczovL2UyMTQ1N2EzLTE5MzItNDViNy05MmQ3LWM4MTc3NDQ0MDU1YS0wMC0yeXJ0bDNwODF2MXhrLmphbmV3YXkucmVwbGl0LmRldi9hcGkvY21zL2ZvY3VzLWl0ZW1zIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545742),
('KireuZxoOBgw8jzyRRdV5vA8eyl9L2L6RC5iWihf', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRjhDaDFUOG5lellHTmJVdWtPZ2dnNzIyWlB4eGpxZ2dGbFlBRnd2biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545589),
('KKXj0ZvsOtMcNZtiJYVs4Nu89uTw25eQU2b16xNK', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNU1GMTM5VEVwTkdwa0R0YTVLZ296SmwxU25UeWtQcTM1SXo5OVM1TyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545552),
('kmkWZTGOAGKSMCW9pEd1C7BSqit2wazBHx4CA82m', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkplM0lYZFNZYXlFeG9ZVnpjT1E5b1UwVHhaNzBUQVUxSDgxNzJTRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545807),
('kMnJqPhbPqDmZX1Ndx32lcrOH4e0wZKDdObTKkkK', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSDBzbTBpZ3dkemdOUjhXcVBPb3RNSnBZTjRWV2JVUE4wNzlZSlhyWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546466),
('KNfORX78XzRZSkeurRSovLAYxfcCP6bDbmBIfNiR', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWTNaMDRmNUpwRUFnRXVUUGY2R2hOUVhWclN3VGZjdTdoWHhzUEdWTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546779),
('kqLPxVlAlLdIo2c1Icow89Jvm4JPOAsxP19L3I0n', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicjRiaGRNTFV0WEc1WkI0aVE5OGJBek5rSXdOTnBXQ1czV1k5WlQ1YSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546345),
('kSQ0wmFboUuz7GJXAhIm37C0oICBBy9xXr0hdnxL', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHhmMllGdXJZRUZJcVZMOEJmS05aWUFzMEt2OUhtNVYydkpOUXd2TCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545807),
('KUbzODB6uNlJusuYDlM4hug8p3M7f5hi40NNSMj1', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWUdUOHg1OXBBdWh4VVJUNmc1QTAwSUFpOENuTEttRzE0OUh1VHNPSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545872),
('KUmvbedzXKC8StBjrOPxgWKdW8ey7fDXuRe0RF4h', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMHRUTGpVU0dXYjFsMU5oUTlWZDBVUGxvWmpQVWxJY1F5VUE0OGhoNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546466),
('L5kStKHNMATrQtKBrz1O3suPIGQiHYYr9nOJ6GXv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieDJmMnBIeTdiZlJpbDRPcnZIYjI2WlBZSTRlMXBWdE9Xa082emFxNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545541),
('L7Jo0G16U2deTFMIfJtPgqhaqCH7PlMQr23Ppi3y', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVdXZzJMVk5xdTdnQ2hqR0ZTRkNsbko5M0ZlbUJlZkc3R0h0MVR0ZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546779),
('l9iCODgiNibENyXBf2UH9rgxprR84qRuWP2YEXB0', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0Ria1Q0MFlWR0Z5RTJvcWgyUVRpcjhjNExpVkZsUlB2NU9vWVBtUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547001),
('LD48eQB8twhwzle00XxpH9HkgglXHSjh1BBIetpU', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM051TkxyTFUwZ1gzNjgzVnVzaHlVZnVnOVJZUUFrdHhEY3lPeE5pcCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545873),
('Ld4zRFRYCLqU6kRtNIo30CeCejq8HiJKe0OjvZ0G', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMDI2NzMzbkxIZ0E3aTY4a2ptODZLanVqbmRMVEZOdWVCTWFON041RyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545818),
('lgjhHYqLp5ynCzOJXWwoEQQgCT3gEsbJ1ov9EPnw', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDNjTmFic29zdUJhZ05XZUFCVWliM1ltMENYNG4yRkpVV3Ftd1Y3cSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545590),
('LIxkz5Ddrp3rKeojkLNa5ic05305YypstOaPKxNe', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicENLdktwRVJUbzdGRXU3MUE3dVZsUEV0dVFNR2w3OUJkUWF6ZmRGUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546665),
('lMOI3k0APqgKFJT7sKLtLzldB83QiqI7Jg0KamJj', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1d3cjBGR25tNXNXNGNIMm02bmxUd0JYNFU1MW1mZEZkcmRDOGNiTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545580),
('lObHHaEjPzMXw0KknzbFL4OcxUbphI33ZQ0u9Ng1', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNjY5Z1BZYTY2ZFQ1Y0FDelpNaG53ZlZmR2IwSERrZTV5MmZQUExLWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545580),
('LYvDrgnu8uoBgJvdHhr6FhNkntlbkYQETNLjvNaC', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWTJwSjBlb3ZNNXNOS25TY05renRoZFJUaWFFbks5cU9zY2NhM3owZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547002),
('Mi3aDdR11mNGMKbEWx47vV4fAM3Aqode6TqKw3vY', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicXJpZ1RLOVF3aDBsMGh1WHUyanl1YXBVY3V3cmJkVE9FNEt5YkxFaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547143),
('mkeXRf8HPADtZw24rBwBGD5GPDB3BDH5yqnqraiQ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSVdFRzlEN3Y2Smh2YVlqdjJQWVBwSnRUMDR4MlpsMU5GMUhXd3p1byI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545818),
('mKgerJhaBK8AIBBiXsNuKQoR6nPyMPVp4FVAp4Kr', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0psWjFCRWFsR0RBdUM4MUVBQVAxczY4WnJEMGtqeGJvS0N1TndYbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546954),
('mMw3jkVtdaM83lHFFJA35xQMwUg4oIgiN9rZL8wG', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQVFoQ1JBSGxlZVdYWGtKcU1WcWZ2akhqVmhYVnp6blU5VFRRTUhSRCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545884),
('mOvdwzxsCIcwvnBz5i7LtuHozvCOrCQUArJQayHq', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHpiVUpaaWNkTDZmWExuZmVFYTFqaTZVNEJQZEUwM2Yyc1Rtek4zNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545614),
('MpxjkM85pH0zYgZAs3grAdSsUiW5xmHvIJOm7clR', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV3l3QW5xV0p0SW1YcnF6QjVqQjRwNkJieVhKdk1ObDM2M1JyTmhvcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545807),
('MR7tOD8TTdGafa6uJYWhGXbGmy7aD1L0RPaQ7Kn7', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2lCYkJHUlNPV0JmQWlqSDRCbll3OVBkZWl4QlRPZWtVTmZnbktpaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545888),
('msPAFtodCk5FE2vshGEOmSVk14CnMUICR5KdhOnj', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnoyNGZCZm1PYzZwT1VSRjFvbmNQWENtaW5HN2hBM0YwU1poaWVEdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547215),
('mw7ttHNTKN05ZEFqvvFMyTjN7DTU287KxGxrKRvv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic0ttclBRY2VIQmxIcmNpU3pGQnZNYnVYdVM4WDVlUGNMM0w2RFpiZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545556),
('n4pz6xJzlj4xpzyJl3H0zB4KRCKy6qCMpQGRfVg2', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieXFubTY0d3VHWk5PNVJXR05yN1cybnZCREZGemdqZldEcHRmQTlOayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545873),
('NoVU5z2DW9iuwbjQ0iSn498MEGKigfU6xd9ukHAt', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQmtVTzlsbzNIS2JRR3dJU3lCRTN1OTYwNEFQeHZDUXNoZEVYelpocSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547024),
('NqDOjNlc8Aa0cgoZYkX1DOjjYnrFUST26SEWYFJo', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoialRnd2VCWkhqMG1NSUltYlRVcW8wZ2RZY21NeHBDbnlhQ1J0cUtiQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545872),
('NRbMSzjOl04x4XjvlkJBE88pr6rKyHowlt89ux1e', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidW96T3pRUHpva1E4VzZuanZySVMxYTZpUDQxNjZkZ1owYUVwZlhJRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545855),
('nUYyZkMVbwkfy9XHObQPMlqaowEq4Wok5dHVjdhJ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOGxYNFQ1ZXVUOWNjSTUydFRDRlN6dWJFNXpBYWpzU2hwbzZBcm0zSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546998),
('nWoUpXjP70mAwEx6gRDPFoJo5ir83sAJePqio6LO', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic0ZCZEFuTTBTVHFyeU8yTW9sY0FwSjZua2M1WlUwc1MwZ1VkbjBDNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545614),
('ocegHw7ZOsJZsCvAZ83EchiSLbf2mg99OJn6Gg3S', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUjZITzBHWlB0RmFhS1FkZnc0M3ZZdVhjc0llbmhNUWpnVTJvU1RuTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545751),
('oEpLeLwndMjGJPRwKWHB8d0f87PmaglOlQ6rwFjm', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQmI2VjlyQ3B1am9mTkFKdUtOcUJsUjlSN1I1MGEzYjY1dzVpYnpzbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546682),
('OGMlvY1XGmC0M3OoE8jAdRpI1tIi4Grfhj8YAo8U', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ1pBb2pTWXJaRGFDcW85VUVsaHZpeXZ1M2kxM2g5bUVwTE83bXBNQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545553),
('OIByh3fsa1lrZDRBC09J6ODEmnvTS9o7zY7G5RN2', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ0NoNUtHQmtnRjd1cG11MG9vQVMzenh2d2REQXBSV245bU1lcEhydyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545589);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('OpmV18nEqpqAmBWxbEt76f8EGrURCsI178AVyrr0', NULL, '10.58.108.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWm96UnBicFlNVDJjSmtiZHA3ZklRaVhBeERQeGg0R3R0U3lHOFIzTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTA3OiJodHRwczovL2UyMTQ1N2EzLTE5MzItNDViNy05MmQ3LWM4MTc3NDQ0MDU1YS0wMC0yeXJ0bDNwODF2MXhrLmphbmV3YXkucmVwbGl0LmRldi9hcGkvYm9va2luZy9ldmVudHM/bGFuZz1hciI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545743),
('OptwgIdW5Yc33FwEy10wbujuUtW1GKYW4UXvjWt4', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVnVEVUQwSnVhMTdSSHdjZmFUZ2ZJRXlQV2JONnc5dzU1TGZiZUU3TyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545589),
('Or8gmwB18uKSaa5xibAKRofbiyqpFwlQBxSYVosY', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkZ1WUdFU0tJV1czVE5OQUZUczFydDNVTWxOQkpmRmhsa0M5ZEJaaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545541),
('ORWRGZq2qoc7pYilshD0fJcsI54BIpsIUTk0qsCb', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMTNxVWNqeVZGaXV1ZDZuUmlPYXdaa1NsY1E3elcxMWhhOVJUdlNnTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547002),
('osNpBSUmyi7GzhS2H2dc1KOGcDhz0UEvawrPgg0V', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicUtXZmRuamtZQ1J3Y0x6RGRrQkVaanlacUxvU09sSnF0R2VSczlDUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545716),
('otgH30NhMzR1XGB5TKEqqj5OImOEKGs8zl7I7CQH', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS3Y5SGdXYkh6alM4UjZnb0ZCQXRrVUd4dHRLNzMwQnF6S0ZRVXZCayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547143),
('otxLcAiKHOZy6akhASeFTM8dh1D7bQSkmhltoE6g', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT05Ya3ExalJSaHVpbDhaSTV4aVA2WmU0SWZSRGZWeml5UTk4cktsWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547024),
('OVrApN4xdV08V7Nsl7vzS9LglIWVV0T4VpLrxCXC', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRHNVZnA1UmVoSVkzWGJwb2ZvWXAyNXQ1Q053ZmlqaUc1cGJWSVg3TyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545887),
('OZRpMeKmGMcD6Y4AUgR69ky8dREsncWsqXjEW6Qc', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZDlYbFFDcXRqS3J6dlhQYTBWR3VoSDlMUGY2NjNieVZlYzRyUHlyaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545784),
('P0ouicduJyttswuj7cjXNc7feA59GTCPjnulefjJ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMGJ2Nmh1N2dPTlc4cnBScGY3QzZuY1NzYWhPNXltUXozYUVFTUFjMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546937),
('P7VYIObNiSzhpt4ZuW8uDvrQgp9bFXDiRUXm61R4', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoienJ0Tk1TNURNNXpzeHhMWjF4Y25yWmRtdjdQWWg2ZHppMU5NUTZwaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547143),
('PBuE6Z5i8C5jaahNvKaiEmnhOORnCJKNtflodYB2', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVmd6UmZ4U3RpRkJJWWtaTUQ2MnlHNjVJbXVpOW9ZamJVY0xVeHlxTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545614),
('pe4f3A5X6Cnoy7IAy8yIvcXOdPKDBRicVleqFLG5', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRlVxRlZ0NXF6ZU15SDJEbElUZUZLYVk2bDJpdG41RjBveENDOVZDbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545614),
('pFI2laG2VN4HNWrj0FIjckzrcSLFZ0mJhX4L75UI', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibTYzU0RxSWxScFdybUtKWmdnT3NxVHhLMG9TUmNyTmdncUEwWVNTVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545855),
('pkSNM9SXg7o2bTR3RSVJ4Anm7nY4TrB0pOCMiuTL', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRVo3Q3N1Qmc5NnFNcUltaktMRDA5QWhZaWJqa0xBNzdyMDlETnhFUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546467),
('pLSYzy5hOzFNN7AihIgra75XNPRBtKdVaazQxv92', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRnhXYnRXNjhCaFNQZ2ZrMlFLZlVCeEdsa0ZlaGNvTmFCdG4xNHJRVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546345),
('Pnm1jG5Dy9cm5dyzBLGgXGiTdIhkWO5XRkOktrCE', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidEFaUGZOdGllTWVCU1JxaWN2THZTcDN2Y3lpdHpHRjFmdDdXRGhRNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaGFydHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545751),
('poQqDJhJpDED502XqdMqOTvTPmu2XjfOAmdu0zFg', NULL, '10.58.211.198', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVXZ6Vm5yWElFVmVoTzlWWjFaSG01MU5RaTdia0pnR1gwWW54SUdGQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTY6Imh0dHBzOi8vZTIxNDU3YTMtMTkzMi00NWI3LTkyZDctYzgxNzc0NDQwNTVhLTAwLTJ5cnRsM3A4MXYxeGsuamFuZXdheS5yZXBsaXQuZGV2L2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545743),
('pwnCz0yyJMiYo9tP6wtfGXIDzjt4WczZLNTATL7b', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiazRHSDNGdmQ3UThITktGTVdmOGFRRTVCNWV5TWY0SXg2SnBoYnk2USI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545854),
('PwtXNYNzEJZyRwzEUwP89HXvapLmO46bXPqbQamX', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZlRUYnltdVpBaVB1Tk9EQjQzOFpqemlzbW5kcXZKekVld1VGQjdERiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547024),
('PYJj1efmg57YUkRxLNdikPs7lOmfoAFj3J48YMGM', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidGpFTGt2ZnN3OTE3aWJBZkFSTFpQdGNpMGdma0NMWFVXYkc5VFZiRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545807),
('q3f3yuzlmlN8IPpm3ay9KK5huJuXPMJm9fNOeAg7', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTGZETFRCdlJWZWw3cm03dlY4SVJIUktuSmJ0MWZ6NjNvNGk5blQ2WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545807),
('q8cy1g5Jt1OUxu5rpq8GTl2uFUsbX7jzUSNW9h5u', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUno1V3o1TnhuSGZ2ZXpSSUd3c1oxZmd6WkdGWVhJUXZidE12WHhkTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547112),
('Qa6aiwPLQJW44pHz5rjswrpjzmFBOkZtlV7KWhTO', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUXZHYUhVZmR0emNYdjBoTWV0S2R5VWNxVjVTcEYzMGU5V2piSkRvaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL3NhbmN0dW0vY3NyZi1jb29raWUiO3M6NToicm91dGUiO3M6MTk6InNhbmN0dW0uY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545599),
('QeWteARkcn038N45jkYFD2g0UsEnBtr968YKHlcE', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieHJUR1YyYTdIQWdLQkxYTzZmZkh5MG1qclB1TTBkYUlOdkd2OUxHayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547143),
('Qf8MQ5Hq6U2qoVAaX0a5ELgZgxIR72mBuuTrnbKQ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNUpsU3ZxTzUwaGQ0cWdvZHR6S3h4RXlQQnNiSVZpS1IzeDNTUDluaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545614),
('qFvVGN7yxChUAOxPTnTPUdqfqF1m3CDJgwwRWEpl', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUjAyNjY1TVlQcTJ6SGF6Um5uM1Z6dlRBa2pzT2lrcW4xWG80bEZFZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi91cGNvbWluZy1ldmVudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545600),
('qGjKYIszDSxCzAd3j9h1DaXbjduFypohvrY2GQn9', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTnZwdlpRRjJKV0x5N200ek01b0s5eHc4VzIyT21qaURyUHo3amNhciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545614),
('qHiKqeIhzx9Yn8poLZ4orguKw8Fbf9tz2F5BJwOH', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidkR5WFFUblJPdldDZE1ubktvSE5RckR2VkpjZG9YYUg0MGZUYzNtdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545853),
('qnEknEkm6y46vbCwYJoqkZG5BQ9bxViymP8COs58', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFQyQzBFNVB3ejhxWjZVTXg4b3huZDh0S2w2OFd5U3hwdHNkRTNUWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545686),
('qQnVa7774UdQM8TQYueeWCK1z1ZV92OZqFRMtr7B', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzZodXdzS2pFaWZYNWZpRzkzTmIyQTh5ZkdYVFFwb01qSFhRZ0JFOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545554),
('Qqz3jSfy8EHj1QHOL3MHDiz4DTzjUPRObrdulRjS', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibVJyZzJ2Rk9WeEJTSW40REduaWE1QkpIYTM0SGloVHJ3dG5HWXpiZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545804),
('QQZAkpFFnPHBWGn9wm8rl6fUrB3Zrq5G91kiaR0E', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVEJGaEJyVXJaNGtkMHZWQ0YzWFh6c1lGSU9YMFZYZms3a2dCYjBzVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545580),
('qtauPCLCuNDJfcTu5V3Byi5WPM1w7AxBs7C2rfvY', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMlBJS0lKRElLd3JuN2RKOTVrQVZZRjZpUUlLMVljUzN1bE03dEVWaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547173),
('QuEZ2TlFk1L6S5gM0nfqFPUN43DYFK2OznRB8f7k', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRWJza3lVcmlFRGc1Nks4VzgxRDNWUzlQMXQyWjQ0NElTZHZ2emFJNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547002),
('qVBlWtxcTwisa50IDoghdGLxFkhEoy2RLpTAzEa1', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMmZ3bk1PSkM4TzUwZjZYd3hKNGxSRDJoRzhYNUt1T3NQenp4NEhLbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545614),
('qXGAyVZ47rC7jAwgvtKTK983Orha4nXPwszrPw7p', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR2tyUUU3ZGhtbGVlSEtJTWVPcTE1V1lYQ0VNUDNPRU9Sd1M0NmV6WSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545807),
('r05IFDUql5nJNoRf7KJGgZiQcK2gdfs6148WoRZL', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMG5Wdm16emRkU1F1cEs5cUVnTlBYY0toUzZETTNyZ3lHMTI3UVNWUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546466),
('R0jqMgC08vwaQJBP4wMBK4Neuq4qOxZUtsw3OXt5', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUFExWGp1THo3V2VJempHS2drNnNOMFhzbDZVYVBPQ29nVTBaRnZFSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi91cGNvbWluZy1ldmVudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545751),
('R2DfcBpfD1IfhpE6wnw0MZ8CSUdFBWf3olxSc2yw', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibUZsSXlsU3VmSTUzMmdLSURqUE5yQW5Jd2NhQ3R5OFlyU0daemJkZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545556),
('R69g1HyUsjOmbAvL31nvNKatYkBnz4TTpwrdJTkP', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOFlCc2xuaExjT2hzRlh2ZGlkRk10a2VRcEZJallrMngxcmcxV0psdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547024),
('ReZs0SSaoB3o93W9gtHb9XA7tN30x6VAzm62SUkU', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia1hBSXVLUzFoWWxPYTRPS3Jvb3BGbGFMamk4NHlxM1FQOHI0ZkZBNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546466),
('rMbZRWAZZVovc7Ugbism1zvgyPC4AYR87w5mn4qA', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY0pqSlBvZFV0SnlRa2U5UFBvWEJQMUFZOGloZEpkMU04YjVITjVEViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546466),
('RWgIDYbP1P7ySVLqMhiOELnGjFrbnePV8pmkIkV1', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQjJGRlQxaGpUMWp6QXdIREhnSFNjQUs5S244bnFlNjFPZXF6bXBJTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545872),
('saaqjLOQXTP9kRI493SxqBNEOhgN7Am2xaX7CmPE', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMlhvT1JSTkNBVTJhQ1JZdkV0a3pDOWlydThlbEhKMnQxUGVYMmtUMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546467),
('SdKW2gRYkzXl4AX9sAeq9Jbmkob6T87vOSENahRM', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2RhQUxTR0NDcFNMa1AzNksyR3RWeDRJcG5OM0JYOHFLNXduaFIxSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545873),
('SgZf9yRKnAsYbfZSSk63k71sHBebZLO5qfx2CGpz', NULL, '10.58.108.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibmpaTWNVUVJhSkNXVjl5MUJDTnNQaHBpZmkzbE90dWVmdVFmeDl2ciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTQ6Imh0dHBzOi8vZTIxNDU3YTMtMTkzMi00NWI3LTkyZDctYzgxNzc0NDQwNTVhLTAwLTJ5cnRsM3A4MXYxeGsuamFuZXdheS5yZXBsaXQuZGV2L2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545743),
('SIGNOvZxMzHX2CNgRM6Y9eh7MH5PrQVcVhOrpdPz', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMGFlOW1EbUtGdFdTTE5kYXRxbklmZGhKWlRkNjdPWkRWV0V4NXFCRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547143),
('SisRmQ97oDVWJeNx3DD1S6wQNH2xOt5DDrWDiQdZ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaW1YaEN6T3RUZm5HQzVnNmkwbldtRkRrcmNnaWdUV3Zrb2dBd0JHYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546937),
('sjJSBL2iEpq9QVTdp7Z6ML12BdUxxVEPes6Fupg7', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQ09jcnkxdDlNdmd1RWc0TlVJOXVhdzhpblI4M2h1REpXOGl1WFliYSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547137),
('SL9m9d1Uohwh5rbB9122470Thp1ZfYVUnpu3WdkE', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicDBvN0N6ODEzUWpzT1llVjRGRHFSdzMwYWRCSGcxYWhtSGk5VkxuSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545603),
('slYNvJlNZowALRcf4tW7cT78cph0DVpUB2suCTg1', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUdQN1dOQ05DUWZ0MHJ2VWJZM1dwanRxU3Vvcm1HRnRuaU5FdTNDUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547002),
('sSRW1smOjrzTmgfuXut6k5R8ODuovKgluDjpAYWH', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieEVYeEhWWXhlc1ZkU1lqeVVMZzlnaHRLaFFmelRUZ0xOakg3VzhGQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546686),
('SuEJQdhPUXEvA7BF3bzZMddrPjGHnJP2SdTRecT9', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODR4MEtmTmlicTVydUV3dDNjaE1ycVVmeldsclpNSUFPdUNLS0xuOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545873),
('SVfmq5zlXVtd7UpleKjifWWuPzHN7cmLTJbAZKVs', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWxrcXhyczBocGdhSzBzOXVoVEQ5ZGIxY2RVc0loTXFWUFpoMU1wdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545542),
('svoLOBepNKDJcIY7XZyKMPfGbB0mXcGQ8HLwL9UG', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTVIxaTF3MWJBZkx0eUlHWFJGRGw1TVR1QTVUeW40VDJjQ3lsZUhtUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547002),
('SW83eWEjKK0ndrNE3TM9vyXlB5tBcPn1CIjIPHgd', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibGpXTXdtdnY2dE9DdTRrc1lCdUZycnhBTXFSVzZpQTNST1JPVVNoRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546937),
('t09FAcU8pe9Eu2zwVgaCJMtTwtvm0rUxaaqYgG9X', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2hpRkhnZ05jZ2FndWIyV1RoSmg5U3NMd2Z1RzlDNjhRcTJHR296WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547143),
('T9k45FNUuT2K3yKX3DIF94HWjvjfvk4zpM4IHYA1', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUjl4RTJvNGxNVkZldjQwcXRYU3pSODBUaVI5T3kwQ3dFNGNPd1l5VyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547006),
('T9qr0w8HnN3eLrKSxw0Z7IvfOs9HP3qEMtNkZYzc', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2F2Ump5c3lpT2tvWXdrQ3MydHplR25KdjdqN0hNNEt5ejRxbWRWNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545873),
('Tc1efqWmEUbtWwoJdhSOC5P4RMvGsSSwEk31ZSfm', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN25mSVVYcmY1dTlYQVFsaXF2eU82VUZFRXpoQUtIOXg1blhCWnB1eCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545553),
('TeoThrb74jHWsxfMH7JLg5EIOO63qeVWzo2ONwdE', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWGRtZnoycG5rQWFHbVJvSVZTdXFxRGlJRGVGcE9GYnNXUk5tSFQ3ayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545541),
('ThT1zgaE2jSe8k9Jzrmc6WKJ5JbJ8RwjYNLXtSWY', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWlpoSWo0WjhPamVEQjVaeXluQ2ROakc2SzZLNlU4V0NjQWhocEVrTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545716),
('tlGYeA8DWhnTuv5pCA7kZdwvC6E4kVucQbSR2U94', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidThlZmRRMHNPdFhQMnl3TG5oZTJtaVdHWTJJOG80cXNkdEFhQThIQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545818),
('tLQg6942ke6s8CFfVqsbRPKjnUv8EnpQ7mjzuDY9', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOTZnTzdxczJNc1E3bjJmUkpjTVBiaUVHejFrcFR1RUdOcERVbkYxYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545818),
('tmEBGvlj3zIM1aJboB5l7YT9gkKOnXFHEvstHim6', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSjlwMWtWblh0dGxTZUVKQ0V4cFcyZ0lNQUQ5aG9KTDN6OXpaTHZlRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545542),
('tnBN4jnQaQWOSQTVFHvDmC90XemRn4bWquAY8PTB', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYjBsMHVSMzFxT0ZvV1ZOVHFTU0g2T2I2dEoyQ3BtODF1Z1BxRTM4eSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545854),
('tTzW7gwGL1H7uOhOMofQPUGkuXnKbNWJZz03G9Fh', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUpJR2FpaW1BVHdQMHRKYzVDR1FBNENhUDNLOHNKVUtFSnE1aGcxOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545853),
('tuZteMntBeljubX1fL7YQG7OzgjZglVIkl625wJv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDM4OGFOeEgyZzBwRXRrWWhXaUNWVDdoTUw4Yjg0TkNwaVE5aHhLYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545580),
('tZzFr475flOYx35yN4ntPuCfir0nZxi4OFhdIR4y', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ29MQ1dHNjFtQWNTWkV2TGxQVGdGREV4cjdMVWdGSEhscTRDVnpHSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546577),
('u7aRV08loV0y5Fe1hHLPLaRiDNwp8Ovq3Ng7TdY6', NULL, '10.58.211.198', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZHRhZEs0MU9YZHhnVUJYRlRKR3owN3BkR2t2eE1sYkZaemt0Rm0zUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTA2OiJodHRwczovL2UyMTQ1N2EzLTE5MzItNDViNy05MmQ3LWM4MTc3NDQ0MDU1YS0wMC0yeXJ0bDNwODF2MXhrLmphbmV3YXkucmVwbGl0LmRldi9hcGkvY21zL3ByZXNpZGVudC1tZXNzYWdlIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545742),
('u8NVPlvMYidHlbYC5jWuEf1W4Q81A2fLypAlkTjY', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZlhERUs4M0tzOVZvU1ZGMlE1MlhLZlpzNjhEVWRiQ0dDdlRDeVdRVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545873),
('u9QkI6ZZACaVV0sOxCe4aserYjl9QYLRM64GVDxL', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQjlodDU4ODRDcGJUelF6ODQxeUhaVU9aVjdJQktXN2xsOWU0bDFhMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546466),
('uFF1R6Dm0dkKpsXJUJ2kZgcNPvJAiYpPjzwTh6ue', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNXdpaHI0RVhuNXR3aWVUbzBpRElYbWVDbWIxTzJNSUhCbG1hQ2dTQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545870),
('Ufm4uBdWOnfgmFP737TeXWDwMqdzvJI7OOlsqBFj', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1dtV0ZoVzNXRXUySkF4enFHWkxFUlNURFhmNTFPUURjU3M0SFZTYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545854),
('uJIwWfcoeu7eODhhA7zioTMWHkxitwiVXLat6FeT', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicmgzbHpiUkM4SWJDZXdWNlJaRnRMN0d4SjYxeEd5QWtaR1N6MGtmbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545580),
('ukTv8h69PzVw8hQgrSSXlgkqkr7kZf1MKNRwClkv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoianlRSmxSVENoSlRHVDF5YTB2eE5WcUZnVHUyZW40MjBIM1BVM1EzTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547001),
('UleYQUaCiRkZ2aeYfkJIluPasobEtZsqctT4pp9o', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQzNiUGc5MkJKcEpjbVNlMGJraUZFckRhTjJZSDVwdzM0dHJMNjFjYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545807),
('Um5E6n6KjG5TKdlkhXanEkgXUWU4LKU4ATb6Wn1p', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFRJcHlweDJKeVZlY2lWRFZNSVNzaFlnamd3NHFDQTFYT3UyTkRDQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545580),
('uRPxyPzANgA7JCL8yAOe8cl8TWQTkiEXGRPoF23B', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid0gxUEdGam02YmNQanlsbjZrb3BnOWo2WVJUYmpwTm0wTzRobmQwRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545542),
('ut3kKHeAxPDg5uyx6511Em1EjzcfJGp2nKNuTejj', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTUZ3NVZUMDhDQ1lnV2JBMGtzZUluZEFtTkU0U0N4SmVMMTk4Q1ZIbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547001),
('uTRdVPIx8yIWeT40l6gzUrnqcT8EjaIPIMhMOnsc', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOGVtbkdGSk5XYXZmbEg3S3ZrSUF2WnVkbHlzTUJ2bjFqeGVDQ2FYSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546466),
('utvZDAXzazyIM3AyN5YJSaHpUeAqxgxob1HG5Ztf', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUF4aWxwaExFQXlta2dlRUFxTlJVREpSalcwVVFrR05uR000NVlyMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545818),
('UYwAMEHU2sPO8JM5cAGkiLZhzOM8ojp4nZOkVkwv', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR2tmOXBLMzJkdXgwZU5NdVNKSEg1MVhSSXR4SVNGNkU5S3NtT3kwSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545888),
('uZZyiax3tve8ljuJ3kWGIsbn3LAxcsqrKjnR235B', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTWJ0U0c1SXF2eUgyc2JEZmtPZlVIdU1leVp1TnBXZGJiQlk0dHhiaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546937),
('V9DIZ7w8haRC1tZ40CcReDwr34IiFMvUgn9Mw3nY', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaXY0ZHdibEdFYnZGT3dhdnJlMUVWaGNxQmZKNTZvN3B1Y1N4VmJyUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546345),
('vDnt3DihSeEButWMIHMITXUZaRRHXhQR07Kzfk0H', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNGVRWlFYRHlIWHE0REhyeDlHeFduV0c5dzlZMGRXTVdsbzY1VFZ0MiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545553),
('vfVOz6R4xYXv4ELGxvjsemlSgNvajQFyfTpEjleV', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUjFIQlZhQkRXUHczTDlDdEFDZ0tOTGlhT0JzTHc1V0VMakRaM2tnRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547173),
('VjngSFxUDq03Zyw0RJgjqMjWeGZ7NuuyGLBGsAyY', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZXJWVXdGYmNMM0xZNEVPTjlxcTJpV1JJakF3VkpYbzIxMnNOR2hWYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545887),
('VLiXML9bIMUvuJPD9d25tBGz9hctE5nR0v3TrAyC', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWjVabkhGTG9NcXhqZTlSU2lQaERMalJHMFU1WW5hN1g0NEV6UmNPWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545716),
('vMGuibBchumzQdSvpPjDVUI9FVprsw7yLjcdandw', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZGdhYlJ4d2Q1eld0VldtYWN0MldTYkpzdlkxSlFiY3dzVFprMTc1OSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546937),
('vnZq5OvFfgLJlnhuDdGNkUSZevfsnZJp6pAB5SMu', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzBaVUdJa3E3RW1BMm5ZYW5vUm85RE9sUWtIeFZMUEZFTzJFbkJnbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545555),
('vRXCj2hS1ROtHqFrgAHjs41QFt6BeGYxnkfl9xnB', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicTdOYnYwSDkwYXExTmVKdGVRN0VhTU5ZYUlwNkFjckVCelFYTjJRMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545614),
('VUBJA1Nhn1m27OfWQmakGZiK1eeVDQU99EJ4fBWU', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1B1M0Y3T2gwTTlqTzNEc1J4S3NMT2ExdExTOW5yNXBycEFmT05PaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779546455),
('Vztbh9ggF9CYTNfGCBiNQEmMFJV7NleYCxaJEmYq', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRjBGVVMzbWVMdm5ZeGhOckM2cnVjVE80bG9yUWtkZGE3aEFCWkhaZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546608),
('vzuscV6E0JSqGisrDtXHJQOoypsYot1ptCjgnipJ', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUXVBd1ZnaFpveWVuZE9UTzNPZFZqNm14QnMySXJGM0p4bDZYNDRkUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546951),
('w0055skuqBuzazk0mC6NwVgZ5M8MLVmEYkYdXIXR', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZGZXazU3YnFkWWtIMmZIZWN2aWltTm1UZldyUk1yS3FFdXNuZ0NDaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545542),
('W2gEDW2BUshDQ0PlJTxhyMPMPP4iLemCkGA1A1uB', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ3R6eU44SEZtYzhkZHdWTHhhMDk3cmFJR3lkQ1NHNGdsRXZFajVyViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545556),
('W2rQRsPBR61fJ2wjCEMIYZXpzlZEhSG950N7qBql', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVlJVU9mRlBxdzd2YTNINGZsR3NWRFBuQjhGOXNkaHd1cWZqYXBwUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545580),
('w4oAU7kuajPz0bdvupc2DD2aQmoUx0BgK0Pyau40', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDBIcUlUQkRIa1Fka3NJMkVnWVA0T0k5a0NhaHFXSDFBVDlvZ1VsSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546950);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('wBtiATunp6wNBWBSDjoajvIp4POl2Xd96XLzCm3C', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic1dQMnk3MFJDR2Z1WGVsRlhscUdLRGg1S3ZGY0JsOXEyUzd0S0J2SCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546157),
('wEA7xJE8vEW41POeST3tS7QknF5FXkMQ0bHNUvVs', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNmdsQVZ6QmY1V2hjS0hHR0tkVmRkVWt1bjN5ZXk0UzFtRTJFSHltWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546666),
('WEYXoKnd7FUmClDDumqOtvniLN8mjNeBw3KscRvt', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUHZBeVpTNWhqU1l3alo1dEVIb25zeHAybXlvMlcyZ0djblFYYmp1ayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hY3Rpdml0eSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545751),
('WFI3Ga8LhrDf3peq1SM7y08zdeu3EgiLDXNpPSpS', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU0lSQVFNWjV4U2lCMU1WYUZteFRzY2RISmFsRkExWVRkd3FrQ0lpbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545818),
('WHDCk7lPX3xpdA020tKGqrTd15OesBSytYG9MsKb', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVEdJV1RkSnBkYVlHM014a280cmdhT0Nianl0VklmNlJtVWJ0ZzlWNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547143),
('WjohzBb0iW375LdwesNXyuSmObkeWPuG8f6f3v96', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWZabm1GQVg1YlRmTGxQZlhIbUdzUGRHeTNqVkNZUERpOEc0aDUzTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546157),
('wl7orPN47jwLf4c2bhPaYknbHXbiC429ajPCli4e', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaW91TU42aUc3bGsxU3h0MUJoYmVnN3JMTnZtSUVUV0dYWFp5Y1VJMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547024),
('wLw2OlI5pgEYk3F8yZbrCF5V7EkYKTosnBhIHOH5', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVE9pTDhKUzVEbjJUS05JdWU2SFpDcFEyRk1XSWNZWVpYYzlpMUh6MyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547144),
('wuRCAyKZXzdDQw3xpyG95Ai8HWZzHMW64A7YfjvT', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUZXRjdxdFFVS3ZsZVEzZWxLbHRaMFJDMlg5b1JFNjNKaVlhYVlSUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547021),
('wV7iU2BcysuPoiIKJEYWCqZCjFEbxcSt7npJNAb1', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibnFpenhqSDJVck44T0dxSG14YkNjRHlFOWJZTUw3ZWJUWlFUc09tNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545542),
('wwXC9jx5KQDEYeV9Kc8pcnCN8z57qdUrHhizIQ4q', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYXExbmRSVlRqdk1JNzFhaWw4QkVETlBacnA0Z2trcjVxUmY5WHE3biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaGFydHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545600),
('Wxq98LMEbxN8z7lfXn4Tm13Lq37KuFjIsr9xFfoB', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWVNLTkdITEp6N1BXSUFjUnRDZjdiVGszRUY1RUR3Y3Z6eDA4VjFQeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvY29udGFjdCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545855),
('Wy3zSiN93j2zjOyYYDhaq6WCQJGFzpbHz3ivRhyV', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOVFEVUVIUURoYU1hMUdZRUdGNkFFa2NTMXhsVGVqU0VBM2N6T24wSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546937),
('WYIBM7uWOwdBtlQht5AaTjx4lqfzDcioh8VfmJt0', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSmtwMmhnZmd5TmoweWlrSEtXR2plbEhHTTNKRGtpUEFvR1RQS1ZEMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547143),
('x6k7Bzs21wm8uZweFnJNRm4Aj8hsP6VueS9kjC0o', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieU1hZlVCa0xnQ1RSaVpoeUpRQzNmYWE0SkdLWXl0cHFPNGc0M2xPciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547024),
('x8t6TlZLE7jUxPlK7yYwjWLlygGitcSdPvVNg5q6', NULL, '10.58.1.55', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWVFpYmt0QzNoY0ZYdGdpMVo2OUtqY2hGV1pjUGViWHk5SW12a2hkNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTc6Imh0dHBzOi8vZTIxNDU3YTMtMTkzMi00NWI3LTkyZDctYzgxNzc0NDQwNTVhLTAwLTJ5cnRsM3A4MXYxeGsuamFuZXdheS5yZXBsaXQuZGV2L2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545743),
('Xb14ZIKp3VsWPBighK9mdaFHajbtXR7Yja6eY2Zd', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMkhvZllBTFpyNG03SGJrWHRtWXJ4SzY5NVo4ZTdJSVlzakx1Z1RkNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545542),
('xH7gVnf2h4llnTq1PwZOha9lZy2QhMaqSNMdaJDU', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMnh5UUI4OFJNTGRVTzdURnF1aFdvZmlNTEcwNU9sc3JkdmpCdkkzeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545590),
('xi6RL9t4T3JPGsYKdPpKRxVYbgPAmI9F3UGFJMoC', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiR0tZT1hIa2dDSGVHcmw0d3JxRk5LUlZOWnZvZEpXcjI4Vmh4b2VWNCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545600),
('xiQgpVKhY3ox1eviXLPROX6pxfHbTqiaHsHDjvZR', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib253ZFJjYmt0SkY2dUczNUsySjdDY2pXR2RDNXJHdlprOWxqMURSSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545580),
('XLd4fiyBupV1YdLa4jpzlqzO2gPpieCdHKjbztzb', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaFJEc3Zka0h2dWp6cnJaOEt5czZqNFVmekdMRDJOVEhackhyNUpQNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545614),
('xnbxBKAfoZwx28OHF3IEb4ZuOjNEBqwdfNvwLjI7', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWZUVW9xUkpGTDhSR00wOGNVRWJvU1hmYmlKYWFuN2VGV0lhZEF2aCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545853),
('xO1yItaumB45scYEjxsZJiBFL7Sn1mcl8sUumzyg', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieDl5enBSZVhGUXUzTnBoeUo5SWo1d0pta1k2Rk9xUUNwS09YUFpQOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545807),
('xqRGYg5d8MZ4xGTRbq36cfRFJdeTnNLK2mp89Eoj', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieTl3SW11YTUyME5xWXVtNXJDN05rYjRpQUZQeUhsVHVWOU5IZ000ciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545580),
('xURrz33kYtb8PM4GJbgVJHZJvzV0wnbZrgSX7e8b', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZmJ2dXk5bGFOb1dGV3dtMmpzUkVnUW5zcTFsRzN0eUhibkRHb0U5SiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545553),
('XwwJAoKm78aCcTs4fTHAS7K8gtCkavrSnefXcPDt', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2UwOUtXWjRaRHNHVXJVeEgzbnB6empkYXh6QUhaMjNQc0JXUFJ6UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546157),
('xXXXdBowfuXUouZ7yLlEQxvPcXrJJPt50nICaOu3', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUVBXUXdjTmNSelBMOHd2WGNhQTdXTTlKelZTWkpvdzVOTGhOZ3owUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545818),
('xysyGMlN3NyhqSbPK8Brld84iVY6deYcdjhTv7DX', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWt5QnQzU0xqbGRMSkk4QUhKdGtPa1UwV2QzRnNzTTdzWWNTWFhhWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545855),
('xznIIEpCv4dtg1RnuerQTFGh6sB1cHJW2Gev3NyK', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYXY5ellKelBkQ2FtdVc1SWtLaG1NMzdLdGs3U3hWcU1uZjNLU0xuUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545855),
('YcfBG7OGMBJXrE2x1M0kaBJEnTMgQT9fcbhHS7hf', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiczFUU0hYeG53UGk2TVZWalF3Y0U5aFphd2VrdmllaWd0cFFBVEZHQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546463),
('Yf87OvqxkFZK2z0nG7XlgubYGGrj04Dv4d3gP0zj', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS2Q3NWI2ZDYwbTFCV2FRNHRkb1JOSkRoZGh1b2g5NEdXb253aTAzMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545818),
('YfIlww2G5pfx8600LrHeKyOHqPaKFx2MqL5htzbE', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieFNxU0xwWnlsU1dzcjNHVHRCM1JWaUZQR2puZkdHY0NoeUlTOFdUUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546682),
('Yg8q6mjQBgmBMiVUiatnn91KEUsQRCOSiLGItdac', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1ladnRodXhKckwzbDdzMU1DZnphRFgyQnN1R3l5bW41STVGdTFNVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545589),
('YtR9SdnMkkEMPID2nI9o0rbdC5kFttGFhGOD7hvu', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRlZRbjg0UVBjSnVhakg4eGVrNmVjM1ZnU3dNVFlhU1pyMFNHanBLVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779547024),
('yu8snxjOvIVN2FvOBSkWcqSLi3f7Scj1NbmjtYw4', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieVBKdFRaUk1wa0Y3TDJQdjk1ZUlmck9kSWRsa1A5cEY0OHFhTUJrOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779546665),
('ywQrKw99PjAzmas4wQ3y9egZ8UkBpkz7i0RXYtCq', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFlEa2FlRXhmaWFTVm1nYWQxdWVHUlVVZG8yQ294WDQzcElOR29DdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lci1zZXR0aW5ncyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545807),
('yxcdSkwm60m97X5BJvdvoQGrADCDMnuOGqhwLXK4', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOFNocXAwcDVjeGl1cTVSdENuQ1JKckdweno4a2xrczBQRlcyYW5ydyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545872),
('Zbg88weLb0A98JpjHOH99lbvaNVDoD8SNTiOEEYw', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibXNXT29lVnFBbjFHbW1SbHVRQlRlSjZwakl3aWxabHVzd0tVTG16NSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545590),
('zBohH5YkZHfY7yZvLWTaFXnU2REPSlfnu400eDda', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicmo0ZnNtQlhPbDM5SEJFV0dFZGZRenFFQzVCY3JiZE9Jdm5RdlhpTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZm9jdXMtaXRlbXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545716),
('ze2IMe0c3cdEjyGZ7rEIYIzzKmjgvUemZ9BV82fC', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYndzV2lXVUprUGM2TTZBTUx6UGUydzNVS3ZsbWhkd2RVRVBUM2d1aSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvdGVzdGltb25pYWxzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545888),
('zEuyHUQCEWmh9wY7OzrLaKFvRSNyadu2gPGRkU9m', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaTROWmNoZFR1OTBGamRsUGZGb2pLMmRCZ1lLcjVuMjFRUm0wR3FMeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvY2x1Yj9pZHM9MyUyQzIlMkMxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545804),
('ZezMKLEhtLXbdtN2Dg29LdGdXFRaYkycUq2Au8fB', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHZvbDFtbERpYWw5amVTV0R0Znp6WnFEU0praG1MMXg5ZlpjaDY3OSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546345),
('zGQmxBEHyxM8RkjMePijWGZd93aSDcY7NzxI10NK', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieXdzY0xxWWFBVmNBakxHY3loZFdxYm5NcHFGbzhGYzRlMHZyN3JOViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545580),
('zJ4oHGDqkpbbUS7oSBIcAhZpiw4I7m6JhD4fT6Up', NULL, '34.26.42.138', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkwyUUsxT2FGYVQ4Ulk3QnIyclVaa3plRnJ3M2pDMFFWTWxiR2ZBeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWVuIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779545716),
('zOpTpNLZpAC6xSChnKmFXIKeFjdoAc2d2tF1fEby', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibFl6TXRaemllRWI2dzAwaHhUZDhsRkVDWFZueEo5SWMxTFdoZ3E5eSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545807),
('zQi8WQsbYleOvUANyadgLU9kX8Ye8w7HXSePP0hC', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkN6ZkluNG51TWgzeXphMDVidlQ3WFppeEVSQjR6c1MyVnFnTlJrUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvZm9jdXMtc2VjdGlvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547173),
('zRSALCoWU4X605RRXEQ8yol3cmgIpoXFfEvwX6Q5', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT253QWVSd0pBdXRrcmd2Tm51RnVEMGF2ZmlSZTN2NWl2dHRDSlJwdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545614),
('zT4aGXJuN6JvGUmmwbm02Ho8yZv9CXiiTNl5lrJW', NULL, '10.58.108.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieEVIaXFoTUlGdHRyOU9XMUJpc0F2VzNWNHRwb05lbXVLazJERGZQZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTE2OiJodHRwczovL2UyMTQ1N2EzLTE5MzItNDViNy05MmQ3LWM4MTc3NDQ0MDU1YS0wMC0yeXJ0bDNwODF2MXhrLmphbmV3YXkucmVwbGl0LmRldi9hcGkvdHJhbnNsYXRpb25zL2NsdWI/aWRzPTMlMkMyJTJDMSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545744),
('Ztw7Tz34tdaeHxN39glcrrAvEJzWGWR8A5C9ZSOy', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVjRaSHJDNWZvQXIxSFhUMkFzZGxuMHZhUXlTeE14WmRwWk4xTnBKRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cz9sYW5nPWVuIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1779547002),
('ZVHWJJzFoX3wb5eO8r4Dd0MJTFwRIfw7raJNfXuy', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU2hGWFE3emdkQzBibzVpTk5EZktlemZXNXFCdnNCMmVoR05zdlVFdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545873),
('ZvXkGlybVj2AHNsvOvMN6AnO3x3lFlmgPfQ2JFBi', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSURKa3hPR0haZ2FLcnhuMUtXUGRYZUlhd0N1bU1KRGJGamV0OVIxSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779547215),
('ZXK0TFXoGo3NoWIgtw7ltk0aX2GrTNQ4hFoEhO3v', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN0Jvc1dxbURIc0w4RDhmbnh1YUxZZGMxVXd6M2hBNTVSTFJTZFdraSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779546345),
('zXkhsrx09g82sScQmdaKUEucQlfsxR793mfelFyC', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNXRtRW1hTWRuR1RsV2F1UFRZVGdtaTY5VjRsTzFsYW1qdWswN1BQUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS90cmFuc2xhdGlvbnMvdGVzdGltb25pYWw/aWRzPTElMkMyJTJDMyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545590),
('zXUcqko80QPSk1r1mh8rb4mwb7PpagdceN1N2QcV', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRzY5N0I0TGFwdUN6bURrUDRCVDFLaHpUR0loNzVySG1RZXEwTkF2MiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779545580),
('ZZFVZskosoY2Jtx2Fpkp8IuMGxHPN5O9YAyDoh67', NULL, '105.156.50.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoickFwRk81OVBXVUlTUTNmVnFiSTdYZXRnZjkyZHc1WW1aVWZ1YmFKTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779545855);

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
-- Table structure for table `translations`
--

CREATE TABLE `translations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` varchar(255) NOT NULL,
  `field` varchar(100) NOT NULL,
  `language` varchar(10) NOT NULL,
  `value` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `translations`
--

INSERT INTO `translations` (`id`, `entity_type`, `entity_id`, `field`, `language`, `value`, `created_at`, `updated_at`) VALUES
(1, 'hero_tagline', '0', 'text', 'fr', 'Là où l\'exploration se rencontre\nInspiration', '2026-05-22 18:09:50', '2026-05-22 18:09:50'),
(2, 'hero_tagline', '0', 'text', 'ar', 'أين يلتقي الاستكشاف الإلهام', '2026-05-22 18:09:50', '2026-05-22 18:09:50'),
(3, 'hero_tagline', '0', 'text', 'es', 'Dónde se encuentra la exploración\nInspiración', '2026-05-22 18:09:50', '2026-05-22 18:09:50'),
(4, 'hero_tagline', '1', 'text', 'ar', 'رحلة في الداخل،\nاستكشاف بدون', '2026-05-22 18:10:04', '2026-05-22 18:10:04'),
(5, 'hero_tagline', '1', 'text', 'fr', 'Voyage à l\'intérieur,\nExplorer sans', '2026-05-22 18:10:04', '2026-05-22 18:10:04'),
(6, 'hero_tagline', '1', 'text', 'es', 'Journey Within,\nExplorar sin', '2026-05-22 18:10:04', '2026-05-22 18:10:04'),
(7, 'hero_tagline', '2', 'text', 'ar', 'أين تصبح الرحلات التحولات', '2026-05-22 18:10:16', '2026-05-22 18:10:16'),
(8, 'hero_tagline', '2', 'text', 'fr', 'Où les voyages deviennent\nTransformations', '2026-05-22 18:10:16', '2026-05-22 18:10:16'),
(9, 'hero_tagline', '2', 'text', 'es', 'Dónde se convierten los viajes\nTransformaciones', '2026-05-22 18:10:16', '2026-05-22 18:10:16'),
(10, 'hero_tagline', '3', 'text', 'es', 'Donde la aventura se encuentra\nTransformación', '2026-05-22 18:10:26', '2026-05-22 18:10:26'),
(11, 'hero_tagline', '3', 'text', 'ar', 'حيث تلتقي المغامرة التحول', '2026-05-22 18:10:26', '2026-05-22 18:10:26'),
(12, 'hero_tagline', '3', 'text', 'fr', 'Où l\'aventure se rencontre\nTransformation', '2026-05-22 18:10:26', '2026-05-22 18:10:26'),
(13, 'hero_tagline', '4', 'text', 'ar', 'أين تلتقي الرحلة\nالاكتشاف', '2026-05-22 18:10:34', '2026-05-22 18:13:03'),
(14, 'hero_tagline', '4', 'text', 'fr', 'Où le voyage se rencontre\nDécouverte', '2026-05-22 18:10:34', '2026-05-22 18:10:34'),
(15, 'hero_tagline', '4', 'text', 'es', 'Donde el viaje se encuentra\nDescubrimiento', '2026-05-22 18:10:34', '2026-05-22 18:10:34'),
(16, 'hero_settings', 'subtitle', 'subtitle', 'es', 'Inspirar a los jóvenes a través del propósito y la comunidad', '2026-05-23 09:35:18', '2026-05-23 09:35:18'),
(17, 'hero_settings', 'subtitle', 'subtitle', 'fr', 'Inspirer les jeunes par le but et la communauté', '2026-05-23 09:35:18', '2026-05-23 09:35:18'),
(18, 'hero_settings', 'subtitle', 'subtitle', 'ar', 'إلهام الشباب من خلال الغرض والمجتمع', '2026-05-23 09:35:18', '2026-05-23 09:35:18'),
(19, 'club', '1', 'name', 'fr', 'Ensah', '2026-05-23 09:58:16', '2026-05-23 09:58:16'),
(20, 'club', '1', 'description', 'fr', 'Randonnée en montagne et aventures de randonnée', '2026-05-23 09:58:16', '2026-05-23 09:58:16'),
(21, 'club', '1', 'location', 'fr', 'Atlas', '2026-05-23 09:58:16', '2026-05-23 09:58:16'),
(22, 'club', '1', 'location', 'ar', 'جبال الأطلس, سلسلة جبلية تقع في غرب افريقيا', '2026-05-23 09:58:16', '2026-05-23 09:58:16'),
(23, 'club', '1', 'description', 'ar', 'مغامرات الرحلات الجبلية والمشي لمسافات طويلة', '2026-05-23 09:58:16', '2026-05-23 09:58:16'),
(24, 'club', '1', 'name', 'ar', 'إنسة', '2026-05-23 09:58:16', '2026-05-23 09:58:16'),
(25, 'club', '1', 'name', 'es', 'Ensah', '2026-05-23 09:58:16', '2026-05-23 09:58:16'),
(26, 'club', '1', 'location', 'es', 'Montañas del Atlas', '2026-05-23 09:58:16', '2026-05-23 09:58:16'),
(27, 'club', '1', 'description', 'es', 'Aventuras de senderismo y senderismo por la montaña', '2026-05-23 09:58:16', '2026-05-23 09:58:16');

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

-- --------------------------------------------------------

--
-- Table structure for table `volunteer_opportunities`
--

CREATE TABLE `volunteer_opportunities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `max_participants` int(10) UNSIGNED NOT NULL DEFAULT 10,
  `current_participants` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `urgency` enum('high','medium','low') NOT NULL DEFAULT 'medium',
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `volunteer_opportunities`
--

INSERT INTO `volunteer_opportunities` (`id`, `title`, `location`, `duration`, `max_participants`, `current_participants`, `description`, `skills`, `urgency`, `status`, `created_at`, `updated_at`) VALUES
(1, 'enfj', 'rrn', '2', 10, 2, NULL, '[]', 'medium', 'published', '2026-05-20 16:13:31', '2026-05-20 16:13:48');

-- --------------------------------------------------------

--
-- Table structure for table `volunteer_posts`
--

CREATE TABLE `volunteer_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `commitment` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `responsibilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`responsibilities`)),
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requirements`)),
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  `category` varchar(255) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_offers`
--

CREATE TABLE `work_offers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `experience_level` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `responsibilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`responsibilities`)),
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requirements`)),
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  `category` varchar(255) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cities_slug_unique` (`slug`);

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
-- Indexes for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `discover_page_settings`
--
ALTER TABLE `discover_page_settings`
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
-- Indexes for table `event_translations`
--
ALTER TABLE `event_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `event_translations_event_id_locale_unique` (`event_id`,`locale`);

--
-- Indexes for table `experts`
--
ALTER TABLE `experts`
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
-- Indexes for table `focus_section_settings`
--
ALTER TABLE `focus_section_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `footer_settings`
--
ALTER TABLE `footer_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery_items`
--
ALTER TABLE `gallery_items`
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
-- Indexes for table `page_hero_settings`
--
ALTER TABLE `page_hero_settings`
  ADD PRIMARY KEY (`page_key`);

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
-- Indexes for table `projects`
--
ALTER TABLE `projects`
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
-- Indexes for table `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `translations_entity_type_entity_id_field_language_unique` (`entity_type`,`entity_id`,`field`,`language`),
  ADD KEY `translations_entity_type_entity_id_index` (`entity_type`,`entity_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- Indexes for table `volunteer_opportunities`
--
ALTER TABLE `volunteer_opportunities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `volunteer_posts`
--
ALTER TABLE `volunteer_posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `work_offers`
--
ALTER TABLE `work_offers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
-- AUTO_INCREMENT for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT for table `event_translations`
--
ALTER TABLE `event_translations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `experts`
--
ALTER TABLE `experts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT for table `gallery_items`
--
ALTER TABLE `gallery_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
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

--
-- AUTO_INCREMENT for table `translations`
--
ALTER TABLE `translations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `volunteer_opportunities`
--
ALTER TABLE `volunteer_opportunities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `volunteer_posts`
--
ALTER TABLE `volunteer_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_offers`
--
ALTER TABLE `work_offers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event_translations`
--
ALTER TABLE `event_translations`
  ADD CONSTRAINT `event_translations_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `booking_events` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
