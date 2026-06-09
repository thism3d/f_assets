-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jun 09, 2026 at 07:06 PM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fifaapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_email` varchar(320) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `local_users`
--

CREATE TABLE `local_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(320) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `date_of_birth` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `local_users`
--

INSERT INTO `local_users` (`id`, `email`, `password`, `first_name`, `last_name`, `phone`, `country`, `language`, `date_of_birth`, `gender`, `role`, `created_at`, `updated_at`) VALUES
(1, 'muzahid@onzep.uk', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'Muzahid', 'Islam', NULL, NULL, 'en', NULL, NULL, 'user', '2026-06-08 20:08:37', '2026-06-08 20:08:37'),
(2, 'muzahid221@gmail.com', '6fe9e6ed4278ee0b011c76465b27fd1f8ac5efc5f7d9ed52e2051e0a90bd26ea', 'Muzahid', 'Islam', NULL, NULL, 'en', NULL, NULL, 'user', '2026-06-08 20:08:56', '2026-06-08 20:08:56'),
(3, 'muzahid185@gmail.com', '562ca7efaf52b8cbdc88cc2f9bbe6e41297d19d4ea1cdcab7316e18bdc639d29', 'Muzahid', 'Islam', NULL, NULL, 'en', NULL, NULL, 'user', '2026-06-08 20:22:57', '2026-06-08 20:22:57'),
(4, 'muzahid197@gmail.com', '562ca7efaf52b8cbdc88cc2f9bbe6e41297d19d4ea1cdcab7316e18bdc639d29', 'Muzahid', 'Islam', NULL, NULL, 'en', NULL, NULL, 'user', '2026-06-09 13:44:33', '2026-06-09 13:44:33'),
(5, 'muzahid221', 'bc2f46d5c52c5eed1f2d14f3b2f4cc85efd325844aad3acb738b9c4232296762', 'Admin', 'Muzahid', NULL, NULL, 'en', NULL, NULL, 'admin', '2026-06-09 13:47:04', '2026-06-09 13:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `event_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `venue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `match_date` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `match_time` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entrance` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hospitality_area` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gate` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suite` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `row` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seat` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticket_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stadium_section` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qr_code` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','used','transferred','resale_pending','resold','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `ticket_type` enum('upcoming','past') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'upcoming',
  `is_disabled_access` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `user_id`, `event_name`, `venue`, `match_date`, `match_time`, `entrance`, `hospitality_area`, `gate`, `suite`, `row`, `seat`, `ticket_category`, `price_category`, `stadium_section`, `qr_code`, `status`, `ticket_type`, `is_disabled_access`, `created_at`, `updated_at`) VALUES
(1, 4, 'Mexico vs South Africa', 'Aztech Stadium', '11 JUN 26', '12:30', 'E', NULL, 'G', NULL, '103', '331', 'Suite Barstool', NULL, NULL, NULL, 'active', 'upcoming', 0, '2026-06-09 13:50:08', '2026-06-09 13:50:08');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `ticket_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` enum('send','resale','exchange','receive') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `recipient_email` varchar(320) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `language` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `completed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `unionId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(320) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` text COLLATE utf8mb4_unicode_ci,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignInAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `__drizzle_migrations`
--

CREATE TABLE `__drizzle_migrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `__drizzle_migrations`
--

INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES
(1, 'efa2ca0e0b798ee4882d4bd8e8feee3918abb442b3b419034ac935b5603d6e5b', 1780948839751);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `local_users`
--
ALTER TABLE `local_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `local_users_email_unique` (`email`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `users_unionId_unique` (`unionId`);

--
-- Indexes for table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `local_users`
--
ALTER TABLE `local_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
