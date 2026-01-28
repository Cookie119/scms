-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2026 at 02:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('super_admin','admin','editor') DEFAULT 'editor',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `full_name`, `email`, `role`, `last_login`, `created_at`) VALUES
(2, 'admin', '$2a$12$qr/825BaO9HMaAroseLpU.uX0hIQAHYimZAthNdAw0myMfycQreXO', 'Administrator', 'admin@school.edu', 'editor', '2026-01-26 13:40:27', '2026-01-26 13:38:26');

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `slug`, `description`, `is_active`, `created_at`) VALUES
(1, 'School News', 'school-news', 'Latest news and announcements from school', 1, '2026-01-26 06:37:35'),
(2, 'Events', 'events', 'Upcoming and past school events', 1, '2026-01-26 06:37:35'),
(3, 'Academic', 'academic', 'Academic achievements and updates', 1, '2026-01-26 06:37:35'),
(4, 'Sports', 'sports', 'Sports activities and achievements', 1, '2026-01-26 06:37:35'),
(5, 'Cultural', 'cultural', 'Cultural events and activities', 1, '2026-01-26 06:37:35');

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `content` longtext NOT NULL,
  `excerpt` text DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `author_id` int(11) DEFAULT 1,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `views` int(11) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `content`, `excerpt`, `featured_image`, `category_id`, `author_id`, `status`, `views`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Annual Sports Day 2024', 'annual-sports-day-2024', '    <h2>Exciting Sports Day Event</h2><p>The annual sports day was held with great enthusiasm...</p>', '    Exciting Sports Day EventThe annual sports day was held with great enthusiasm...', NULL, 4, 1, 'published', 0, 1, '2026-01-26 08:25:26', '2026-01-26 06:37:35', '2026-01-26 08:25:26'),
(2, 'Science Exhibition Winners', 'science-exhibition-winners', '<h2>Young Scientists Shine</h2><p>Our students won 3 awards at the inter-school science exhibition...</p>', 'Science exhibition achievements', NULL, 3, 1, 'published', 0, 1, '2026-01-26 08:26:08', '2026-01-26 06:37:35', '2026-01-26 08:26:08'),
(3, 'somthing', '', 'somthing ', 'somthing ', NULL, 5, 1, 'draft', 0, 1, '2026-01-26 07:33:05', '2026-01-26 07:07:46', '2026-01-26 07:33:05'),
(6, 'something', 'something', 'something', 'something', '1769412751_slide3.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 07:32:40', '2026-01-26 07:32:31', '2026-01-26 07:32:40'),
(7, 'something', 'something-1769412757', 'something', 'something', '1769412757_slide3.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 07:32:42', '2026-01-26 07:32:37', '2026-01-26 07:32:42'),
(8, 'sothing ', 'sothing', 'sothing', 'sothing', '1769412785_WhatsApp Image 2025-12-20 at 7.07.06 AM.jpeg', 3, 1, 'draft', 0, 1, '2026-01-26 07:48:47', '2026-01-26 07:33:05', '2026-01-26 07:48:47'),
(9, 'something ', 'something-1769412881', 'something', 'something', '1769412881_slide2.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 07:48:43', '2026-01-26 07:34:41', '2026-01-26 07:48:43'),
(10, 'somthing ', 'somthing', '<p><strong>somthing</strong></p>\r\n', 'somthing\r\n', '1769413354_slide3.jpg', 3, 1, 'draft', 0, 0, NULL, '2026-01-26 07:42:34', '2026-01-26 07:42:34'),
(11, 'somthing ', 'somthing-1769413389', '<p><strong>somthing</strong></p>\r\n', 'somthing\r\n', '1769413389_slide3.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 07:48:59', '2026-01-26 07:43:09', '2026-01-26 07:48:59'),
(12, 'somthing ', 'somthing-1769413399', '<p><strong>somthing</strong></p>\r\n', 'somthing\r\n', '1769413399_slide3.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 07:48:54', '2026-01-26 07:43:19', '2026-01-26 07:48:54'),
(13, 'somthing ', 'somthing-1769413600', '<p><strong>somthing</strong></p>\r\n', 'somthing\r\n', '1769413600_slide3.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 07:49:03', '2026-01-26 07:46:40', '2026-01-26 07:49:03'),
(14, 'something ', 'something-1769413727', 'something', 'something', '1769413727_slide2.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 07:48:50', '2026-01-26 07:48:47', '2026-01-26 07:48:50'),
(15, 'new blog', 'new-blog', 'dont know what to add but here is something', 'dont know what to add but here is something', '1769415968_IMG_20250929_150338.jpg', 5, 1, 'draft', 0, 0, NULL, '2026-01-26 08:26:08', '2026-01-26 08:26:08'),
(16, 'damn', 'damn', 'damn', 'damn', '1769432776_71WE6gC2OnL._SY450_.jpg', 3, 1, 'draft', 0, 0, NULL, '2026-01-26 13:06:16', '2026-01-26 13:06:16'),
(17, 'damn', 'damn-1769433007', 'damn', 'damn', '1769433007_71WE6gC2OnL._SY450_.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 13:14:42', '2026-01-26 13:10:07', '2026-01-26 13:14:42'),
(18, 'damn', 'damn-1769433016', 'damn', 'damn', '1769433016_71WE6gC2OnL._SY450_.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 13:10:43', '2026-01-26 13:10:16', '2026-01-26 13:10:43'),
(19, 'damn', 'damn-1769433021', 'damn', 'damn', '1769433021_71WE6gC2OnL._SY450_.jpg', 3, 1, 'draft', 0, 1, '2026-01-26 13:10:39', '2026-01-26 13:10:21', '2026-01-26 13:10:39'),
(20, 'damn2', 'damn2', 'damn2', 'damn2', '1769433298_ha (1).png', 5, 1, 'draft', 0, 0, NULL, '2026-01-26 13:14:58', '2026-01-26 13:14:58');

-- --------------------------------------------------------

--
-- Table structure for table `curriculum`
--

CREATE TABLE `curriculum` (
  `id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `subject_name` varchar(200) NOT NULL,
  `content` longtext NOT NULL,
  `academic_year` year(4) DEFAULT NULL,
  `grade_level` varchar(50) DEFAULT NULL,
  `chapters` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curriculum`
--

INSERT INTO `curriculum` (`id`, `section_id`, `subject_name`, `content`, `academic_year`, `grade_level`, `chapters`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 2, 'Mathematics', '<h3>Grade 5 Mathematics</h3><p>Focus on basic arithmetic, geometry, and measurements...</p>', '2024', 'Grade 5', 'Numbers, Geometry, Measurements', 0, NULL, '2026-01-26 06:37:35', '2026-01-26 06:37:35'),
(2, 4, 'Physics', '<h3>Grade 11 Physics</h3><p>Advanced physics concepts including mechanics, thermodynamics...</p>', '2024', 'Grade 11', 'Mechanics, Thermodynamics, Optics', 0, NULL, '2026-01-26 06:37:35', '2026-01-26 06:37:35'),
(3, 2, 'history', '<h1>Green land <h1>\r\n<p>greenland is place </p>', '2026', 'Class 4', 'history about greenland', 0, NULL, '2026-01-26 10:24:22', '2026-01-26 10:24:22'),
(4, 1, 'maths', '<h1> history in h1<h1>\r\n', '2026', 'Class 4', 'history about greenland', 0, NULL, '2026-01-26 13:03:34', '2026-01-26 13:03:34');

-- --------------------------------------------------------

--
-- Table structure for table `curriculum_sections`
--

CREATE TABLE `curriculum_sections` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curriculum_sections`
--

INSERT INTO `curriculum_sections` (`id`, `name`, `slug`, `description`, `display_order`, `is_active`, `created_at`) VALUES
(1, 'Pre-Primary', 'pre-primary', 'Kindergarten and Pre-school curriculum', 1, 1, '2026-01-26 06:37:35'),
(2, 'Primary', 'primary', 'Primary school curriculum (Grade 1-5)', 2, 1, '2026-01-26 06:37:35'),
(3, 'Middle School', 'middle-school', 'Middle school curriculum (Grade 6-8)', 3, 1, '2026-01-26 06:37:35'),
(4, 'High School', 'high-school', 'High school curriculum (Grade 9-12)', 4, 1, '2026-01-26 06:37:35');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `slug`, `description`, `display_order`, `is_active`, `created_at`) VALUES
(1, 'Management', 'management', 'School management and board', 1, 1, '2026-01-26 06:37:35'),
(2, 'Administration', 'administration', 'Administrative department', 2, 1, '2026-01-26 06:37:35'),
(3, 'Academics', 'academics', 'Academic department', 3, 1, '2026-01-26 06:37:35'),
(4, 'Examination', 'examination', 'Examination department', 4, 1, '2026-01-26 06:37:35'),
(5, 'Sports', 'sports', 'Sports department', 5, 1, '2026-01-26 06:37:35'),
(6, 'Finance', 'finance', 'Finance and accounts department', 6, 1, '2026-01-26 06:37:35');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_categories`
--

CREATE TABLE `gallery_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery_categories`
--

INSERT INTO `gallery_categories` (`id`, `name`, `slug`, `description`, `is_active`, `created_at`) VALUES
(1, 'Annual Day', 'annual-day', 'Annual day celebrations', 1, '2026-01-26 06:37:35'),
(2, 'Sports Day', 'sports-day', 'Sports day events', 1, '2026-01-26 06:37:35'),
(3, 'Cultural Fest', 'cultural-fest', 'Cultural festival events', 1, '2026-01-26 06:37:35'),
(4, 'Classroom', 'classroom', 'Classroom activities', 1, '2026-01-26 06:37:35'),
(5, 'Excursion', 'excursion', 'School trips and excursions', 1, '2026-01-26 06:37:35');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_images`
--

CREATE TABLE `gallery_images` (
  `id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `image_name` varchar(200) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery_images`
--

INSERT INTO `gallery_images` (`id`, `title`, `description`, `image_path`, `image_name`, `category_id`, `event_date`, `display_order`, `is_deleted`, `deleted_at`, `uploaded_at`) VALUES
(1, 'Sports Day Opening', 'Chief guest inaugurating sports day', 'sports_day_1.jpg', 'Sports Day Opening', 2, '2024-01-15', 0, 1, '2026-01-26 08:27:25', '2026-01-26 06:37:35'),
(2, 'Cultural Dance', 'Traditional dance performance', 'cultural_dance.jpg', 'Cultural Dance', 3, '2024-02-20', 0, 1, '2026-01-26 08:32:17', '2026-01-26 06:37:35'),
(3, '', '', '69772669ba5cf_1769416297.png', 'Gemini_Generated_Image_4swsw04swsw04sws', NULL, NULL, 0, 0, NULL, '2026-01-26 08:31:37'),
(4, 'added new image ', 'added new image', '69772691438c2_1769416337.jpg', 'slide1', NULL, NULL, 0, 0, NULL, '2026-01-26 08:32:17');

-- --------------------------------------------------------

--
-- Table structure for table `management_team`
--

CREATE TABLE `management_team` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `management_team`
--

INSERT INTO `management_team` (`id`, `name`, `designation`, `department_id`, `bio`, `email`, `phone`, `image_path`, `display_order`, `is_active`, `is_deleted`, `deleted_at`, `created_at`) VALUES
(1, 'Dr. Ramesh Sharma', 'Principal', 3, 'PhD in Education with 25 years of experience', 'principal@school.edu', '+91 9876543210', NULL, 0, 1, 1, '2026-01-26 10:32:53', '2026-01-26 06:37:35'),
(2, 'Mrs. Sunita Patel', 'Vice Principal', 3, 'M.Ed with 20 years of teaching experience', 'viceprincipal@school.edu', '+91 9876543211', NULL, 0, 1, 1, '2026-01-26 10:32:50', '2026-01-26 06:37:35'),
(3, 'Mr. Rajesh Gupta', 'Accounts Head', 6, 'Chartered Accountant with 15 years experience', 'accounts@school.edu', '+91 9876543212', NULL, 0, 1, 1, '2026-01-26 10:51:50', '2026-01-26 06:37:35'),
(4, 'some fucker idk ', 'english', 2, 'idk who is he', NULL, NULL, '697742c82182b_1769423560.jpg', 0, 1, 0, NULL, '2026-01-26 10:32:40'),
(5, 'some fucker idk ', 'english', 1, 'ifk ', NULL, NULL, NULL, 0, 1, 0, NULL, '2026-01-26 10:39:15'),
(6, 'some fucker idk ', 'english', 3, 'idk', NULL, NULL, '69774746a1788_1769424710.png', 0, 1, 0, NULL, '2026-01-26 10:51:50'),
(7, ' test', 'test', 2, 'test', NULL, NULL, '697755c28e3b1_1769428418.png', 0, 1, 0, NULL, '2026-01-26 11:53:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `curriculum`
--
ALTER TABLE `curriculum`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `curriculum_sections`
--
ALTER TABLE `curriculum_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `gallery_categories`
--
ALTER TABLE `gallery_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `management_team`
--
ALTER TABLE `management_team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `department_id` (`department_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `curriculum`
--
ALTER TABLE `curriculum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `curriculum_sections`
--
ALTER TABLE `curriculum_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `gallery_categories`
--
ALTER TABLE `gallery_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `management_team`
--
ALTER TABLE `management_team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`);

--
-- Constraints for table `curriculum`
--
ALTER TABLE `curriculum`
  ADD CONSTRAINT `curriculum_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `curriculum_sections` (`id`);

--
-- Constraints for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD CONSTRAINT `gallery_images_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `gallery_categories` (`id`);

--
-- Constraints for table `management_team`
--
ALTER TABLE `management_team`
  ADD CONSTRAINT `management_team_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
