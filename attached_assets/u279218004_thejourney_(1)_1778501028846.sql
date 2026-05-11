-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 11, 2026 at 11:48 AM
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

INSERT INTO `cities` (`id`, `name`, `slug`, `title`, `description`, `image`, `highlights`, `culture`, `cuisine`, `activities`, `best_time`, `getting_there`, `travel_tips`, `is_active`, `ordering`, `created_at`, `updated_at`) VALUES
(1, 'Tangier', 'tangier', 'Gateway Between Continents', 'Tangier2, Morocco\'s gateway between Africa and Europe, is a captivating city where cultures converge at the crossroads of the Mediterranean Sea and the Atlantic Ocean.', '/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png', '[\"Historic Kasbah\",\"Caf\\u00e9 Hafa\",\"Strait of Gibraltar\",\"American Legation Museum\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"Tangier\'s rich cultural tapestry reflects centuries of cross-continental exchange.\",\"highlights\":[\"Multicultural heritage spanning three continents\",\"Famous artistic community and literary history\",\"Blend of Moroccan, Spanish, and French influences\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Fresh Seafood\",\"description\":\"Mediterranean and Atlantic catch prepared with Moroccan spices\"},{\"name\":\"Tangia\",\"description\":\"Slow-cooked meat stew unique to Northern Morocco\"},{\"name\":\"Pastilla\",\"description\":\"Sweet and savory pastry with pigeon or chicken\"},{\"name\":\"Mint Tea\",\"description\":\"Traditional Moroccan tea served at legendary caf\\u00e9s\"}]}', '[{\"name\":\"Explore the Medina\",\"icon\":\"map\",\"description\":\"Wander through ancient streets filled with artisan workshops\"},{\"name\":\"Visit Hercules Caves\",\"icon\":\"mountain\",\"description\":\"Discover mythological caves with stunning Atlantic Ocean views\"},{\"name\":\"Relax at Caf\\u00e9 Hafa\",\"icon\":\"coffee\",\"description\":\"Enjoy mint tea at the legendary cliffside caf\\u00e9\"},{\"name\":\"Beach Activities\",\"icon\":\"waves\",\"description\":\"Swim, surf, or sunbathe on pristine Mediterranean beaches\"}]', '{\"season\":\"Spring & Fall\",\"months\":\"April-May, September-October\",\"description\":\"Mild temperatures and fewer crowds make these months ideal.\",\"temperature\":\"18-25\\u00b0C (64-77\\u00b0F)\"}', '{\"airport\":\"Tangier Ibn Battouta Airport (TNG)\",\"transport\":[\"Direct flights from major European cities\",\"High-speed train from Casablanca (2h 10min)\",\"Ferry connections from Spain\"],\"localTransport\":\"Taxis, rental cars, and local buses are readily available.\"}', '[\"The medina is best explored on foot\",\"Bargaining is expected in souks and markets\",\"Learn basic French or Spanish phrases\",\"Visit Caf\\u00e9 Hafa during sunset\",\"Book ferry tickets in advance during peak season\"]', 1, 1, '2026-05-11 09:57:00', '2026-05-11 11:14:25'),
(2, 'Tetouan', 'tetouan', 'The White Dove', 'Tetouan, known as the White Dove, is a gem of Andalusian heritage nestled between the Rif Mountains and the Mediterranean, with one of Morocco\'s best-preserved medinas.', '/attached_assets/generated_images/Tetouan_white_medina_rif_mountains_9ca48cda.png', '[\"UNESCO Medina\",\"Andalusian Architecture\",\"Place Hassan II\",\"Royal Palace\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"Tetouan is the most Andalusian of all Moroccan cities, shaped by Moorish refugees from Spain.\",\"highlights\":[\"UNESCO World Heritage medina since 1997\",\"Strongest Andalusian influence in Morocco\",\"Renowned school of traditional music\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Couscous Tetouan\",\"description\":\"Seven-vegetable couscous in the Andalusian tradition\"},{\"name\":\"Briouats\",\"description\":\"Crispy pastry parcels filled with meat or cheese\"},{\"name\":\"Harira\",\"description\":\"Rich tomato and lentil soup, a Moroccan staple\"},{\"name\":\"Chebakia\",\"description\":\"Sesame and honey pastry dusted with powdered sugar\"}]}', '[{\"name\":\"Medina Walking Tour\",\"icon\":\"map\",\"description\":\"Explore the UNESCO-listed medina on foot\"},{\"name\":\"Museum of Tetouan\",\"icon\":\"mountain\",\"description\":\"Discover Amazigh art and artefacts\"},{\"name\":\"Martil Beach\",\"icon\":\"waves\",\"description\":\"Relax on the nearby Mediterranean beach\"},{\"name\":\"Artisan Crafts\",\"icon\":\"coffee\",\"description\":\"Shop for embroidery and zellige tilework\"}]', '{\"season\":\"Spring & Fall\",\"months\":\"April-June, September-October\",\"description\":\"Ideal weather for exploring the medina and nearby beaches.\",\"temperature\":\"17-27\\u00b0C (63-81\\u00b0F)\"}', '{\"airport\":\"Tangier Ibn Battouta Airport (TNG) \\u2014 60 km\",\"transport\":[\"Regular buses from Tangier (1 hour)\",\"Grand taxis from Tangier or Chefchaouen\",\"CTM bus from major Moroccan cities\"],\"localTransport\":\"Petit taxis and walking are the best ways around the medina.\"}', '[\"Hire a local guide for the medina\",\"Visit the souk on Friday morning\",\"Try local pastries at the medina bakeries\",\"The beach resort of Martil is 5 km away\",\"Dress modestly inside the medina\"]', 1, 2, '2026-05-11 09:57:00', '2026-05-11 09:57:00'),
(3, 'Al Hoceima', 'al-hoceima', 'Mediterranean Paradise', 'Al Hoceima is a breathtaking coastal city set against the dramatic backdrop of the Rif Mountains. Its crystal-clear Mediterranean waters and rugged landscapes make it one of Morocco\'s most unspoiled destinations.', '/attached_assets/generated_images/Al_Hoceima_mediterranean_coast_cf7f8f5d.png', '[\"Al Hoceima National Park\",\"Plage Quemado\",\"Rif Mountains\",\"Spanish Island\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"Al Hoceima is the heartland of the Amazigh Riffian culture, with a strong sense of local identity.\",\"highlights\":[\"Amazigh Riffian cultural heartland\",\"Hirak civil movement history\",\"Traditional Riffian music and festivals\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Grilled Octopus\",\"description\":\"Freshly caught and grilled with chermoula sauce\"},{\"name\":\"Fried Calamari\",\"description\":\"Crispy squid rings served with lemon\"},{\"name\":\"Amazigh Bread\",\"description\":\"Traditional Riffian flatbread baked in clay ovens\"},{\"name\":\"Fresh Sea Bream\",\"description\":\"Mediterranean fish prepared simply with olive oil and herbs\"}]}', '[{\"name\":\"National Park Hiking\",\"icon\":\"mountain\",\"description\":\"Trek through Mediterranean forests and cliffs\"},{\"name\":\"Snorkelling & Diving\",\"icon\":\"waves\",\"description\":\"Explore crystal-clear Mediterranean waters\"},{\"name\":\"Plage Quemado\",\"icon\":\"waves\",\"description\":\"Swim at the stunning crescent beach\"},{\"name\":\"Boat to Spanish Island\",\"icon\":\"map\",\"description\":\"Visit the historic Pe\\u00f1\\u00f3n de Alhucemas island\"}]', '{\"season\":\"Summer\",\"months\":\"June-September\",\"description\":\"The warmest and sunniest months for beach and water activities.\",\"temperature\":\"22-32\\u00b0C (72-90\\u00b0F)\"}', '{\"airport\":\"Cherif Al Idrissi Airport (AHU)\",\"transport\":[\"Seasonal flights from European cities\",\"CTM buses from Fes, Casablanca, and Tangier\",\"Grand taxis from Nador or Tetouan\"],\"localTransport\":\"Taxis and rental cars. Many beaches require a car or boat.\"}', '[\"Book accommodation early in summer\",\"Rent a car to reach hidden beaches\",\"Respect local Amazigh customs\",\"Try the freshly caught seafood at harbour restaurants\",\"Avoid peak July\\u2013August if you prefer fewer crowds\"]', 1, 3, '2026-05-11 09:57:00', '2026-05-11 09:57:00'),
(4, 'Chefchaouen', 'chefchaouen', 'The Blue Pearl', 'Chefchaouen, affectionately known as the Blue Pearl of Morocco, is a mesmerizing mountain town where every corner reveals a new shade of blue.', '/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png', '[\"Blue Medina\",\"Spanish Mosque\",\"Ras El Maa Waterfall\",\"Traditional Crafts\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"The iconic blue color originated with Jewish refugees in the 1930s.\",\"highlights\":[\"Iconic blue-washed buildings\",\"Blend of Berber, Moorish, and Jewish heritage\",\"Traditional weaving workshops\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Goat Cheese\",\"description\":\"Fresh local cheese made from Rif Mountain goat milk\"},{\"name\":\"Bissara\",\"description\":\"Hearty fava bean soup topped with olive oil and cumin\"},{\"name\":\"Tajine Kefta\",\"description\":\"Spiced meatballs in rich tomato sauce\"},{\"name\":\"Moroccan Pancakes\",\"description\":\"Msemen served with honey and butter\"}]}', '[{\"name\":\"Wander Blue Streets\",\"icon\":\"map\",\"description\":\"Get lost in the photogenic blue-washed medina\"},{\"name\":\"Spanish Mosque Sunset\",\"icon\":\"mountain\",\"description\":\"Hike to the mosque for panoramic sunset views\"},{\"name\":\"Ras El Maa Waterfall\",\"icon\":\"waves\",\"description\":\"Visit the mountain spring and waterfall\"},{\"name\":\"Artisan Shopping\",\"icon\":\"coffee\",\"description\":\"Browse handwoven blankets and traditional crafts\"}]', '{\"season\":\"Spring & Fall\",\"months\":\"April-May, September-October\",\"description\":\"Perfect mountain weather for exploring.\",\"temperature\":\"12-24\\u00b0C (54-75\\u00b0F)\"}', '{\"airport\":\"Tangier Ibn Battouta Airport (TNG)\",\"transport\":[\"2.5 hours from Tangier by bus\",\"3 hours from Fes\",\"Regular CTM bus services\"],\"localTransport\":\"The medina is entirely pedestrian.\"}', '[\"Wear comfortable shoes\",\"Best photos early morning\",\"Bargain politely in shops\",\"Stay overnight for the atmosphere\",\"Visit the kasbah for panoramic views\"]', 1, 4, '2026-05-11 09:57:00', '2026-05-11 09:57:00'),
(5, 'Fes', 'fes', 'Spiritual & Cultural Heart', 'Fes el-Bali is one of the best-preserved medieval cities in the Arab world, home to the world\'s oldest continuously operating university.', '/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png', '[\"Al Quaraouiyine University\",\"Chouara Tannery\",\"Bou Inania Madrasa\",\"Royal Palace Gates\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"Founded in 789 AD, Fes is Morocco\'s spiritual and intellectual capital.\",\"highlights\":[\"World\'s oldest university since 859 AD\",\"UNESCO World Heritage medina\",\"Center of traditional craftsmanship\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Fes Pastilla\",\"description\":\"Legendary sweet-savory pigeon pie with almonds\"},{\"name\":\"Rfissa\",\"description\":\"Shredded msemen bread with chicken in fenugreek sauce\"},{\"name\":\"Mechoui\",\"description\":\"Slow-roasted whole lamb\"},{\"name\":\"Zaalouk\",\"description\":\"Smoky eggplant and tomato salad\"}]}', '[{\"name\":\"Navigate the Medina\",\"icon\":\"map\",\"description\":\"Explore 9,000 alleyways with a local guide\"},{\"name\":\"Visit Tanneries\",\"icon\":\"coffee\",\"description\":\"Watch leather dyed using 1,000-year-old techniques\"},{\"name\":\"Madrasa Architecture\",\"icon\":\"map\",\"description\":\"Marvel at intricate tilework and carved plaster\"},{\"name\":\"Artisan Workshops\",\"icon\":\"coffee\",\"description\":\"See craftsmen making pottery and metalwork\"}]', '{\"season\":\"Spring & Fall\",\"months\":\"March-May, September-November\",\"description\":\"Comfortable temperatures for walking the medina.\",\"temperature\":\"10-26\\u00b0C (50-79\\u00b0F)\"}', '{\"airport\":\"Fes\\u2013Sa\\u00efss Airport (FEZ)\",\"transport\":[\"Direct flights from European cities\",\"High-speed train from Casablanca (2.5h)\",\"Regular bus services\"],\"localTransport\":\"The medina is pedestrian-only. Hire a guide for your first visit.\"}', '[\"Hire an official guide for your first medina visit\",\"Visit tanneries in the morning\",\"Bring mint leaves near the tanneries\",\"Stay in a traditional riad\",\"Visit during the Sacred Music Festival in June\"]', 1, 5, '2026-05-11 09:57:00', '2026-05-11 09:57:00'),
(6, 'Essaouira', 'essaouira', 'Wind City of Africa', 'Essaouira is a laid-back coastal gem where Atlantic breezes sweep through whitewashed streets, a UNESCO World Heritage site beloved by artists and musicians.', '/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png', '[\"Skala de la Ville\",\"Fishing Port\",\"Gnaoua Festival\",\"Windsurfing\"]', '{\"title\":\"Culture & Heritage\",\"description\":\"The UNESCO-listed medina reflects its history as a cosmopolitan trading port.\",\"highlights\":[\"UNESCO World Heritage fortified medina\",\"Annual Gnaoua World Music Festival\",\"Thriving contemporary art and music scene\"]}', '{\"title\":\"Local Cuisine\",\"dishes\":[{\"name\":\"Fresh Grilled Sardines\",\"description\":\"Daily catch grilled at the harbor\"},{\"name\":\"Seafood Tagine\",\"description\":\"Mixed seafood in aromatic chermoula sauce\"},{\"name\":\"Oysters\",\"description\":\"Fresh Atlantic oysters from local farms\"},{\"name\":\"Argan Oil Amlou\",\"description\":\"Sweet spread made from argan oil and almonds\"}]}', '[{\"name\":\"Windsurfing\",\"icon\":\"waves\",\"description\":\"Ride consistent Atlantic winds at world-class beaches\"},{\"name\":\"Explore the Ramparts\",\"icon\":\"map\",\"description\":\"Walk along Skala de la Ville fortifications\"},{\"name\":\"Art Gallery Hopping\",\"icon\":\"coffee\",\"description\":\"Browse contemporary Moroccan art galleries\"},{\"name\":\"Beach Horseback Riding\",\"icon\":\"mountain\",\"description\":\"Gallop along Atlantic beaches at sunset\"}]', '{\"season\":\"Year-Round\",\"months\":\"April-June, September-November\",\"description\":\"Mild temperatures year-round thanks to ocean breezes.\",\"temperature\":\"16-24\\u00b0C (61-75\\u00b0F)\"}', '{\"airport\":\"Essaouira-Mogador Airport (ESU) or Marrakech (RAK)\",\"transport\":[\"2.5-3 hours from Marrakech by bus\",\"Direct flights from European cities (seasonal)\",\"Regular Supratours buses\"],\"localTransport\":\"The compact medina is walkable.\"}', '[\"Book early during Gnaoua Festival (late June)\",\"Bring layers for the ocean winds\",\"Visit the fish market for fresh seafood\",\"Take a day trip to Sidi Kaouki beach\",\"Thursday souk in Diabat village is authentic\"]', 1, 6, '2026-05-11 09:57:00', '2026-05-11 09:57:00');

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

--
-- Dumping data for table `membership_applications`
--

INSERT INTO `membership_applications` (`id`, `user_id`, `applicant_name`, `email`, `phone`, `motivation`, `interests`, `preferred_club`, `status`, `reviewed_by`, `reviewed_at`, `review_notes`, `created_at`, `updated_at`) VALUES
(4, 'guest', 'fikri rer', 'elfakirfikri@gmail.com', '+212696126701', 'By submitting, you agree to our community guidelines, privacy policy, and terms of service. You consent to receive updates about events and activities.', '[\"Mountain Trekking\"]', '3', 'pending', NULL, NULL, NULL, '2026-05-11 08:54:45', '2026-05-11 08:54:45');

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
(24, '2026_05_12_000002_create_discover_page_settings_table', 10);

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
('0HrMq6uQ0mYIDz2yotcScfwzS7Ib1jHKbn9qcb3I', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUjlvaUd0cFJwckF2bG9WRUk0VVlCRmJVbXVvakQxNExGNUg4bUtKQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6eGlkcjNuS0xKdkJCbnJtMiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492107),
('0OVMQqhnXwTOAcJjIs966zA8josrOJHflQ5uWdBh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1dGZ1d6anF3azJuRlQ1T0dzWDFGRU0wVmdNMmRucEl1ckdkVk5rWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778500048),
('0Wwo1eAdOrTchPsGJUnJsXZpnwK4dG4gDACEh5z3', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTWhuRTk5aGFEaHFta1RxOEhveUxiWVhFalhvTGZ5Unc2djdtZU10diI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494160),
('1OHA0Uo56RqGnY3cO2DHQOLiOZf4pcAMuyN6y82X', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2k3SDlwMzQzdUY4eVNYVGc5N1puMnJNNVJFOGxzN0tXOVJibVhsaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493693),
('27ecif4JKapVIJQ6rKi1DSSYGWfYp7Iz9nADW8v6', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicFNNTlFUcEVTbFlCWXdwVU9XTnVuM3V0ZEhhWHFHeklUMGx5ckNtNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci80MDAvMzAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491024),
('2coVTxXZvUhg91wPfPxj1tyaGATci3IglATHo0UT', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQlZrRFIxSTVMSVlIMGRSbHVZZ2VnS2pWS3NHOUZ3VmJlV3RISHE3eCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490990),
('2GCIFHFKOeDMArQEggLYTgW4ghfmBGKD3pkJRlPi', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid3VwNDZRUnVKWGtaVlZwNkx6S3k2cGtmVkNPVmwxUjJxUHpNYkVCaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778491051),
('2u0yaJDgf8PTseEzzNFM5fQlL3WYEbn4usDIl0xZ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmF1Q0NHdVpBOXhOSXRSTzBpQ0VwSU8wbnlIQzdGcGZ1WERmSGtaSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490499),
('2XNYiIWoyLgwpApeE47anwUu2niaxcTtvNugniZ5', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidnlyY2t6NU1jUUZLTVpsalR5SGlFbHRwSncxV1ZBVzNVREc5cUR2cCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci82MDAvNDAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491024),
('38licEdY6ybH3nSsPBYgbdxlcGSLHITdW8NY1c7g', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN205Z2hqdk43TjhjNVlUODZlbXF3aFRScWVxQjNrZnpBendkS0FKSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778497158),
('3IZnWuxu7GYGX6YaFr8xyHn2hG3pu1adQYSYoMhZ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRGFJWkVmdndsQnpJS3ZvQm11Sm5QdHBMVWhpTHNIZFJxVGFqZ2NJSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778499879),
('3N4N31LnjKe7dQnqN0UyrtbPu9c7mXDnc0be0Fgz', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRzBHOHJFMW1RSWt2TTVmcjduQWQybjRyT1QzaHNkQWJhQ2ZqMUgxRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490631),
('3VFaffk7aOM6mClnioNVqfawiKzJwCQ3Qsrx7EXD', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOThWaW1nTENMM0dJc3gzdDgzelppVllGWXpBekkzd01HeW1sM1JoZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490396),
('3WdpWJCT744ucspyJ2OkNqYKmhyZxTXiNpFbke8X', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQmEwTXVoN1Bmb1hPcWhVRUVabHlQV3NBMThHaEZJbUszZzQ2Q3J1bCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497185),
('4jmgAiYajAguteMelPrC1dZuVfVbWTLgUDsR2EmT', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWNjdWIxTHN4UDBtOHQyQkpnSzBLaDFKY3l5ZVFxMFVYRVJTRHI5biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490321),
('4jwbZlS1DLyfjfa5CwCPJCfyLZlGMsW2ECuLxN16', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNHA2b2l6RkV4NVNpUld0VXlaZ2xZSkZoSmJxWUhzbjJSeWhxTmV5SyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778494160),
('4pFsoYmnvXBLwTemirIINauPWDDw7EE76GGzImE1', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1NDRmV5NVpJMFBlMzlkdFh1WVY2TmxtcXFjNHZOOXdPV2JHN1hoQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490384),
('4QLXdevbwFUITK7Ri4S3CzQ2G54cl5fc8UI8UJxT', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZkNzQUxXNnhOQUJ1aGEySVk4Uk1OZnpFblJiellYU2x0NFExV2FHNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492100),
('4Sw66tlKgp7R0GHa3HJecSf5XOu9v8WoDwuFcdd6', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYTBCbmJScHhqNzZ1VVNLd1BFQ29GRGxvWWVNOHNrbjVnOEpKbU9BeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZWRpYSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpDQ3o5bDg4ZXM3alowMzZlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778495851),
('4VW1wkGAOjOf4sPh7DLimCqU8kdv3gZn8EjlYtkn', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYUpiVlFUaDZ4SEtrZUVzQ1pNT0JROERoMW5rQkU2eTZ0dEU5VHJobSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493574),
('54hjfPX9ulU1nqeERe0B3CT6CZgL64q1rok7t8jM', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNGtXQnV3d2tRWkdUaDdHamEzZDQzOEpNSlF0bkJBS2dZMlhWSVlQWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493709),
('5D0dxprP4DEyTSk18g3klLN9vrgC2hAShzRbkAxy', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZExRUnpMUXJQcG9TRkhlWUQ0TDhhalI1eFRJQWR0YjFoS05OYldpcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4UFBoNnloVW5RNUltOGNQIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492592),
('5oaZ7yqI7bO5L27accCWAif6eYcwCnrMnqXTYPnV', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic1IyU3FzZ0tDZ0Jva2dCb3c0WFVSeFBsNjU1SzN1NmFmcW5kNEsxUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci80MDAvMzAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491071),
('5rZKIfea3Y2MhG1Y7czCzTTE2JbPAar9DJeJAWgR', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid1ZTRkpuRFJFWjBpS2N6cnVwRE14Qm9wUW1RTjlxYkJHcFh1Qm1HZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490381),
('5veGr95UsAurZYaRDca8fi8DiW1fsrQDYaOsfVSE', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnVWdlplSG04bjhsRzh6TXdMcm5welQxUzJacVR2WHJvU0pFcGYyQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490109),
('5yuebfeDRJHUJDe1cRRpqNbOM5pPIFS3CefK9rAY', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVGNINGZLMjlncHBMN0s0eUJmTU1saUdHbEc1QlZUMlEwRGp5QlVNdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZWRpYSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778491024),
('6BXiOk5jHsflhwZmMHMucOiggDAzBQRA2n7dGAQy', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidXppb0NyMU5jc3pTczZxWm04R0F5dFRMWWFtMXBqeXVxc0lleTRzWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2NsdWJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778490151),
('6FPAba6zkeO0YTM55MD6OYOt9NRYYaStXJcILu9v', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUmw0TjNOTlVPT2tldE1GSDBlZHRQNUl4Q0xVcnJHZlQycmdZNlFZSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4UFBoNnloVW5RNUltOGNQIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493208),
('6gK6JiBD2l1CSS3xSHgrnK5pqS9wBPo56J5LN5yS', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVjRJUUFQbWcxQWNLaHZMVVFVN09zVmUzSGhVWG9OTFFVSlVlRjBNQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493708),
('6GuIbkM51cNnVK1c4VTpe2m6k9eN8pV3wBPloBET', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaG8zV1VFMWgwM0IwTDM1MHltSGhVMDVCUTF4cE9yUzdkcGhhb1dheiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490400),
('6ikUs4yjEGVlAe1OlWdgyaRnIOfY0F40kxPYYJox', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic1pXUklSTUMzYm1qeWFTSTB1WTM4eWZMcWh3VnBXSG02VnBmZk5FVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493582),
('6q96HznoE4DLySTgSRsGlqs2gDhFaHpK313mkTvl', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWWtQZkhoT1N1RlhEVkZwYmRtRnlxbkEwbUpIRDhBTDdPQ2RXQkN2NCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493518),
('6TFvDKhEFQdD6FR7vbVvJzCIl8IQr4qSac46SytM', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFRwTVpVYWVrWXB5YWVzYjlsNWxzbnJGQ01zMVFDTXBScUwwNlRFSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4UFBoNnloVW5RNUltOGNQIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493310),
('6U5bnDxeCjHdp5qKbwXM0tynKqiIWgct8YYRtrXj', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMnpPTkRpd0xxWFVQVzI2VmNuVWRMZmRiOUxWSmI2ZW9LMW9WaVNuYiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493490),
('6vRKFZix7UIIQikNQibHgz41G4bJmUxF2ULu4WNm', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2dFTzZJY250T3VFZWpOeElIeDEwSlJFVDgwMGF6eFlDT2tES3MyYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490632),
('6Wp1jSlUp87GxmX9M6ZFnK0U3qiCszk5AbpAA7DM', NULL, '104.196.0.226', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZG5CSnNoZzdWUFJseElhNnM5WDM4ZEF0N1RSVEhzS2ozbGpaVGN0eiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bmhtMWlESTZnMG9ud1hGdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492506),
('7cs8PMJ8aSN1KMnTOKkfsQ3n1qHNubkxhyAwOyqk', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib1RselA3anRtU2Y3bW8yY1hYeTBpOThEUXZuRmVuOXdnQ3hEQzFPVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9zdGF0cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpidmdqY3ZrTDhyUkNmbFg1Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492591),
('7iNFzbJ2D6w80IHL9dcaDaCWNmXPhRy8XYRJYpSo', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUWxGNkxxS0ZQNmN1NW1zZzZiQ0Q0enNxME1XV1JNUEZYYTlxQmloOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZWRpYSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpDQ3o5bDg4ZXM3alowMzZlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778495858),
('7IvRXHhlgLAs6yM7Z1X50mBFoMI7atrGTr6WhvJi', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSk5KbkVsS29QSW5lOFU5S3R1TnIxZVpUTDJvaVRlbnU0WkQwcElIdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778490631),
('7Om781S0O8fjzXf61GT8jmBY1JMsVurmuGIDbSfO', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY3JvZHVVYWFRUWNUZUZmcUdFOEtvaXlGbmJVSjFlemluV09tUkFIbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bmhtMWlESTZnMG9ud1hGdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492982),
('7PtCRbmntFnwvIr9LnIjvWTIlNBy94SAreypwcRk', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiczZsSVFKd3A5RDdZalJPOEZiUGJhWkpUaDliVlZvUGh2UmNUcVFrUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490993),
('7v7PrrZruyOP1OnnzC8GKBVV1QLDNBDYQjYacXSX', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVEZxdjBxTzVuS3VkQTh5RTlCcm5FWmRVUDE4STB0RklWbE00OExwYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4dTM4RXRXSVZMbzUwM1VFIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492636),
('7XmV44hF2LfVyV0R1UEsQY5RYBI1aaFf2fjf151P', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2cybGJtVk9mV2VBcG0zVHJtZkljQTZXTXdYd0xuTG53MWVVdDJPVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495674),
('7zljvlzesNnn0tDz7tOGmgtsqkvBlECyAr8YHZpM', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY1NsRjZBWFlrVmU1enc0VlE4cGplTWVpR1Ridjl5Tk1xMlJBS1pZQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490406),
('82spNLo8iyXouNYjypGIdZqvzjlJYsJr6SkTis7D', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmI0Y2JqNFF3OURmN1N2ZDlvRzFyUldWSzBDU0FaMnRwOFlVdkhyWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci80MDAvNTAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491072),
('8APR31vJSlNHQCr4XEj4YPzRWslF0Yd22plltr42', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY0hwaVcxQ2JSelM1VkFncjlBNTh1WnBuQlBFd0tVcWpvRGpvMWNoRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778491069),
('8bckT8ONBXKe2a3vZEqLprLGNByvXvpGTq7Lu93h', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSlA5SU5MelB5dFF2eUlmRFh0bnpGcGliYUJoNzc2TlFURUdFMG4ydiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778497156),
('8Cq1HBZBwJE0Oyvv2jqqFw7Rqp4dK48eWTQdfL0C', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNENLWVk1cFRTQlJNbU1KZDJESXZwRDJFV1RRVEJsbjdwQndlYjY1YSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2NsdWJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778490643),
('8hCHCG0H7uY8HDFYpXEni0erPtHs4Kr2XBjFT8kC', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVJ5QVJKR3VOZ1U0VFFQcmpUWjVtdG5NMDdEU1dlZjBXbm04N1BTVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490499),
('8nkQ7J8cCqalbKLGzu1ItF0EprLwjeBjKl3WhPdG', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUkM5UmdUbGZKTWxUSmdUdUwybmYxZEM4Q2JrMkcwYkJsaGlIUjBKaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494845),
('8PFAwCkOcamIxGdhnHUH2oHKJQ2VMw6UxmaRTCTt', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVnRWc1pCMlFoWTExa1ZOc0FaWXk3N2FPSTVhVkpleEV1YTlJdEFyTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMvdGFuZ2llciI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjoxY2NyTUhRNFpsZ2ZOWG9yIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492167),
('93Jc24fSCarAbIp7a5BNgD22UiR10h8NV07eTb1Z', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ01tcTRmYkMwUHh6dW5LdXBCeTE5UUMzRHl1REljQ3RuRW1iOHN3RCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778495162),
('94RhcKUUWt7Os7bCEctCJPqz7FcqAGrzTYZBkan8', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTzUzWnExTXJ6cVl2eU91Znc4U3paNkpnSHlhVEFnTG9mQ3VTZ2FhUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778491921),
('94TrLxDyLrjCgZ9X0dC3XfJARQmZUeLYzFo6XmDw', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSnJPUWFCWFNxbmgzMVQzaml4RnRuQTM0eTF3ZzR3REl2SEY0S1pKciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi91cGNvbWluZy1ldmVudHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6a0o0a283YTg1a0h5UTQ5dyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492412),
('96dQJp385qfdvYDbHXuFs4iGT2F7y4N9wjralioa', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNVJzMVA2MkFDcnRmRW5xVlNQVnlOdDIwdkhLc1QyUXlPZ2xqYzVMNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493005),
('9bAv34mmOOeIV7AdPJ4jT6jpIfMOmqZRrxkLZl99', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidlQ5UE9hNWVuVmphbFFST2JvVmxpYmRucG9OSGkzdlRWeEhaVll3NiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494755),
('9BDI0ZxDkrDTNeGy0z6yoGX6YFNKxnR9k8AVT7EA', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQkdEbU4yVWZvd0thSHFUMDc3UUF5ZW54eTJxVDRSSjVnZm94MEJGUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpsdDRzcWlFVW5lYXBlWld2Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493476),
('9cf14qVotpUqoNJe6rLPlAt5uk2dgiv622rFpvUv', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2pjc2lIbHNPTGt6Qk5lNUVIbERKWlY1T2lqUlhXaUFsVVNya01IWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490631),
('9j6WSwwFzD1NkVvLNz6tsCEuB07tNsqh95nz91aF', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2Z0TnFISjRzTUdhdGk0UDFJcHNLTjgyVnY5UllEcWhLZUgxSFpVYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778494218),
('9yiWwzR3yDNE5ODwfVm0zdUL0DDsTEg3FQqNCk17', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHp0QVBrNHZmQmdMeTVnVmFuTjBEdTFKYUczOTJoUW9zamRtZ1U3OCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci81MDAvMzAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491071),
('a9ZQ63kDWNfSZiDmVxeMYrRu6qeIWjlB5NFkElol', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM3BLWjJDbUZJUTVKblBraTc3enZ4T3lHaFlYUXlFNVBxaUI0S0lwNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490624),
('ajM2gZ64tUmrSNY7XPNWQw51aeqWEsGzD4UPuFdT', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkFNa2lrRGpvSENsVFVieDZ5R0pUR0ZvcldyWFV3YTNGTm5tUE5iTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494834),
('Am47vYcOIRRLQDEYuYHK5NkI9I5JAvgHotWnMnSz', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUFNJTjhOc2J3SmR1QWc0NWdhNHVwU2xuUFpDQmt6Wkxva0lGaUlIbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493821),
('anBWwCqwz63K5Z4JNR4XabhjPt12mjxz8jlbmOfJ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQnR1ckVPMkZEb1dNT1hxeU9KWExEclVucUlLb3lmRDNOOTdoVXB3RCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493038),
('aoE6zg1iXC0n7uFMVaPuxksFoqfJsld8JRHuiXTz', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFFuVVRyQ25ualpZWGxwaE5QZXNvZmEzSVlyblg5MEpNeXQ1TlYyaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493602),
('aPvklib1upwOaS9K8vtfz2gKH2XipjHmAJTALBVJ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicVowSnVjTGZJQnI5RHJ4eUEzVlEzdHUza0JMTGVIbm9tSERLZU1wZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493708),
('ArckNYMaGVBdyP9sDl1EBKuwbqWlVwoi4FzYZzJR', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOXhDMzU5RVZaeUlEdVBwU1pTdmpDY0U3OWdQbm5aOG1qemhwSnVTciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494965),
('AtCnRXA5viXbNgk8sPM9brg9JHNrmpOJ61RNvoWj', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUVjNFA4dkRxazBBdTgzN2t1bzZNejFGcXhlNGo2WXp6NnFzcGZ5TiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495821),
('ATTMvT6CciALYW9StAnnSLcZwjMESjjkDNZkUe2K', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2tPNTRBcDVHcTRMTUxsSVpKdVB1bFNkMWNMSURmM2twT2pCeHZreSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494399),
('au25YeoQAWleN2GAGf5BznuX22EM6FTZsJ8OCaXH', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUpKSmVtMGJRa0dvOVhCeXZKY2IzM3JGRjBmSXJpVndvenUwR09ReiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bkRJVDFuN2tiT0VNR0ZlTyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493578),
('AVPz35urLnv7xdi7MeKxbZlpGSZhNuSMFEMI5YQc', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWjFsc08wMGpxTkFnMndEZU9IWXRWeFFpWEdPVjZtQXlpZndXanBMRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvc3RhdHM/dHlwZT10ZWFtIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491364),
('AWQqpepA7pArRFFeTB0iRlORXJLqiMgLCiYvrA7C', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0R2V3BrNFE3emJQc0EzVzR0NmpjRkRhQTdIUU9rbWllakxyRXY0aSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492088),
('AxLX7mGnppDgMN1Y3W9zTLdajEXxnZeTWdb1PFuo', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRVBaTHQ4eWkyVlNLOFdmb3Joa013QUhORmJEalB5MTZ0amJpd0NvcCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZWRpYSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778491071),
('Azsv4ngYWa9UqdFZlnWRZNkCgOeM0U727FGbRVdo', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicEl2Z2U2SkFJVXNIYUc0V3R0T3I2cUFUbmprTkFUNk84Zm9FT2NBZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494868),
('aZXJNzHOdTFyo3f5L0Jqz4R2GUCjv6BcRDJ6acmu', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieTJFRk9xU0VOdkI1Q1gyNFUxeTQ2amdVQmUzWG5xNk9IaGRTRTNMNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778498070),
('b04yvqZZVSsmLTeFxrq7oC1mOhEgVqtbhgIMSRZt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibVMxNXpjV0Q3UkR1R1NXS3B5QlBOYzBiZkNvcGt5ekpQSzE4dk1jViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjowN1k1NUF2a2htc2d1VDBZIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492903),
('bajWkl3MoF4YVv0OiOvdPMs4MM1o1fgnaa3i4iIc', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUkR0aTZDcjFjeHh3eFdrREV4Vk1md0NFc0Mwa0Roc3ZnSmdWc0d4MiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvc3RhdHM/dHlwZT10ZWFtIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491684),
('bDyZdGph1kpOa4WehN9yOD9vnoDDACXa32bhsOaM', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUzJ3ZnJrZm54a0c3cWFWUTNrVzRiUW1JeFVNbVZXRWpHeWl3cU5vUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491921),
('BJR4jmDYezUNZpcmKSoMoWVhQ6rHX9G6qGg8lmRc', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTVU1MHhUemZJVGxNb2xtYmVCdjNhTkczUndQVnhub3JzcWZOMFVRQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494814),
('BLDY46rc5nVWs5XDiWtF5tghDcqu8Ln0QCQSeKWP', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkdHRnVneENFcTJRZURzSHU3aGJOU3N4VTM1amRWeTE4M2RPRXNkUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494845),
('blvv23jtWOmtCH7HqV51xtl8mPlGkUfULivS3rWV', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT0xDUll1ODFRM05pNHV6dEFNREs3eHBPWWwzVWIxZ0ZQVlIxNlpwQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498070),
('BMr4CUeh7nCcTT19ZiDTihjHJ5MQE0jRx9yuFPm4', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzJFeFVIdWtZVnVhR2dESTRLRk9SNnBOekxKdDh1clpRZjlla0EyaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778491684),
('BnNW2k2KLTdOkwhEkUCmUwW4ydDxnMzThJy5ddgU', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWTBoc0NMR2hSajNJWVkxYm9BMnRJYXM0QXRDR3A1MkRDZE4yQVhNTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi91cGNvbWluZy1ldmVudHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6amhNRFlPY3IxWTA1OGlEdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493490),
('BQeTx0fTCQWbonLQAzBuKKTMW42F9a9EaEfS0U9X', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMER1NzUyam5XeTdIdUp4OVdXeHZxbjhzSE80a1NnZUlyckp2eVhvUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778499122),
('BqHsRhka65gPKfh34c6PNauyiEP0KCo6xzk1rz7U', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDZ2SHVTUTJNOW9ZUjRGTEpFRDN1WEpxdGd2Y203YVRyS1VPWTRObSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmpDSE1Dc1FZZFBBbkFtaE0iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778492023),
('bQvAvlAqz5Vlac9tSwu9ofTSKZVuzhg77OwzAHj1', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNlNNVGNCR3BSVHFIR25LUmtKeGdhdmd4VVpXZEYwSzRtUDdPbVIwcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498045),
('BTcXZzIWoFpnwNj2uj1jDTnZFZnzZzRSAb0kf87a', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUzNjYkplSzkxWldwRElHZ05hdTRWMUNLdmMwc3BrZ1B5SGY0dVhmYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMvdGFuZ2llciI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpRejBSODF0cHY1MWRVS2NYIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778498075),
('bwboL19DfCfuINvg1XOKWYpCdc6f242ktDIjsEmm', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUpYOUs0dU5jY0tTdXJrMkN1REhqN0pveDFUOVgzME1Rb0ZkaTlCUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778493578),
('c9G3NWzsxXpcstbft1q7Ol2QGzPZeNMFHiEyW9UO', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaGFLYzBYSmNEcU5qUXNlSE9xQWhkZ0syTm5nSDdFODVvN3lZSGZNRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaGFydHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6azI2dk5MVExwUGYwOUdxdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493490),
('cDYdw1flqREWhsSFhjlS1YgF6xnd7UmI7il2KCe1', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWkdJeFlUV0IxaXVGdnlUZkZJRnU1dlBidzJyVHNNVlF2TFVTQnJnRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493476),
('cGbJjZQ1kUHdnTMOuLsw4rDoM0iqO32hpvwiutM8', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidXBrMW50akRrc2NBWlZoc1ExeDFUMG1YamN4blVMN09scjhtNXlpSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9zdGF0cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpidmdqY3ZrTDhyUkNmbFg1Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492619),
('cHL3f6IEL3tHMo84LvdS8mNZzVD98JFZnWveM0gm', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiemtGRHhZTGJWNUFYZVRqVXI3dTVIbmM2WmVvcEhjSllyTXNzSGxZbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490396),
('cLvDLpr4DVrAVpbhioAUcLuCOOPuFhd9UlrH3EXv', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3V1UWZENjlMNjMyWjlCa0tEM1VNYTAzS01WbVRTb2JJdVhJeDdjcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494158),
('CrIW4aSIndQSsqtEJa9cey73Hfjee44afbiUT8At', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidm14aUhYS00zRWdtc1A1NmVscGFFUGEzZVNTWmladktoRHVtSkY0ZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bkRJVDFuN2tiT0VNR0ZlTyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494222),
('cS3rxIsC8hntpyK55m7VyzaxLYmXPdy2WFoXZp2D', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRTVEd0lsTWsxUmZJWGNqWERBZGlsTDR3UXh0UTVQRXF6c2RGeWdvYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4UFBoNnloVW5RNUltOGNQIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492982),
('CtSW8UQXsjch6eb5jSpPXy2YerEmU1LzpkziehAh', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieXppV1gzMGNoTnRjNHd3Ylp3MGZsdlBxRlZPbXExZzVXTUh5SUNHSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494338),
('CUZ5ZPsGsZVIL2CTVUTA6HBScDVhc46UlryvHCjo', NULL, '104.196.0.226', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieERtdE92SVRQMVVVSGI2V29rUEtscHhWQXdSa2ZhczJIcXJadHY1eiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmpDSE1Dc1FZZFBBbkFtaE0iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778492506);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('CyGZ2aYrZhWQ2hq1Ifyw1beRMUd4VtkHzhtj4mXW', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzByZnZURVNUVnpMamNSdlltSlIyZUNtMURKYk8ydWFiQ3Y1b2xtdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492029),
('czYuUoUDON09oXPAJVbWoabEHKjMsewMVqJ1XiMn', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMGJ1ZmNvUmFKelVQTVRRYXo5TEVoR3JmUVdwdFp6REk5eEY0RXdPRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493693),
('d1uNtGf6SfKeaEXjBmbMXnnuvYW2JRoK2jy3hMHU', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia1NSM3FSN3NIbjAzQnZ2aG5TT1BiaWhMc2IzMDlNdHp5WlBCVXpEeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490327),
('D3cnbGwtivziBUwm2HvvkNmms5pus3Mar6J9G4ij', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiazVaeDBkZlFiMzNXbzkxNm9vcDg2TTlTUFRiU1FYaW9LaTc3TGtvOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490310),
('d6p3MKoqwOWxnH7F3XzLowIWdyQV5E27dgc6xyRh', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDNQYzQ2c3Q2VmtuVFpXQ0RVOW82cDU3SlBnQUZiZmxnMGVrUGM2VyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490389),
('D6ZjS9M0MTywAiPi6v2WHj6j6TubPlku71XlhGLD', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSTBpcTlIY3RlQjZqTW01OUJwT2R6aFptNUF4YnZ5SWtaaHl4RTlBZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493516),
('d77csnuLXF8nnytwNZQFuahVViqUGNoI0WfGrGnL', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibnlnVnFkaGU0UjNka3dHb2t4T0xkMjl5emVZNVd4VUFKSXJzREZ2QyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490327),
('D9EwRYMMbTMYd4EEWZCmVH5Hxpw3ucuTqfFcAqeA', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2RFZ2praDluRFhYVG5pSEhUVzgwN1VFSDQ4TmRqRTY2Q2tpNXNHNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hY3Rpdml0eSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpJem1tZVhJaFYyd0RuVk5jIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492412),
('Dd6ndp1jVNppXF7kD5jHiJFSpuKZItwFgfov2xjq', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQlFxQU5QWHlMV3JZNkhmaU8zMXlzUzcxajJlckNtakdISVdzZmlGTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL3NhbmN0dW0vY3NyZi1jb29raWUiO3M6NToicm91dGUiO3M6MTk6InNhbmN0dW0uY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778493436),
('DDGoG3kAgmgWDgl9KftGdK1UIArbiD4fW4W8SSnc', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV3h3T1A4c0RHZGs4UWlxbGZsMUlqTzFaZWVlaGtER1ZJbXNadk5ZOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci80MDAvNjAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491024),
('DFgVUklcsRlqRwciht7uJlMEbyk1MkHDlppuOUhs', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWlZTS1NmNXNVcUR2VjdpaUdUdHZXR2NuQTFhYU9nRjdBR1l6QzVzSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492135),
('DGSubH7jTjCNWyo3SfuURZlXi3Hcd6omuRv9CH7I', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSlBvTUxWR3Z0dkUyUGFjbmUwV0VpYmJlZkVudDVGM3MxTHZyZ0RyWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493546),
('dGxjcxnqnJsxHmRH0sxtuq09LqHsDUamNpjs7bsB', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibVRZNHRlRW1xSzlqakdLREpGUlVXaEJMQlFMblE1SDVIN0tsWE9JMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490502),
('DJqJBXOBnEtnUDp8x0hgcyGSMJhg7UEwUcHG6eXD', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWWwyaEZ4em1iZmtmeUxNWGR0ZndkRDh4MkM1dTZFUm1hWVM4WjdkNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778491330),
('dJUuO0416xKZzmR3iSP2BL7laRWcbpW9dBPTw8vm', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUEdLRGpaS1hsM3pwVXBId2dJdEg3N1NhN2JjQ0JoMDc1NHMyUHFXRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490381),
('DkIF7WHOPYtsk5E6IO5CnOonJHm0vR6TKX9msite', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibXlzbFpURmJKNnVheUxvR29wcVJpallDdHN6Q1gzQmJEVlhhMGJ1cCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494275),
('DkK6S6TgyXHuE0G6eDBCQdIqfJt2HQUFFVL61MCo', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWUhSQWFHQ25UMWwwdnNpWUFocFdWaWhLTTZYM0VZRzdyN2pRbkpVViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495470),
('DPI5vWAFbirw5j9MDScBocEHSDTEb5c4bCU3dySk', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYW9oa0kwS2t5Q21UMGtBSXNGRklOZmVLZ1Rkd3BZb1Z0aWhIS2s5diI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490396),
('DTXnnutsj2JXDNSP1R3k7YJSAqsK3eGhbVIwqWLN', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSkJabk5SOEQ0NVBra3dFWm53ZjZEbHlmUDBIeTNnYkVDUnVrTmkzcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL215LXRpY2tldHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490384),
('dur5XgqfaWkgJLeJoZTH9Xp9jNd4MYsU4bXTIuD6', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaXFDcW5NdlJPMnUxeEp2eVdYazJaeHRjd1psZVNSQ1p2SHg4Y05PZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494245),
('dvvJId9EIe1yj2AEjFB5PnIV5VLKjorsoOgUxfw7', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMTE0VFlSSXNkQUVacnRoSnF6WnBpaWZIbmJRbm1sdG1xdlpwWWRDUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490993),
('E2Td5mmLo3MwZfrwSkBzjHUrLmE4a3lmCG13mwPu', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS0NUeDRSbTV3UlJhTG93azhFczBkOEFVcVJLS0ljUmwzeVd1ckFHMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490631),
('E66pXqsg8CiSfMaTa9QEjv2mrjhJOUVEIZchjobD', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUWN0clpCc3N5UXVUU1RFNDA0SGdvRXRzNHFJMnZwcU52ZTFSN2NnRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL215LXRpY2tldHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490643),
('E9BSE3SG4N14fbqnXFFsa1SMiputeu1KpkcxjIHM', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRXpxSEZ5MHRYWFVEdXpJeWJTYkt5OG53ZkVnZkVNc1BrdXZ0ZW9KcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493574),
('eapojvqndcj4qyssMIOAspsjyfPSqKr1nRMKVjl1', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2ZSb3gzaVFZYnpLZlBkSDZJVWkwTFZJSVp4Y0laQ2l1MjlCblRuZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490438),
('EaX2c124rg0esPta4HSW9a4gZro53OsyArpDCRuk', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidXV1TjBJa1VvY0FSMUpvMEh0TUlmVEtzVUZPT0I2TVUwc003UUJRMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci8zNTAvNDUwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491025),
('eEp6OtzfHodm96nPPIw89za7Be3ZtGE4VVYKRv49', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZE1acHdBV1dOdDlwU25NU3I1RG1IYUFQYVBMc0xjRXZ3QUppSDNrWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci80MDAvNTAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491025),
('eetGwbpvuXw4QOQyK8worFoMDRONlobwh46Eqx7y', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRHRTUUFhc2EwSG5SUEozc29XUGdJOTVmdWJON3R0bUh1cVdGYzN2WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bmhtMWlESTZnMG9ud1hGdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492903),
('EFgDlGNi6gCfwrLaxjfMIdP26akMUqpeJoxktRDC', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibVZuaDdxUDgyNWpDUDFIQkMzVnRFbjl3WEh2S294ejg2alZvaDhzNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci8zNTAvNDUwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491072),
('eH12Mtw6R7B40zwhVcJGkBc0oha7sKbUmCMaVmmG', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2pna2N0ZDRtN00xd1ZpZXhIbWVLTUZOcldPU3dTcjNtNTlDZXFreCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6eGlkcjNuS0xKdkJCbnJtMiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492167),
('ehCnhAMCGTvFipmMb1YnPq8WXISJ3DmylpoRyFzI', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY1BlNHJVdGJ1SVM3SHB1d0hLVGJxZXhST3FOZTkxeGtUUmcxNkFSYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490622),
('ehj5kEaLtN37YgL6plDRXvaWXh56A2J3WvG1j5os', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRVRKRmVyVWlXYnc2SnVmeGZaMFlQaUVKcHBra29RbXNTakpnTVFVMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497158),
('eiZNM2RBRVZZc9jGlO5FoCFdqfNbjVXoJjvt1j1t', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieFhJcHNlMnBkbzZPQUV5YXd2eHY3ZkwxQ3JDU3JLNk1lT0lCYXh3aSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490632),
('en4cojUvRCDnab2WJ19uRXRSluPRrc2pnXI7Jl4Y', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHpxSldJVzFHeHhuU3hCdWxzcWQ2TlQzemQxY0pGSVVpeE90aGNJSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778497151),
('eN9SnA2VBVQimM7EC52mf1NHk0u2QQGfI2USjb5p', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHFNNnZUOWNMRXc3dHJMck8ydjFVM1VnTko1Vk5VbnBMM2w5aExBaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494349),
('eQMjcGqcSyBG8GxGD9MdPJOb1uZeGhQIvt7RGUc4', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM1l2dkZlek5jQUpYOFlJa0htYW9GbFUxUzJCUjVBckpvWkVNaVlwaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmpDSE1Dc1FZZFBBbkFtaE0iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778492048),
('EqWjn7Yp6VPjiQib23nStJLVbrgi8smelrEoXREU', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRHNab3JRMVdBRE9Cc1pnU2I0bWo0d3RrSG93MDduYzJ1Z0dXanhqZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494755),
('ErOj8c8zYG7YKY7x2syNXIjWcTxbBzTWTSCKEjEJ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY0kxdTlJcTBEN3JwSFNEeTA3dzQ5cEZPaDBGcGpUZlhGekp5ZThEUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvc3RhdHM/dHlwZT10ZWFtIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491247),
('EstPrGU0ONPNE4mqBXWmt2CKQfGiAyLBQaSFbR8n', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibVlCTk5yR0NPWG5Ca1E5Y1Q4WkVzcjRjUWJvc0JjTFh6aXFvNlBXTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498952),
('Ev1dFtOARtJ9otwRdioY0rlF7aXLTAfcIgrXcKjD', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieGdQYmdiaHdFWlJodU9SUkhJVVplSFFQRnhiUjBPdDdrSWMxYzBqNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490629),
('eYIZslGnWLGU5sDNayUmTSWwdietEoSUV2F2L4if', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib1NNNEEzcVBERVJEWkYzdldxMHNUdXdRdE45VFIwY0x4VFBoUkNHMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490625),
('f5EzrcpwppFdKxQw9PsYn4iuKjPox1jFV1xgupgV', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNTVZTVlYM2FxbENMTEpaNlZFNHp2QUpXcmx6SHlNakxXNjF5djJSVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494965),
('f9UsrUp1wvdg9Ht8lSqek0stAjoFkm2KYu6xq52D', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkFUNnZ0emRKeVdJMEdkREtHcWg0Umw3bXBDTlkzTU1sQUJNb0dxWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMvdGFuZ2llciI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpRejBSODF0cHY1MWRVS2NYIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493539),
('fA2uWuEVYlYQM6EUX5217gdxNcbnUG42jNXARsMS', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMFVwV3R2T0Rvck42TGRlVUt4dEdXV0pFTzA0MUYwMzVJOUVRZjVlMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMvdGFuZ2llciI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpRejBSODF0cHY1MWRVS2NYIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778498923),
('faJMFvzwKUb9xxDbYAWYrgfJsIxgvyj4UqV7jenP', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWWtXVk81Zk41alVtT05TMUtNMTZmYXNxVlJkUHJ3ZHozeTFTUDg5ayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492098),
('ff8NA8N8SKDRNJKBNAIrZdHUcUTIivfIUmkXH2YQ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTE9WemdCWGRlMjZDZ3N6ODByQkhEcU03Z3JqemJ2eDdQYWY0NllKTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778490309),
('fgixSiLLq6v44eE8UZ55HrQh3cYF8vEnaPBh2MS3', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTDdod0J5eExLaHpSRnh0QjVTRGt6Z2h4YTJUVzN4Ym9jQWxGcXg4RCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bkRJVDFuN2tiT0VNR0ZlTyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498923),
('FhyIfqIOoqmIaT63b563A8MQvRwVkFQCkUZckPvo', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV3laU1BGWWtZTW90T0tmbFhPeFpmTHh0dU5SRDYwQU9ZblRzeFJ5ViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493551),
('fKJXGZdYLEOuovuu1lnaZh4yov0lIobIlOxnqEUP', NULL, '35.231.231.156', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRGRPYTRvbFppWmYza3o1Q3VCZHFhaXFYWkUzQ251VERkcENUSjdsWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpsdDRzcWlFVW5lYXBlWld2Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497893),
('fLhr2aw3dxaeZftBB8NI7PmK87cEY2sS6AM044au', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR2UxZGx2VXBBVngyWjU0bzBiR3V6dWh5NTgwS250NHlXYnpsa1JieSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494275),
('FMOvu2hZCgdiCdqnGLtC3VgHRJjQoxbLWNuX9990', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2VBSFgyVlVYbTRHdWNrRXZvTklBV2h6WmRTNGFibEczUUp3R3BOYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493516),
('fo2skwBEiKdIfwNK33Zbje4AgLvDyoKw3F3ZeZNz', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVXZJWVAxdTJuWVNSMkEwa3Zod0lzS0VycHQwbFZoc20xRWt1MDVoOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490321),
('Fo5u1qa7oZwRsmeV7k7dUyKtDGULJLmOclNyQLJ3', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDZXN0dRd3VySHY2OW5Xelc0cVNvdmVWQWFCNEZqREpXYndkTkZnayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6em1XNGJkZ2hFQ0MzRDFhMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493476),
('FtCn8FJeG5uf1mf0FWjnmYamKvfeIXR5tosGOeyC', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYnRvRmxIY1RrcVlObHhFaHR0VElUMGNSS0JJNmlsSFZoY0hZUEw3TiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490402),
('FyV0unVLBHmJq9ueGFj3erUghvc5QZpYvYt3qUQQ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMHQwV0VBWjNHS1NueVpmV0pJdUxFcmdDVGlEMThLek1qNTVpQ091SCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490732),
('gAXLRFgSi5gDxYFjm2kA8PBhWa9daslKhzMnxq0h', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNEFnYWhWeW1uQWpxdGEzUEN3U2tDVG8xMFBMYWdkWTlDS3Jjb0tHbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493546),
('gGYEOUSgBTlHL6jXhz88AiQzBmzCb0nnqG4i6WPD', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVEZoT2tvRHpyNVpnU3RqVm9iNE5CQ3I1aGM1QmNlekh2dmFmUnZrWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497156),
('gMQkpc5PBufcTwBL8a5IqJTKIHSgaptabB8CY8OJ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib3g0aWJOT3lWTmRqalBCaXk0elkwSGdYRlNMM09CckZtSXVNOTNmdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778491364),
('gnuQGwdbz9GM8ZblF2HqDQxwNtwO21nmQF8UO38Y', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiekQyM1ZBTGl1U3Q5M3loejcwRFJScGtWVVRVVGVYVEVBd1lxbmZIRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493821),
('GQIidaB93fALpSUBOieaf91mGijezyWYhFEKeywI', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibzhSV1NXNUh5WUtwRnl1TEREM1RUQkFFbmljelpTRmlBNmhnb2FXOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6eGlkcjNuS0xKdkJCbnJtMiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492048),
('GqS4wxkwPmtmzITmCAh3MYbtrcFmZ0Wc4wxMDzbC', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTTBvSkIzbTB5YjBSaXczUmZEYjlCTWxYRWRIY2dRNFZvR1B2TWlFUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494217),
('GRp9vMIufFuYiW9gjMfuzIjkf9i2z73KY2ftWRSd', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicUc2SmJUU1FMdENHaTJ5SlBxRHRBSU9iZHl2SDhUMlkzTWxMRzFQTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490645),
('gt0RrmS5jWEPxcbfLc044mrtLAeQd0SE7pU1VwQa', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNHZ3UVZEMUo1bTU1WnBIZUZJYW1mZlh1REw4QzNYQUM5VVY1aVlvayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494363),
('GU12sPbbEur65Ww2B3DnKNWR9CY6sWAOTfNLCww7', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFFwRXhKd2xySnVvT1ZrN3BXZndTblJIeFpST3FiNDhtWVVSSDBQRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494951),
('gUXfL9jPJnzlsGIIXUND3RgYZhQVBwd8WcqRjz4r', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRGlNQXVUWENBUHdKa0dvQ2hxN3NLQWczWkRHZ2ZRN2cyWXBSMEZyZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497900),
('GW7sETREWqrsL1h5YwROx6zrRCYZtdNAS95zusOF', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT2VOa2RnZFRpQ0dJMk9jc2xnWHF6cUlyZzBFcHV1ZlpOMWFWZmN1bSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490177),
('GyT5GUYnsR31MaKSzrex6tjVQK1YkcL6eQKuLnoU', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUXZsM2hxVmtQNk5RcnczME5zVmNOdDc4UkNyODVvNTBGVEFVWVhmcCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490314),
('gZRLAK4ZPeThZlzEsdl0n4qr3t4HVBE75fqed6RG', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNTM0VkpVenphaW5RQUd0STd3YWpKYmtMQUUyMWMyazdKNm9GbnV2ZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jbXMvc3RhdHM/dHlwZT10ZWFtIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491384),
('hat53wLDT8MiVoEXoQSb5s2C5qGGd3vkWDRLoyH5', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiblFyS2VVaXI4UXBxV1ZYWE4yc0FVVTV5bE9YZEFIZzdmOVhqRFlwaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi91cGNvbWluZy1ldmVudHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6a0o0a283YTg1a0h5UTQ5dyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492619),
('HbXfAwg3JSzQe9iIB34I19kTYSVFuTmoMDUTPyic', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZnRibnc2TVQ4R0I4SENuWllkMTF1NllXNmVwMXJsd0Npek5ySHYwRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778498487),
('HkAGr6eCivP7m5UpN0wfPDAFx48Ejfb9AEaki2bQ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicExuWURpU3ZYZDltQnZHbFFJRXVPa0V2SkJ0V0J4TVFTRlBWRlhPaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6eGlkcjNuS0xKdkJCbnJtMiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492165),
('HLiBAFJanW6xeg7LbFvjYzoJCUz728RUZtSZ6ZtN', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZjlFSVBKY0p6NDdSN1o1VVFHVWJSY1lESDAzbFA3ekoyWkx2eW9FTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490622),
('HOwMNhTSuEoEm5uZ0d6GYr8euyWDzIMhonbCtrsi', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU083QlRrN0Z2MnVhaXBuMDJyQ3ptN2RobzhvSFEwamR3OTdSMkpLQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490402),
('HSoYBMQGK7oRfTEOTdFArhzMA7f5iLBf16Wm6L5e', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMnVJOE01ejJ6b09DYWoySTZPSkU2RjlUY3A5WEZjNU9VMEpxM0xWYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493516),
('hVeVlJ8djqI6XG1SWH32L62OcSvGVnLHKYT2qTj4', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYld4bUw4VEdVTXpVVFQ2T1Vhd3Z4TG5PUkZTZHNuaFJtZGJJRU5FQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490649),
('Hwb5JPPvpG8RlrUttn778K5JwSMSsxcTU14cAWpo', NULL, '35.231.231.156', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiclEyNEh1ejRxN012OUh1UUdiTDhPUGZ2TzJkUWltem9KbWJqZ21mZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778497893),
('HY8YrajnXxfHdW1jOwJ124ip9R92sBLHffpXPk7p', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSnQydlJDSTlLVE1aZ3dOaFZBamU3M1RmdFdwbFphOFViVFoyREVsMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498135),
('hZzA4q4Br0pdth5RtiVhznLUvakkd5dxFIvfGtRg', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1BkdkhHUWYwNmJxYVZNc1JmTDc0OGdrSWpheXdpZlVIamtYUHI1NyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490631),
('I1wEIQ60J1BW1JDX2HiOVtBNx3lye2g91LchZgQg', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFVCdHUySDVSNG02dXdxYXE4aFlkUzMwdGw2anRrajBjQ1doQXhNTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778498075),
('i40sJ4tCTnJiLBjMVieJ6IB5m6rIxWcabUKBfEJH', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQXJDTVo4R0VsbkQ0TFZSWXd0VklpaUFSajFzQXpyaFlZMXc2SnhTVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjowN1k1NUF2a2htc2d1VDBZIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493310),
('i7cvTp6oat7aZ6DKMLLfLin59NG6y7YcesnE75lx', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQmtMMEdBWHZRYWYwdDlyVEJhbHVPdVZEQW5XbGFBUlJKNFdpM0w3SSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMvdGFuZ2llciI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpRejBSODF0cHY1MWRVS2NYIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778494222),
('iFS6R7NZANu2afpIJ2SF7YNQozZ0nI6YeYSHmjKl', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSjR6QnhWajIxUG14YWQ4eVNOcEFMMTVSQThMMWNKMmxCWFUwYkl4TSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6eGlkcjNuS0xKdkJCbnJtMiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492141),
('ihDRNj8JToSHJ6cFdkjsFHTUd8FLJCbHFB3R4iNW', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzUzbFJlek01MG90UUFqeHlVVEN4czBQWDkyWnJtZ2hKUlU4WXVubSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778497158),
('ImOS00yjFPHWQBf1RTq5ezH6oYwrCTCg4Rl1tK53', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2NBeEtaeWhvYUdHVFM4Rm9CdGZTSnN3MVdacTJyUUNOWGRYTjJ4NiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494067),
('ImqVlCpUPU64btTuyREXQ2x4rkfsUzCqxTqdoeXj', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQzdBTWJFdTVPTjQ2WXZ5UDlpdG5OSzQ3RExBSjViOG50bDF2YUgxNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494218),
('iPkdoP0i1HqQwJXC7F5g3L3MMSmo1uqQC6Gnpcux', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia1pZYVlySDI5ZThFSVRRb0swSncwTGY1U1ZjTkxGUlQ3YzVrZmo3RSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaGFydHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bzBjblVUSHlaNUQ2eUZDOSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492223),
('ITQXwkOnywkrVv1RZv8CQDU3DRtHoeFl6hegnrcg', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWXRCWU1IaWo5MWI1YWltTFBSN29aRjZrMUpMTkNKWnMzaHJPYVhsQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci8zMDAvNDAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491071),
('iVRherXFgbdNPfeT5wkLJICapL7uj2o0TjxFtK4D', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNEplTThrQXU5UE04R3Q1YWY5ZjRoYXQ1bmhYbkFuNGZhWXg1ZVNoYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490647),
('J4nDMvzl30ZInZtatnT7o8k9HxwnLZfxnVqUYH8l', NULL, '34.83.236.27', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQkRzYWJmdklwVjB3TGpmVmFucjA1TDJOMkpUVFJ2MjBGMGJidEhVTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490584),
('J50PF1G08Wjd6m1kHFExYeox5iAMHeCLQFHlN63V', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFFPWTlEUmYxYXU3OEdGeEwydkhoS2tYZzY4QnY5NXpDeVdFV1Q5NSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494868),
('J9zf6OPljyXfubZf97dEBh2fifqpAy9rKrnpFjhp', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibDRIWU5oc3V5UHdrWUVMMXo5dXlPOG52czhPUjBlRU9ucUZveTAzWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778498065),
('JdGbjTxV6B3L0fsVLx7FWy0aZ3yY1D0vofJ9vuKn', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmhhRERobnVENXhUelQ4ajRhUkxobTVCcDJWUEdyUXFWZjhpYnJJciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hY3Rpdml0eSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpJem1tZVhJaFYyd0RuVk5jIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492223),
('jdhE9sGSC1eckUJ8mzPi0pCs2PkpfDTaFKkoV3KB', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRUJaaExMTTZ2OFpwbm5sZWQ0MnVHVGJGamlXNGRTcUE1WU1BSDdPQyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490388),
('JfWtN6FiBnk3dK4SVXgQbCtUEz1289gk0Or1sCMT', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVlZzYW4zV3JUcFQzREVKUEpoVFlFYlRJWkl4SzhPajJDaGFQczJvMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778497151),
('JHPkOwee3kVUGZpQlXoTCfenEheEjWUZwekJyoOS', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMFNGUkdpMGxSbWt0TkRZNUQ4V244VG1NeDdqUjhTM21yUFV0ZWVwbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493551),
('JpCbV0SGnY2e9xDyaPxTYURsA4PLxUhVu2aqgA03', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmxIaU9jU3d0NjdvczY4QTlFUDIyaktkWmE5VkVvS0ZvUlh0VFdlZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493779),
('JPsbNB87z9LvMvGw7Ph31Xh7zr4Tjc94DQlWNouD', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidzU4eXN0OEhMTnk3dndaWUVPb2d0R2hVZEJjZ2w3dVk1aEhCa2hrQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494777);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('JRTHH4QCy7ZMvUCc5m8ckEBLrIS70pi7LBzhzsAu', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMkFKS2pUbkRxY3NoVUxMUlVQckI3VmFTZHpxcFdhMmY3ODY3R2duRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490327),
('JYKHsqsb7jwwdqGDhlJlIzO5XF2WhuYRGUrSRZtN', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHJrMjMxQ0QyMWtVZ2FkWUdubEtrMkVtd0I4SnprbU1iSEx2RndjYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMvYWwtaG9jZWltYSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpRejBSODF0cHY1MWRVS2NYIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493588),
('k1uskCteZUwvTqeJeXRcQmT0auZCRIKnd1Wb5Kuh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia09oQ2dDSmIxbTAzaWxmWUp1eVdadFR6T3pvNVVXNW9INlZBOUc4MyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778497900),
('k2Ud7g3SnRt9UZ94PKHXOTRxLf2RbbGRwA2d1kHV', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM3VzUENyUmplOEo4Vnc1WEw4UXRyeFVMYzRkVzN0NjZMQWZKWEVQdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490989),
('k3mrK1sx6qqFsI0UPkwzpbh34VPRS5s7W2eiKsDZ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWEYybTBqdWh2V0YwaVFlb1F3RkVyWW1Fd0k1bG5LZUpwM0NLREU3QiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490402),
('KdZSHJasBvRXp4ejzQf4yyxkppVa4Ndo8sXKb2bZ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid1dnT3BPd3U2NjhYMExrZmFZNEZXWnIxNWFBRVY5WWtXaHQyRjE3TiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494407),
('KYSO1xx2zPAF0XruELp4NMR5FJFnmiPm4jVhxKPk', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZHV5NmxUTDRyUXIwWXdGeHp6VHVkWE9KcjVDaGhrUmN4c2U3ZFk5biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778499865),
('kZBejSF6doAoQj6pE8lNbXVc7Q4lvMipEn3Sk8z0', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNXkyNFE1M0FqMHg1TlVGOU02Zm5rM3QzbzhPazBSejllakJQSHNyYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bkRJVDFuN2tiT0VNR0ZlTyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493539),
('LcNqEw9S3ZYcGgMf0mnBVKkg8lhD9olIyYH8DI4T', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicTFZaEpzcXJMYXBrOVlBUjFINll5QWtVTnJGZ2x5bmdIRlJaTWRuQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495666),
('LF6R2geDR74DfRb66cq6XfR5oZUsvlB77BpW52t0', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkxWam5zTHJocm1ZeUdEWWpxMEMxYVphZ2ExUHVqM01vZ3lnNHk4QyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498044),
('LHayjslJcpPEckdKjUXQHOpcsrFr3qZs2OpPzJES', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS1ZzOExCUDhmU0xIdW9MelJ6eG9WVmJTajgxeGxZc2dQZ1Q2QmZ5ZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hY3Rpdml0eSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpJem1tZVhJaFYyd0RuVk5jIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492591),
('liwVBn45l3yRGp3NZfPOziAdokWd8wcWbXK3qJ4r', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYWFkajlyU2lEOWZ4cXE3Zzd2UEFQZ0tCdU05M21MM05sZkg5N1hVcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL215LXRpY2tldHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490502),
('LL43P5izrJMBjllTXkXPkaOzskVWOPctt0nL5v9u', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaGs2cDJ3elNWUE9OR3Npd2lXTXZmZGhjUHVDN2lESFhzR3FFRGRFQSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778494216),
('lm9WtmwTWSTeXXxjb3WSLXBBR14EmWmxNfx66Hoa', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzZMN2lSTnlITG5SSmozalBBdnE5aG9KSm9IbTRlSmpsbHJVZFBUWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778491069),
('lMpxZ4mSsi4nXnTm3xw1gVM3dZiUZw9FOd3OClw8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSUU1TEN3ejRZemdSVGhwSW4xOUp0STRHOGNYNWJpRjcyc0xNa09zVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4dTM4RXRXSVZMbzUwM1VFIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492903),
('LPxjnM9C9u9CMiHsxJtEpurtPuagS9FuGUPx0ap0', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicmlhaTVuSmRXaUpuV3BRcVJrSWt6QTBzM0JCTWhWeGp2VkRhNWl0eCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6eGlkcjNuS0xKdkJCbnJtMiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492021),
('LtU10Kv7eZL4iUkS4fxZ8LIxIIvXfobfqUYsuRZT', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRmd6S1NzS0JIbnF0ZGYwZHR4T2NiQTFUVVU4WXhScEhjN3pBOVdEOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778495470),
('LvxkY7PXrnlRqnJAHKwHTj57Lhcd1uzHFzo8saop', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRlpIMHJPaHA1NGJhTU1rUFpTTTkwVTB0a1RNek9KTXpCY3BWNWJjQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hY3Rpdml0eSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpyM1YyRFdXOTJxbFI4dWR5Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493490),
('M4pupvX7Ib7I2p4nJ1hg4Tztfnse9VWSyWpJUbuB', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibjZVVjhucVc3Nm5qMkhTZVI4ZzhFajViYmNyYlBRNm8ySjY1TXdsWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490629),
('MAuhfLYKsC9XEAmMB4FnpJw4ZxyrYn29VFcVkgWV', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaXpLVjkzdktZdUpHZkZMOW1JdW1TYXpDSXVVNjNsYUFtMndLRVBsVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZWRpYSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpDQ3o5bDg4ZXM3alowMzZlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778499880),
('mBrWjC1cF38UvsvT3Ght7yWvW1pRKBUTZh4eGWd9', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRGlVZnZwOWNySDZ3ZWQ0VVpoTGJRM2xsM3REazlJWWpxTnNuYWJBRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9uZXdzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491073),
('mFvHK6t3A6yCup26HAGfw28k2oo6oGMq73ac5jtZ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT1hoTVFmWFkwQW1ZMjVKOWFyNHlFSEl4Y0NSZU9MdDIweUlJTHdvcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494951),
('MIbMt5mknbOUAjNFMn7Y0d9dNKsDdjAD6PsrgAvy', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaXBpRjgydnlwa3diVEdGVU1sMzVPbUpueW5jZ2JFVVE1Q2c1ZkZuWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490989),
('MickA9Js1xfTMCZJQjrI7OupxcbQwVT1uvQsaVDY', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM25PcmtSRDdRZXpRYW1KNm5QdTd5RzB1V0RjdGVHdFFQZ3VEcXFKNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaGFydHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bzBjblVUSHlaNUQ2eUZDOSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492412),
('mqNMeQYrOipTECnrJfdTqsSJNTdLbZZ1WUIVyqTm', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQkFyRmZaYllxaGRBclRjRmlVcGFpUVVibWVVQ25oeFZrSEN0eU5UdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bkRJVDFuN2tiT0VNR0ZlTyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493588),
('MV9RVN59vlEOISmVYURWWeyeeQdFmvxmcHfLomu6', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiejh1MzJWczAxYjMwWmlMWDRiMzJqaHV4bHB4dUw5VnpXZG55Y05ycSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778498044),
('mvMRrKUpDU9nYIp4Lhi5Bh99dsP6Wy4qPgfsBZlY', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicWV5NkVaN0JZanFDcDBRTm1WM3huN2tqeFBBQVgxRFlTckVzVzFTbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490643),
('mxYHN50Cqsricm8WdSK4ob2LaC6FPpVwm9DqqPjI', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT2h5RHBoeUFwZ1NJSXBJZ3Y3WEVaeWl6YWNBNWYzakpOWnNNeldHMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4UFBoNnloVW5RNUltOGNQIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492663),
('mzI17NDOPlPhDmfoRW3vmmPk8DVRl7NThUIXG01H', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia0owRHhHUnhzRFQ5OGIwVTIxdjNnRXBGR3A4UnFkbHJOOFdick5GeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494160),
('n7iGVGEBhcEMb5D6KtBilDmAdAVVy8A1CDsok2Qf', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZTZ2SFpxcTJ4SjZBaEhaZTN5QjhFM3NmWHFqZDVaMjcyQjlxeTFOWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci82MDAvNDAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491071),
('N7xjAbjCDo1vQJJQpqEkwLtBC0jfwL3QQ4eD7Wtg', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmZpUktZYXRqWWFLT0pMMzh0WHRkdzdUSGtObUlpNE4zbkhXTDl3UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494834),
('Nca3HPwZnZez82Xcn8fiS5jcYOtFnvoiN7PvPTvx', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZXJSWkdxZU5paFkwbEc2M1FUdHg1UzV2eUdMRHN1UG5Fa0ZSbkxxYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494158),
('nqo9ouEUXiy00k4LfufoB3PIdCRT8KblunPG5BMU', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVE1IZnpJVVpsajJLVzFpZGU5NnExdTNIMUI2V095WE1CVGRSNTJnWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778493476),
('nR68DCZdar8LI4fxGxg2ifUpyiwU5jpzya5erjHO', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDdld2VOZW1vWEh0OUVnRGRnRmlMdktTOWtIdEtSN2R1R0xpcWk3SSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778490615),
('nRjzYkObThQWhFg2UYSCrllTBXiPmSU6ZkVm3NhQ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiamJrdzVEY1JtUlp3TmhIY2xJVTB0Q0NoWWhadkFhUTNxbHBjR00yNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490632),
('ntRB1RcnzM7o0z8i4nxWpCyRJFKf2YPE3CpXWPp0', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNkhubGJxT2RSZmhsNW9VZ09KeTBMM3kxZ2hrYno4elNxdEt2ZThzMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490647),
('nVRmirshw0cgq3vRvI6dNPp9XhTShXMZ4otJBk2A', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWEdDWGIzRjlEcFBrYUh1Y3NTOGJZcnRqSTl3VnJvMGNzU0xlOE0ycyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6eGlkcjNuS0xKdkJCbnJtMiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492023),
('O8IjQuf2FCxNRYkCF3YBC47lVCBwTnz6NrYwf0ot', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieVg4OFFORExuUVIwRENSekVEdFB2SzNtMWVHdUIwYUNweHp4UzNEQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6Yms4RlFzREIzaHhqYVcxSyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492903),
('O8UMJ3cdBGk1QfZlhLWRaP9TlQ5NQSuBIJbOoaNW', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQTZDVGxxZFRvcTFZMlYxTFphR1BIWjdmaThWVlV0d1V4WGVOWkgwYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL215LXRpY2tldHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490396),
('oF7jSiymhePzCIaoS74qWK9RExAeeBtu7qCUgZKY', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUk8xeHNzSVMwc1hHNHp4TXF6ZXQ3cDJSM2xsM2ZjY0hhN1ZKZWFjZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490321),
('okeFuVysHTnbKHYMH9RYVNN2KPID3c5BJRSY7M7d', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWHM4eHBrMHllbXZxRVMyVjI5eUxyUUpLcDRDZmJBdzR6eGo2eEdyciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491330),
('OMqIdsi7HE599e9CTqeURFkzXJZgt1fgRKUzXxG9', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiODVxYURIbEVJQkRJZEY4NVJpbXVkTmJURjRIMVpxUDZoNkJrTGxrdyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490645),
('ONY2SReKVwZdE2O8HvA2dfRcsMbOtT2LfXla8d0F', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2hXa1FyQjM4MGtBQnhoMXd6MFFHYWRYMG5MbWVvZ3N1aE5Nb21HWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493582),
('OsqLflLI08R5t0jauJWMgcuW2auQIkC852gkjZeI', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHdrS0x1b2VjbW80R1BVSFhIejdiVmwxa3pBWTd1aFJGUWVXTG1hZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZWRpYSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpDQ3o5bDg4ZXM3alowMzZlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778495831),
('OwOlHL7AX9TWxVr69bI68Tq9khxeVXalZmKd8rjN', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiak5BcUpvanEwNjZ3bHl6UlJPVVZRWDB0aXdKYkNjZjlHVWh3V1c4cCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4UFBoNnloVW5RNUltOGNQIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493038),
('OXdadmHcCCBIDKD2O1PRQdG6PcXQgtKDOTI8Yhjy', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidENrc3U3WnluazJNNXVuRXRWNm9HcDFoT1luUVZ0cWVlbEJhc2M5ViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490147),
('OzvNyW4KamciH6agPiOiEIUtsPREX8Ptex03Uk5A', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWEdOYVZ4SVRReTFOTmY3d045MFFBQkVPU002OU10ZGw3TmFpaW4yRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMvdGFuZ2llciI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjoxY2NyTUhRNFpsZ2ZOWG9yIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492107),
('p21ZdOXGVFdgGOi7T31PcjZcX9v1SKTKuLrXr1oK', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZUtoTmtLNWhuVWtLRzVuMVVkNUlBekZGT3k3SEE1SnhTYm1nWlpsbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495821),
('p9bttISmK7Et4jB955sb38I6Iwa0QA4A4cmc1D0T', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSnZFQ25hSG13Rmg1QnJYRWNKUU43VXllSlU0UVd3REVaNnRhZm1wYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495672),
('pAPFh3AbLd4cTzu1WLedacLmmakHwKBZ1O73NjUV', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkczMThobFN1VnJON1Y0dDE0WjZSSmZNRzFkeDQ5Uk84MXl3eVlTSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778497156),
('PB60eC3ywXNTczeoz876KQw8eBmShWud03Y5zknx', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid1kxMjJFUGNad1lyOHNId2o0RlNtSUxUTTBTU3V3YkczWXNycWhmNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498487),
('PEPiPBZjCXI3GVVw5BBh0i9ACukZyHd5OtvGZTef', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidTNKTWg4WGZpbEljS3lHb1YyTk1LYW5KVmhoTGgxdTRLQnJvQ0czMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493537),
('pM67QmQrcYIOaM9JL9Z4gSfC3w3fLHjbIsCclWk1', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUUIybGxlMDY1SjdxaXJjVHJUTTBKZlBVRUdGVm1PT1JZZGtRUzVvcSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778499885),
('pMCp3eHq0IV4ywmESjaEjxJhByX2sUfGtSdjLRGE', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic3lZMWk2VXZPR3NGUENDRFNGcWcwelhQZTBFaFpiVTRkMGdURENNWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495162),
('pNesgLjdN7cV9rou5GLLxghEAGzIOMpX0a8rFU1d', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDc2TW43azc3VWhSdFVNNHd6MkRkS3RCYzdQYXVLYkdrdndtU2JtWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493518),
('ppd9kUhhhyPTALIVmcoQJTcxmOlMSLAEpbk6Uj9G', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTDhkYW1ic1YzeGdzVE1pOXo2MTVQemxJdDZvaXNnZVdQWnV0YzRlVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490381),
('pPQo3znWgIkVD0EBO1sMcj39kFfkgWc0XrPF34e2', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQkZaTDVpM0tTZU1RVlgxTGdObURSTFpPZVlXckhGNlpQWW5WUnAxeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490440),
('PR5WuJo6JDPg6VVjB13cfKQADMNq0k2eHUqLCRSj', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNTJVbnhwQkZMQ2xTa2x4YlNpRFRrZWFDeU5Jakg2Unp1aUtydUFYRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494245),
('PtOwIoPDVt75kbaCJCq6I5tkLoyjrykPoiwQoszC', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMXYwY3NnSUNPMnRhQnQzQzg5ZWlFeVFId0Jack5Rbkp2MTA4YjhCbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778499865),
('pVplxLut6zqv3rCJCVmZhVhMkdf0pu8C3b2MQb58', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVppdTc2UGM2TXl5TWRyTnRXb3dnUDE4N3Z2VDJaejFTZm16b21taCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci8zMDAvNDAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491024),
('pwAJuJdLAlQW9oAXOxdpM9wsI9OvsdmBJznpiYRu', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSXJmN3dlQUh2MGJ6cUpUQ3g1b3FLQm9aQzZWUE51S1BGUmp6alQ1OCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498094),
('qClHjkmLCE1F6s7vbI0BVLHSEF8KOB2m3JPLk7fP', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUmtSeHhZTzREVG9YUUplVHN6aElvcnNGOXVoZjB6c3laM1BEbVdyNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490622),
('qDbgSt27WtwCa1THKLKiMIZOxRHFqFJDOlWCJka3', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS3d4MERGUkxFdzlJNGc1RTE4RE1PQ094N3RNRDhWT1BmSjdmazVTSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hY3Rpdml0eSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpJem1tZVhJaFYyd0RuVk5jIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492619),
('Qf7ochyMlEAhlrT2aaidCMK8nz2i4jDQTrTiSF73', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNm9QRmRkWEJXOGVKbzJIaWE2d0haRDRSNTRCa1plNFlLSG1XckZXbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778499877),
('QhxnZ4mB5PuJtxkdcod6AvjwRNoCJlU7JPVSRgjm', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWEV4ejVGdFJraEpMSHdrZ3NXOW9PR2hrejZvMGV4VU0zcFZCM0xjUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494777),
('qiHH02wYZMWZho3J4nQbhrQ73oeOFKKVyLIteKG8', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNjJPa0VqNUNuV3JxNFJjUk1vQnY5S3prdVlaTFFMcEE5RG1oWWo1bCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778490992),
('QMlMqUZCcq4zewoPiV9O3MD3oxMTkvWJsXO54gTR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoielhTMlhJQUlUa1haYklGc0FrS1pBR3FOMTNjZUZ1MlB5QW5IdGNsaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778494067),
('qrsGXkpOK7JHCQusBMVhiRDgz7rLp5RhHw9ebOhQ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ05ZcGkxMzlHTEk4aUVhZUN3MVhNU0FQSFpqQjRRNnZpZXN0OXhORyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bmhtMWlESTZnMG9ud1hGdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492411),
('quf4Jg55tz1tYuX4zg0VkUuFqcHgiXsZrJ2RUDgS', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOXdwTlRQTEZoWFNRelR3VEFkQTZjc3hrcWd6b2plTmZNZ0tzQXRleSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490014),
('R8v38NtWOwgqxZuXyEJCodFobTAdPMTKv5uqvA0m', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibU1vZXpTQ09FSzNqeUZpdjNOR05NR1p4U1JESUtMcmNpeENGUkdZayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778498836),
('rHXLk8aPoKze2vTPS7RzDRb7jHMCyspUnid3OQHQ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRzAxRHlOcGdzNEU3VWNNV1BSbWtVeFBsWTdrTVY5bW43M2tCTHpGRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4UFBoNnloVW5RNUltOGNQIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492618),
('RI3zI4TxPfglj1WnNOXAKrP2eg3ypzpz9w6aLl8h', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmdJSm5JbEJFSVR3d3hDSlZ4TVByRlBsSXROWm5zdWNmSE1QRVZKNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bmhtMWlESTZnMG9ud1hGdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492048),
('rj4YtU2klWJzcKg9mfPnat0fMMF3R5nBdE1r3VQn', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibTVicXJ4T3ZQTEtyNXZCdWY0dU1TNHlpVEtvUU11UnR1cVJHMUJZMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490440),
('rlRqnwA20UuVwfQsP0NviMOV2RYy0Yv9kQNaJCjY', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTUpKemlPMjdHNUJQNThHaHk3a1J4NnNNTDV4cVk0NGFtMTFyaHBpaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaGFydHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bzBjblVUSHlaNUQ2eUZDOSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492591),
('rnT8ajc5KLKZ9dahChSwxPc51DzFtO2JWQWPv0OD', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoic3pCWGtHb3hOQUZwd3hYUWFLckoxU2g3MjBnTlBwdEcwV0ZWVXpQTiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497712),
('s564epGRblH9VDsA9g8qQPof0pwn7LbeP2u8QREt', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMk9wTGNoaXdZSnppd1pxVEt6aGg0UFpJdEJUT2pQTDI3cXkweDlVYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493494),
('SCDwdgQphyodHjG9iBXNGdxvnd5yFnhsYnQxXMgv', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUWZUSEZVY2xURlJLV1pvU3Z1VlVmQ3liSXNQVlFZdkRkd2dRVnl3cyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778495662),
('SDCasSSg9u4XdyYhMf24dPzeoRIJzI17ae8V2Vdn', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibUZtSWhUdHNXcDd1Y0F0MFRUaDJpR05xWFBxQ29QYzNwZm8xUGJaaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493709),
('SfyIfMRaHhOsowWmpUfRvXGaC3TJEGWOaO7LFLMZ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib01mSEt5MUZabXB2ZWplUndnb1p3OHFCTnlacUg0UTk4M2ZCOEpIRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490647),
('smwJ8TVIjupuALSjNx6Cpk17JlIkIEZOluxvLZDE', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRHZ0Y3U2V0JKVEg3NEcxdDBLYTNwWW85Y3lRSmFQd2lnSklJZzJJYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498952),
('SSuxiai7zX2T2c6VlZA2agCo4qicyLjVpQjbdE1i', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUJDcmcweFBZejJrOGxEalhXNFFpU0hsMmJQWHd6cmxKcjZCeWNrUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490631),
('t5EuJtjS8UimOI4gDkbVjj1h09GrpVi7mFZtxLPW', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWkVodlhobWdDb2JicHVzMkYyWVZtSXdoSThnN1pJb3lhMUNINFpUZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495470),
('T6VHrRF1Bgp1GLHPw6WCizE8UyJ7v9RZ4XIN3YeA', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUk5yVmVia0ppVFE0cEhGRjV5VDRqdUJIVWFrbFBpUXhJdWs5S3I5UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490622),
('tCSwsSgYViF4P9YRCvCEibHOiecEESpoN8DDOgBX', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZXdTeHllRHA0TkR2UDA5QTF3TmlHMHRlUTQwa3I0bmt5b3NiaGd0RyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494363),
('TCXEi8peUPVrhtxC93MCmQdLG6PsBCqSegSr5W1V', NULL, '104.196.0.226', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaTJFbUZxa2dlb2tZeTRRaG1GSldIQW82MnhLSVhtUUQ5bE9xeHFIaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491780),
('TCY4Rw55KjTXlkUmXKhhtwfcKzNd75IGCzlceKuW', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQ3lEUU1GWnFOQnl0a3JYWHRKSlB0cUtjTjZlRUEwenJzeEM3MUtNWSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497171),
('tHUasrtbRTqeOl4DkIAqVlGZ27jbimnEaXHZ0tML', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWnYyYWxJVUdaWXFjUnlEeWo2dDhWTTVPOGtLdUp1RDNSaFFQaU9OZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494349),
('titvBiYgWHYXysmQqBmkiVG5L5RWpIqPkY3VNEmf', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUpIRGJkT0xYR2RqTkc3ZjBSdzgxOXFYMnQ3QlFteFFKZE85d2EwQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2NsdWJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778490384),
('Tl8qvyiwhW0ixsHpvcXJMRWgfSDTKcksfx0I0N3V', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU3ZUc3l2V2xPcXZSSVEzeWI4YlY1WVJLSjBpbGxoS3hmcGNRbDdTaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmpDSE1Dc1FZZFBBbkFtaE0iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778492982),
('tljMaioRe1o1NGE0Hr1Hnp7Ob3FvLixIqvZtEZrz', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRGNUdlJMVzBsMnh0WFBTclpQeTZIeE9mbGZTcXlIUzZ0UFJHVUNTSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490400),
('tOoiLfdjMmzMwUvMPrK2csJIpqgBh9HT8KsOy5Rd', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2xTUmxpM2JVM0VCNW1mb2pBVENFTGhWeE55TWZOc1IxN1ZISTRWRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493476),
('tPCGVcX7ocEWpfXMkc7q57AEi9Np8wdaK0m4hSYJ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2Z3Q3F0STljTmlDQnBoRXBYVFRCd0xaeGNqUGFZUnZWek1CNFNHUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4dTM4RXRXSVZMbzUwM1VFIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492438),
('TskfbqIT59hzuvruluiWptgOKjHrqt1hSvGAdCFt', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzNzemp5ZFRUOFB5RUpQWFZYYzhnUW05YlkxOGt0UTFJajJ4N3RncSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490400),
('tutoJnvrCdtVWtZTlQUxt4NCqiXZ0S74jPAAPGiu', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVzBtdEFtZ0c3UHVCWnI5bGtMUTBVaUZ2SWZDNmNLcDdYc2ZSSzNwaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490629),
('TzDN4pJczNJbyx3YU3y7EgAOzjDyvTcKXmwHGi4h', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTzRRM1JBR2tNMzk3ekxPZGpQeEVYRnJUbVVnNjgyMWxBRjI0enlpaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778499122),
('TZNXC9bWLlePPba9Qi3QsmXNRy1SMN2f8Dp4A4l3', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicVlTdDBGcWhKZklaeDFBVzR6U3hvZG1JOFpSa1hUQmNHNzNWTEdJSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490993),
('u73n0IiiMYASj8x8NKJNUQmn3yUWTsC1Erfst8bd', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibjlIZmlpMUlENHJQRjNQWlpSeVgxRk5wV2d2M3VMSlI2MU1XSmJmVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491676);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('ua1rY7G4k85s4y2pH1ZzWfLZmxjKX16ybg2N5kCj', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkJtR3pVd0RjdVI0S1luRlI5RXA2Y21wYlV3MGJ6cXpHbG4xUFRXQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493033),
('UajwwJjyq4d6TSogTuOYzcBFoyGqNCsyST2CXFo2', NULL, '104.196.0.226', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVE1Cd2l5TTJ6ckpZMHhNNUdQMVBIeDVQMDZKOVRHcHduRksyRnk3QiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778491860),
('ucnwxoG1Y34QZdLaLGtxxopaOUj4GDaWeNLgNTws', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS2NXWksyYVZlbUZjYUM3SzBvd3BTWW05Nm5PWEgxdVFRdWFibTA4SiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778499879),
('ueDxMBxZDZtGbtZJPAVWap3YaeKECmcLIEyvWzvJ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidUpFQWpDWmFNaG1LU3dubktTRTFrN2p6S1M3aEtYaUhIdWhLZDducSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498072),
('UfEwulk3JU6fJj3xwtOuqU96yT4rs02qr5vSX8Xk', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV25XZjhEc1NmZkU3eWRESHBYMXJYT3hJQnRaOEx5MXRSYXAwUUhzNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490151),
('UIaeeFXHCivLb6Ur7QFVUtcu9rqomuBirkoxh2pA', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNW04OGc3SUlsQ0VsdFRoVWxQTXY4c2NDUUFsV3FSbU1aR0RMRVg2QyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490109),
('uNMwVFO6YOvtrRfYNdXmOPOuHnsmHwzjCT0j2dsA', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidGZvVFdveGVQRzJjVzlnREFBRHdmMG5PSmZPMmh6dWFpcHNsaklTcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490406),
('UTE8Rpn3AXV1CryZjb77Q0Jm3SyHtKzTXR4HKgn8', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODBqckRvR3pCQXdWNHRhQzY4R1pMVFphNEJzMVdCU092Z241V0NtWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778491014),
('Uw4Li1dYafBk3jVngmjSdBbA7jFFf5QsxCiRHcs5', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZERjVmFGSDl1MGQxNW54M3lSNGZkeFNMM2lRZG1kajZPcXFvSTRYZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMvdGFuZ2llciI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpRejBSODF0cHY1MWRVS2NYIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493578),
('UZL1IBgSxV9FiQRPm5NKCCdVfYFMPwdx4BvFZnrM', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWw2c0s2VE9tMW9zdnVFOXFHTjEzdk53aDRrRGhZTXEzZkhDblNScCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494399),
('V4n5bdYKvEzgPBdk1Ls29t8ZXLFPNBvxxWgCEC9t', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTExiaUYxTzdwMXhhTGNxNktlV3pjS2VwYjIybkRON3Jmd201MVZPaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490014),
('v5EVcY4JSgtMHCgXQp8nv4viSbrQqPsaw2kxj9ck', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieGM1Skg2M0Z5bVFRVERxYVp2a0xyUFRVcWFlalJSdDZaek5FdGtRbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490993),
('v8J8BqUAYfh4Lv7SXYUNbnEVVszHKZ10xLFM4pby', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUk5HTGpkZWdkaDkyVWpiMVRJVE43alVnWm9CckxYcmF5RHVJNTVpcCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZWRpYSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpDQ3o5bDg4ZXM3alowMzZlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497166),
('V95TyLpKt1G8cHNeMo4J5pSxsJ6jzVwaqFAtc8w4', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQjVMNmhTSXlDYVFqVUpjZWRwcllJQjM0WVBPQU0xTHZ5YVpFOEtXZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498094),
('VAOnvtM7St7RBpMDY3jsJWzI8akBgsXEAEdjN3XI', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid0FHVkNqeWYwTmx1YUxXRmtON1hueld1bkhzQmFxTm5NcjQwa2lWVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493821),
('vB3RfqpCaeofb7zXC3DYgbZ0SFG64ecp2Yj0QCQ4', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQmhraUFPUVpvUkowRDFXMFpRR1Q2ZzJsMkU2QWtCN1Nha3k5S1N2MSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpBUE1RQkd3eDBUeW1kU2pPIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493476),
('vBmpnfCAlorj0KRixb8o3rZN90Pd79ERnXe6fzsG', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWJkUjlLMTRQUktzNkhGcEhISWFPWVJ6TU45V0xoQWJscVE5dmZaMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493779),
('vdfotLgirTHBqrmYjtok0ShI4KJuIJNjs3sNI56q', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieU5tbTBRUjVTY213RExzYjB2ZDZjbWVGM0hsYm1ObFhvbzZJY0RlciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778495674),
('vfa2CuDiN2lDxRrS2ygRHPxrtGJDceeM06XhJYAC', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNnhBaWFRYkF3QUI5T211Q3dQZHowZjEybjlic1lIbDUydGR1VnNGWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490109),
('VFEwibFhFM1TIXCLMP6eqkj1Tawllacv7F1gaLhb', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoianFxV1ViTkNyREVhVDAyRFdRM1hKUmltdXBIdVJsb0JGSDhaY1pYaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778498457),
('vg9z3HZF8vT9m7AyhStarXdeR87U3MyQJ2quVHAS', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYWs2ZHE5WDF3a3JFdWlGa0Z3cUR1elI3T0xzdlFCYXpiRXh6V2NpciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778494755),
('VimzKn0UtHgHAUlY8QYO6XEWjPL6TpYfNkDvsTTE', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2JMV3A1eHdCNGRGc0JyWmkxY0lUVXlnRlVsOFR4cko2WjNibnI0MSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778494755),
('VKlJCNzhtYoIEcfCGMrdx32IBUH4hyFmInIpKsId', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVm1yaWw4WUx3bTdHNEk2ZW5RYnZVdm9aeGNjdWl5TmdZa21OR3JNWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9zdGF0cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpidmdqY3ZrTDhyUkNmbFg1Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492223),
('VNDH0B4y2KctsOHrRvcloyH3sYjteuDPQRNdx5vm', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibnI1YjB6dk16bzhYOTBIcFBXWkVOZ1BxYU5CVjdUSHZmZ2JOd2hkRCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497198),
('VQh3wlUDyj3vlmUo5P9T7ne7BVCWtkw0vjAvN1Gn', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSzllbkFpd0FHcVluazhOQ09vZXpoTFJBNTNzVmpWdG16ZXcyVjBxWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495666),
('vQIw8ry0m4a94sHTC5mRGn50ba9GTPl65GUxVVqR', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT2IxMW5VSlNQcEw5b0VpRDY0b0FLSmw3Y3Uwb1NuU2JXSkhkVGpRVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL3NhbmN0dW0vY3NyZi1jb29raWUiO3M6NToicm91dGUiO3M6MTk6InNhbmN0dW0uY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778493490),
('VQo45G3mc0INReIi1R6g1VNIlG1FFaDgooUk1dRR', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTXljTDV5NHlFM0VrZVcyeW5NbHU0ZUM4TWVRMVRsWDN2MkJYcFZLQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498075),
('vRS6VXMgcXTFjWrf6jLfW53834YHhtHBHxYbVHC9', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFdQTnhVRnR2VlVRMFRsbUljSU1XTTI5Vm0yamR4WkVwV2FkUHhmaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpYQWxSdDhmVjlycmlvRlplIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778498952),
('vwOFTMCMkpIRJllTYqykEws10tzQ5LSi22RkBPcv', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicUY4TXYwbGNzTnlFR2xCM2RodlNuTnJuOXR3cmF6bnk0bEU3akZrQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2FwcGxpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490440),
('VWWJcj6Hk3MceanatuYtrw1vs36uT9VeOrSjEyuh', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVWZRZzZldmtrd0JBenl6MkIwckJZOEVldlQ2MXlEenRZcnIzWlZjUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778491676),
('W1sZUoVUDkAT1u5ii50sggbcWsxpPwmS52DAY0Km', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0JpcnFvYk5HWjNlY3VYNTV3M3FmN3pvY2h0NnBQcVFPbHdFUHBMdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjowN1k1NUF2a2htc2d1VDBZIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492438),
('W4fpUKEsoUWzPdeIeuyzIncSoxDzuYFwC98rPszu', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidUs5cTVjcGpQbVdmYU1VMjN3bVVFdkoyUUxUTzB5TG95WlBtVWdrdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495674),
('w6NwDdbY5A78d1iVggYjTHInRQGmCCjbIngVMTQM', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1I5MjRnMXFKcmFPVmlBUGtYQ3laWWxWbkZjYnc3YzNBQVN0a1dEayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495662),
('w6pCPmaihkYA6UclPwDjnxaQvEG48zKvUWyB8p4n', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOXFvSzZwbDAyZHJ3VmY2d0NicEI3ZkhMQjc5QkZVb3lBTXRUaUlZaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778491069),
('W8DPEVaLTaEJYtkIbtS20AXZzBOTscCzaB0dUkpZ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMWp1NUxhRnFvaUZHZmdXUWRockdBcHk5VmhidHphY3piNWJXdm4wUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4dTM4RXRXSVZMbzUwM1VFIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492982),
('WIwsVXMl61nAyEKki5oCoi7eQ4286eiPgPCw58jt', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOVhKMUF0MGNZWFhlNEZCdkF3aHI3TG8zS2YzdWE1OGl2NGdlUk96RCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493517),
('WshaD0yOYGbqBHGj7acCcbeAY4tRVhRVExD4TD6k', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFVFa05mQ1JNbUJFN21mY2lzRUdVUE10eVRMSW9aMjhHZ3Rvb29wUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaGFydHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bzBjblVUSHlaNUQ2eUZDOSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492619),
('WyhTxoXvDSbDDBV4fbdvGeLWLTwz1xpdIDreOoGp', NULL, '35.231.231.156', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTE9BYVpYOEpBWTNBZ2ttcUhIenRMNDVJVkZJVEZVcEE4WXpmcEhNNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497893),
('wyJsUkqoHEfslWugvd7S2hzRiyk8VJwZttjhcJQ3', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibHBISkE5UjVVSjBqd01OcHZ5NDJhUTdUVHNyMWJQN1FTdzBKQ3U0QiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6eGlkcjNuS0xKdkJCbnJtMiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492103),
('X028tkr4pfkaOrLhSrYvdk9CHZOhR4m3rtTVr5EI', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOXZrNFVvM1lZOWZTaEJpNlhsaDJ1SmVhOEp0V0w4UEY3UktTbW9RVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bmhtMWlESTZnMG9ud1hGdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493310),
('X14keJuUVD8n8ceKzlnloHNBIOLKPX7tNEhuB9Ej', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2N2TjJaaXhOeVkxNm5TS2xoY3U2RWx4aUc3MXh0SWpRWFlGa2w2TCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498072),
('x2KDdRXeUPgDAkicQfKtFYmz2htOaMt8iRpeETyt', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnpEeHJKSVdSbHczVzZreVA0ZXRNemhFdU5nR25CSVdoMEh6aDZ1UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4UFBoNnloVW5RNUltOGNQIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492438),
('X6Dni4dWwyYe4Q3UlFgyd8My40eqtTUX6z0MAkXX', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZklacXF1ZEJVb0tVV25weFZEbVdzQmdLMG5kNTZUOHdWR3M3T1VTTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL2V2ZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490406),
('Xk274UbQmLzVzbQomkUdQ3O0LagiJjTGMzJ0PK88', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2hIN0NRb1RkWkV2SG04WGlsV1c3VG5vM1puV0RmUm5MVGp5T1ZVeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778491013),
('xKc9wc4FgUZmThAmP5wXdDzbVJbKKUop4u6w16NL', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibEN4WkdjRkVoSkNZNkRic1pVR0Y3cER2M2FRRmJveVN1alRzSm5pVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci81MDAvMzAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491024),
('xl2YasT4bplfIheAa6oC2hWeN41Mp2kbLpwL08iO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZTV0emFSZ25QcFJnQ2pPVFozUnB1TklOdFJOYWdrRHFIR3pOUlJGeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmpDSE1Dc1FZZFBBbkFtaE0iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778492903),
('xQuU0PlplmQ8cWorwPER7pH5287nz1LLOHDZNSkV', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSXNuWTZmVGZ3YmV3TUtLcXA4WjNwSjlMZm90dm00cEF3ZVNxaFFkRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9wbGFjZWhvbGRlci80MDAvNjAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778491071),
('xSzaZwtmVlYOvqKQRjmX6hNmitFSRubWrmHaqRV3', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTVZZZk5jVTlxVkZJMXFiYmxDUFF0MDNWd1NNYmZPWjFyNTVUWUVYciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9ib29raW5nL215LXRpY2tldHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490151),
('XtwkdJX4tDmttXEbIG0ugy88jk3ZcUjnYrM9je2L', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWkl5OTRIMTBCMUNoaG5Vblc2QTlZeGxUTlpUYVpSbG5lRUt1U1RkVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6eGlkcjNuS0xKdkJCbnJtMiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492044),
('xvNuJiPZ7rVUO9LoeTmop36UKiA4MdIRMtjxFBHR', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQnZHR2FhcDgxT1FYNkJ5NVdYQk91ejlzSzlMeWdSS2g1SFF2Wk9UQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494755),
('xxvc68vuEJPd1oDvcgrwBoJH7vnpT4KCMaKlv0Z4', NULL, '104.196.0.226', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTXY3dnlIWjBBZlk0RWxJbEd4YWx0RWtqU3puaUQ3NVVjWWFsV0c4SyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bmhtMWlESTZnMG9ud1hGdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492929),
('XziLM5gDQuBSJASl9HLZLRlgvX66Ok15WoGyaHb0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibE5hcmVhYTh0UnVOcDVIZk1xUmhYMTdUWjFRREkzd1VCa3dCcW1BMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpEczJ2Snl0VzRpRkpUb0pHIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778497363),
('Y0s8KfKrx9rt55Hr4LJrZNYvudmwk0lprvUlZE3I', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibDM3c0tVaGZpUXZvRk9VYkhpWHFlMGpKS2ZUbG96bmxJaWo4WVdwYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjo4UFBoNnloVW5RNUltOGNQIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492477),
('Y2hAN909ySpTYeQD2cYkeGUJ1xc9VWVtsgOACEDY', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmZJb0oxdlpMR29US0YxaHV5MWVBMlE4ajF3Q21oSEd5R0FRQWY3TSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2NsdWJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778490502),
('y4YBtVxmTAlE1xsZFHJOIz5wB5O4BXQFTTLLRnXj', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieFpxWkZ5ME8wUFh3UG50ZU5LZHRVaDYzc2ZUNnV3RlNtSmJkdkxYVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi91cGNvbWluZy1ldmVudHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6a0o0a283YTg1a0h5UTQ5dyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492223),
('Y5m0y003I3JsAaagPzbEDnQ8LpGwBbRlIzuSAbSp', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZDJlVlY2MGg0UFMyQUY0bmY1NURYNjZLenlFNGExdjVBODVGbWlnMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OklUcGptS3VvdHo2Q2FiaUciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778499877),
('y9wCudG4RuKGulVsxl0QDTtyiWlJkDhc8EvLiHpj', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmhjTFdBMVQ2VnE0bXJWMTdrR3Y0UzBpSVBBajFNRklIMjk0YmdDSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9zdGF0cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpidmdqY3ZrTDhyUkNmbFg1Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778492412),
('yaWLAunPGAP9ZDElCZk9C1jgS3x99w1B31mie08g', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZDVkTGpBN0xqdzVjc3M2bmswMm90d1hwa0cyRzBJTFVjUkI4WUF5QyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvaGVybyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490321),
('yCKR9PmwZWnwHsqls32EvqFtCyCJ7eXPf9UZlQlC', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWWprZFFTUUdlM0RuamFIeFZVT2FTa0FxUkN3eVo3MzVwUHdNUjRlQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490421),
('YDvKWT0K4IoqhDWOA5GpBQEFcsUZa328MYxjnp9T', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSVZUQVBodmJ4dTd0T3Y5Wlk0OUtaTTZ2czZUSU01UzBqaWtxZ2xsdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498135),
('YFXlcmX4ArLGUyhIYdRPQycnuCxhREcKdXf25SfG', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRTRCcjJIdUZRSXp3Y29nWmNsenk1VG9GbG9tR3VJUTM3S2ZtR3FQQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS91c2VyL2NsdWJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778490396),
('YK2GjIacs2Whpz176uBZ2kYmPo6bEda4C3r57N9W', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWVR4T21YVno4NVpxYk8zbFF1MXl3dk56YXUwY3o0cWpDOXR0NEpvVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490145),
('YL8wfKCj2aXlmZvfrZzlpVuSOQrFWTc5ywU8BYrf', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWGc3SkdnUGlHdkttRWRVY2VLY2FndkI5WGpmOVhNSzB3TkFFaWJFSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bmhtMWlESTZnMG9ud1hGdiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492023),
('ylADqNfg7bxkizSEkaLrQ1iLdleFXJ76cmtXp1MN', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWkM2OFpKZWdiYzdnQ21YNm9uQXRZMFNJM25ZdVNURHV1UnROY3BhcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6bkRJVDFuN2tiT0VNR0ZlTyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498075),
('ylQJCL3It9iMdXVm0aJl8HnTxUHr5iffL2idtobf', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidnNJVlJsTzB4RkhNSlI3NFhiOUNxVmRlOW95Y2lOaU5Cb2QwMHlqaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494814),
('yORdKHAu7ZLFeFuOJolmgtEeQvqhIk82vWkjIAHp', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVk1QeXhCOUhwWWtGekxNbEgzVndxcXBHa1hWSVZLV0RXZks2SnJDVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvcHJlc2lkZW50LW1lc3NhZ2UiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6Yms4RlFzREIzaHhqYVcxSyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492438),
('YujZkmDXXMLxwUnNRMTe8rS0RR5dhAQunUr5dOXQ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3lLbUxIbXpEYnBOYTNxaFEwdllIeGliU1lPV3NQVXRCYmVBSmEwdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778495672),
('yVy1OhSO7Uo0CSHVo1xi25PzA9TJr2QjmOgXCUxe', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWGhKcGtDOXFSMVQxMUVVTDNhTjBabENSYkFiRWxEVnQwZU9kT3FMMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi91cGNvbWluZy1ldmVudHMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6a0o0a283YTg1a0h5UTQ5dyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492591),
('Z7OZX1fb0eUQ0MLD5MyeimUUGHGAtGwc7ydKvnZC', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODV6NzJlQkxCUU9wZm1UamcwN3ZNeU1NMTVrdUlRQ1pLajBtYzJScCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778490309),
('zbANvrcLsKNEG6YfINYfqVTOHjyMTkERUTsg0YoU', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFpvUklEb0JCSzAyc280N3JrTG5HTnlpTjkyR2h3ME51a1p1WkJETyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490625),
('ZbR82jb9sMtaPKxBCmvUxAis7QzkVtGcVWoIPrMR', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibVlSNFRNTlU4b3p5Sk9JQjdPaUNTYTlxclFpUkNyeFZMdnIzM3ppSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494338),
('zc26C2IRUL8MbJPABvBDx03nmPapRosTL9bbet9v', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoickY3YkdaOFU1a3R4aVJWanMyVzRkYXFDT3g3MVRoV3psbEgwVkpxbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492220),
('ZexmVLlHORImb11TVEDjjW8Tg9r4Oqmg8XxL1s0X', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUFhRU1ZQYWZ6R0hrckFsZWVqMXp4UHVEcDR6b1lxWWtxcGhJdDVkViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9zdGF0cyI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpoMWtpeGdhTldtY2l6YTU1Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778493490),
('ZFlr2YfOx7KRpgheSN8mQzKD6IZu0uCQDHXHttCC', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkdNRmpWcEVaZE9iUWU0M1o0MmhRSVg2YlJqMDBzNUUzczNoaUcyOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvbmF2YmFyIjtzOjU6InJvdXRlIjtzOjI3OiJnZW5lcmF0ZWQ6OmpDSE1Dc1FZZFBBbkFtaE0iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1778492411),
('ZHBByxRdADBgpOXlURC4MYaDEOxk0YSZkqwJR9eT', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU3gzbTl3ZlpYUkJMRTRyR0pJRkJFOGtncExUOFRYOG1YVXJxVEpJViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6SHp2YW1EWHFYTmRNeElUMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778498065),
('zi8MZUmzE4B8zHVP09wDeQgUtl3hGuEoyJDQvVlU', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidjQ3Tjc3dEJvUFJqZXRkbFRqdW9rNHppTEg3TmpCZUx5bHZBYWExMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493494),
('ZjuSDkmVPmjrcU8UnFraV5zbnJgO1YdjAQc4KjvP', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMWdvTzJVRjJzdmtWUVZQcE5kdVRyYmdTT0twaVk2THI5b0NaQ05maiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9jaXRpZXMiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6ZkFyUE9QazNqM3V6bXhXayI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778492985),
('ZLiujW5JLEoZaNsJHjVTldgOmjf5b3xLNpu2uxVD', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUXFGY3VLRTlndTRDUWVIejBKUUEyMUQ5OEdlWmd2TDRaUWJNWFhJRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9tZWRpYSI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpDQ3o5bDg4ZXM3alowMzZlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778495825),
('zPa1X5FrG5i7yW828zGSTxqTXT30knj2UaYw7mcR', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicXprZ3h6MkEyd2hkbGJ3Qm9HUG9ORVhiUHg1SjA0NFdhRUt4OXNMTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hZG1pbi9hcHBsaWNhdGlvbnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778491226),
('ZPRbEjBc0MhTRgNdYFplPMzYgn8DVpU7GTMBf1dZ', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnpSUllkWnRoSFRIZ3ZsM1hYak9aRDJlZ0lUNWtyOWVZbjMwQXlheSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9hdXRoL3VzZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6WVZicFFoRkUwYXdKbGl5VyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778493578),
('zUiQYxG8JTOw5hv0NxmITD4elSHLoriaXXpD4Bvq', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRXZIN0F2RFdudFBaSVhOMmtOU2QySzhaWE9XSHpnQTBBc0tlRmNBViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778491008),
('ZuR7sOIp0Cf4sJSPjSyBXuzMuSvQWQrFpGLXPI7e', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVEtkWUdkOEM2UHhFdGowU1pqN21JRWhYaDlEMmFyV1hQZVpVN2I1UiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778494407),
('zVnr5wGFPHz8u75YOMQVcX2UxsIv8gskqQpKZn24', NULL, '196.74.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkFZSklONDRjSDd4SEhqTkVtWHN2NThzeFRGZWMxaFhBU1lnNm84SSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbXMvZGlzY292ZXIiO3M6NToicm91dGUiO3M6Mjc6ImdlbmVyYXRlZDo6VUVHZHdyeHE4ZHMydEFnVCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1778499865),
('zyrg5AVQpp54gSs3AfNHGnXMoij1CRHXuoYJaWMX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMXFhRGY2VzBnZHJYNVh1N1ZGMmlwa1lNMXRrZ2djYWtXcjdPRmd3TiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnL2FwaS9jbHVicyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778490745);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

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
