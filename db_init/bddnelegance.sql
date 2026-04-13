-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : db:3306
-- Généré le : lun. 13 avr. 2026 à 10:21
-- Version du serveur : 8.0.45
-- Version de PHP : 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bddnelegance`
--

-- --------------------------------------------------------

--
-- Structure de la table `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `sale_reference` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'eur',
  `status` enum('pending','paid','shipped','cancelled') DEFAULT 'pending',
  `payment_status` enum('unpaid','pending','paid','failed','refunded') NOT NULL DEFAULT 'unpaid',
  `payment_method` varchar(50) DEFAULT NULL,
  `stripe_checkout_session_id` varchar(255) DEFAULT NULL,
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL,
  `customer_nom` varchar(100) DEFAULT NULL,
  `customer_prenom` varchar(100) DEFAULT NULL,
  `customer_email` varchar(150) DEFAULT NULL,
  `shipping_address_line1` varchar(255) DEFAULT NULL,
  `shipping_address_line2` varchar(255) DEFAULT NULL,
  `shipping_postal_code` varchar(20) DEFAULT NULL,
  `shipping_city` varchar(100) DEFAULT NULL,
  `shipping_country` varchar(100) DEFAULT NULL,
  `billing_same_as_shipping` tinyint(1) NOT NULL DEFAULT '1',
  `paid_at` datetime DEFAULT NULL,
  `shipped_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `sale_reference`, `user_id`, `subtotal`, `shipping_amount`, `total`, `currency`, `status`, `payment_status`, `payment_method`, `stripe_checkout_session_id`, `stripe_payment_intent_id`, `customer_nom`, `customer_prenom`, `customer_email`, `shipping_address_line1`, `shipping_address_line2`, `shipping_postal_code`, `shipping_city`, `shipping_country`, `billing_same_as_shipping`, `paid_at`, `shipped_at`, `created_at`) VALUES
(1, '', 2, 0.00, 0.00, 79.50, 'eur', 'cancelled', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-02-13 10:28:29'),
(2, '', 2, 0.00, 0.00, 49.99, 'eur', 'pending', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-02-13 10:29:05'),
(3, '', 2, 0.00, 0.00, 79.50, 'eur', 'shipped', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-02-13 10:29:18'),
(4, '', 2, 0.00, 0.00, 25.99, 'eur', 'shipped', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-02-13 10:31:01'),
(5, 'VENTE-20260303-8474', 3, 0.00, 0.00, 59.00, 'eur', 'pending', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-03-03 18:08:20'),
(6, 'VENTE-20260303-6163', 2, 0.00, 0.00, 39.99, 'eur', 'paid', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-03-03 18:10:59'),
(7, 'VENTE-20260306-8777', 2, 0.00, 0.00, 79.50, 'eur', 'pending', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-03-06 10:52:48'),
(8, 'VENTE-20260306-3972', 4, 0.00, 0.00, 109.97, 'eur', 'cancelled', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-03-06 14:03:24'),
(9, 'VENTE-1775673116097', 6, 29.99, 0.00, 29.99, 'eur', 'pending', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 18:31:56'),
(10, 'VENTE-1775673122409', 6, 29.99, 0.00, 29.99, 'eur', 'pending', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 18:32:02'),
(11, 'VENTE-1775676629157', 6, 29.99, 0.00, 29.99, 'eur', 'pending', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 19:30:29'),
(12, 'VENTE-1775676817438', 6, 29.99, 0.00, 29.99, 'eur', 'pending', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 19:33:37'),
(13, 'VENTE-1775679907722', 6, 29.99, 0.00, 29.99, 'eur', 'pending', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 20:25:07'),
(14, 'VENTE-1775679925654', 6, 39.99, 0.00, 39.99, 'eur', 'pending', 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 20:25:25'),
(15, 'VENTE-1775680558434', 6, 69.99, 0.00, 69.99, 'eur', 'pending', 'unpaid', NULL, 'cs_test_a1vDLWW4GnzLeGWwjF5MbsoK9aSaYgyPZFgF14PdXW9XyqYugfXheP3ANH', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 20:35:58'),
(16, 'VENTE-1775682025965', 6, 39.99, 0.00, 39.99, 'eur', 'pending', 'unpaid', NULL, 'cs_test_a1Knn7mCkAvP02pbSJ3IFWbpjgbmfgv9TCX2mxNIPLohX9iWf60ZxxxiRV', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 21:00:25'),
(17, 'VENTE-1775682254826', 6, 49.99, 0.00, 49.99, 'eur', 'pending', 'unpaid', NULL, 'cs_test_a1cagMS97im0a6JncGHayUxMA1ZkE4Wjak5jWMpPnBBNfxeZWfv59HRzRd', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 21:04:14'),
(18, 'VENTE-1775683052733', 6, 29.99, 0.00, 29.99, 'eur', 'pending', 'unpaid', NULL, 'cs_test_a1AXtldIcBa2kFwBuSrKWRdxTEr6gqgZvRYjO0I28tvXebHs35sMorYPE0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-08 21:17:32'),
(19, 'VENTE-1775683696659', 6, 79.50, 0.00, 79.50, 'eur', 'paid', 'paid', NULL, 'cs_test_a1178pPoolHQ4V69PT5gxH4SRvZsoSDBrZvpyrEfv8reJ6JIXrjQ83t5Go', 'pi_3TK3eNEpT7w2Jyvb0hjP5c2j', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-04-08 21:28:40', NULL, '2026-04-08 21:28:16'),
(20, 'VENTE-1775684453408', 6, 29.99, 0.00, 29.99, 'eur', 'paid', 'paid', NULL, 'cs_test_a1nEhoD1gpbomSoH7p7Q6TgIoXjaUk0xDJInR0Gh4wBw6IFMIYcJNiEEQm', 'pi_3TK3qXEpT7w2Jyvb0AJaey23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-04-08 21:41:14', NULL, '2026-04-08 21:40:53'),
(21, 'VENTE-1775685990455', 6, 29.99, 0.00, 29.99, 'eur', 'paid', 'paid', NULL, 'cs_test_a1YebbzZJ9EoqbCw3kPYWMdAP9AZcmBxqxTtlwHy2NB0XcVFV971FFQ7OT', 'pi_3TK4FOEpT7w2Jyvb1PjiTV5s', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-04-08 22:06:56', NULL, '2026-04-08 22:06:30'),
(22, 'VENTE-1775902551896', 2, 29.99, 0.00, 29.99, 'eur', 'shipped', 'unpaid', NULL, 'cs_test_a13lwp7U2ggLwhYnmMwCXK8kOZy0FQP1YweSTIQB7ZR1eWgr1lwZQXqyoj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, '2026-04-11 10:15:51');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `line_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `unit_price`, `line_total`, `quantity`, `price`) VALUES
(1, 1, 2, NULL, NULL, 0.00, 0.00, 1, 79.50),
(3, 3, 5, NULL, NULL, 0.00, 0.00, 1, 79.50),
(4, 4, 4, NULL, NULL, 0.00, 0.00, 1, 25.99),
(5, 5, 1, NULL, NULL, 0.00, 0.00, 1, 59.00),
(6, 6, 5, NULL, NULL, 0.00, 0.00, 1, 39.99),
(7, 7, 2, NULL, NULL, 0.00, 0.00, 1, 79.50),
(8, 8, 5, NULL, NULL, 0.00, 0.00, 1, 39.99),
(9, 8, 27, NULL, NULL, 0.00, 0.00, 1, 29.99),
(10, 8, 29, NULL, NULL, 0.00, 0.00, 1, 39.99),
(11, 9, 32, 'Bague Inox', 'product_69aae7f37af176.37534077.jpeg', 29.99, 29.99, 1, 29.99),
(12, 10, 32, 'Bague Inox', 'product_69aae7f37af176.37534077.jpeg', 29.99, 29.99, 1, 29.99),
(13, 11, 32, 'Bague Inox', 'product_69aae7f37af176.37534077.jpeg', 29.99, 29.99, 1, 29.99),
(14, 12, 32, 'Bague Inox', 'product_69aae7f37af176.37534077.jpeg', 29.99, 29.99, 1, 29.99),
(15, 13, 32, 'Bague Inox', 'product_69aae7f37af176.37534077.jpeg', 29.99, 29.99, 1, 29.99),
(16, 14, 23, 'Boucles d\'oreilles', 'product_6994b00e385f07.20950019.jpeg', 39.99, 39.99, 1, 39.99),
(17, 15, 28, 'Bracelet', 'product_6994ad0fece865.15888215.jpeg', 69.99, 69.99, 1, 69.99),
(18, 16, 23, 'Boucles d\'oreilles', 'product_6994b00e385f07.20950019.jpeg', 39.99, 39.99, 1, 39.99),
(19, 17, 22, 'Collier', 'product_6994afbaea4d62.19366276.jpeg', 49.99, 49.99, 1, 49.99),
(20, 18, 13, 'Collier', 'product_6994af86987d60.47104194.jpeg', 29.99, 29.99, 1, 29.99),
(21, 19, 2, 'Collier', 'product_6994ae867407a6.85622489.jpeg', 79.50, 79.50, 1, 79.50),
(22, 20, 32, 'Bague Inox', 'product_69aae7f37af176.37534077.jpeg', 29.99, 29.99, 1, 29.99),
(23, 21, 32, 'Bague Inox', 'product_69aae7f37af176.37534077.jpeg', 29.99, 29.99, 1, 29.99),
(24, 22, 32, 'Bague Inox', 'product_69aae7f37af176.37534077.jpeg', 29.99, 29.99, 1, 29.99);

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `sku`, `description`, `short_description`, `price`, `stock`, `is_active`, `created_at`) VALUES
(1, 'Boucles d\'oreilles', NULL, NULL, 'Look élégant en forme de bulle', NULL, 57.00, 100, 1, '2026-02-13 09:41:01'),
(2, 'Collier', NULL, NULL, 'Au couleur du printemps', NULL, 79.50, 99, 1, '2026-02-13 09:41:01'),
(4, 'Bracelet', NULL, NULL, 'Indémodable , il se porte très bien avec du rouge !', NULL, 25.99, 100, 1, '2026-02-13 09:50:18'),
(5, 'Boucles d\'oreilles', NULL, NULL, 'Imitation or, elles sont élégante et scintillante.', NULL, 39.99, 100, 1, '2026-02-13 09:50:18'),
(13, 'Collier', NULL, NULL, 'Collier en acier', NULL, 29.99, 99, 1, '2026-02-14 08:10:38'),
(22, 'Collier', NULL, NULL, 'Collier multiple, léger, il se porte très facilement', NULL, 49.99, 99, 1, '2026-02-14 13:26:35'),
(23, 'Boucles d\'oreilles', NULL, NULL, 'Des boucles simple, mais belles !', NULL, 39.99, 98, 1, '2026-02-14 13:34:43'),
(27, 'Bague', NULL, NULL, 'Style marin, passe partout, très confort et résistant', NULL, 29.99, 100, 1, '2026-02-16 10:02:25'),
(28, 'Bracelet', NULL, NULL, 'Look Egyptien, couleur or, il sublime vos robes de soirées.', NULL, 69.99, 99, 1, '2026-02-17 18:01:51'),
(29, 'Bracelet', NULL, NULL, 'Boémian !', NULL, 39.99, 100, 1, '2026-02-17 18:18:49'),
(31, 'Collier chaîne', NULL, NULL, 'PROMO en cours !! Profitez-en !! \r\nDouble collier en plaqué or, imitation chaîne. ', NULL, 29.99, 100, 1, '2026-03-06 13:47:23'),
(32, 'Bague Inox', NULL, NULL, 'Bague en acier inoxydable, idéale pour utilisation courante', NULL, 29.99, 92, 1, '2026-03-06 14:42:59'),
(35, 'Sacoche', NULL, NULL, 'Petite sacoche Nike des familles', NULL, 39.00, 12, 1, '2026-04-11 11:09:09'),
(36, 'coudodi', NULL, NULL, 'dsdvdsfvdsfb', NULL, 30.00, 10, 1, '2026-04-11 11:26:44');

-- --------------------------------------------------------

--
-- Structure de la table `product_images`
--

CREATE TABLE `product_images` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image`) VALUES
(10, 1, 'product_69907720b77730.63195563.jpeg'),
(22, 28, 'product_6994ad0fece865.15888215.jpeg'),
(24, 2, 'product_6994ae867407a6.85622489.jpeg'),
(25, 4, 'product_6994aedfbfc4b1.30387050.jpeg'),
(26, 4, 'product_6994aee8451116.36160059.jpeg'),
(27, 5, 'product_6994af28565d77.33852861.jpeg'),
(28, 5, 'product_6994af4a864de3.64598460.jpeg'),
(29, 5, 'product_6994af6ec1b5d4.71139584.jpeg'),
(30, 13, 'product_6994af86987d60.47104194.jpeg'),
(31, 13, 'product_6994af8698f3b3.42822297.jpeg'),
(32, 13, 'product_6994af86998b73.02609300.jpeg'),
(33, 22, 'product_6994afbaea4d62.19366276.jpeg'),
(34, 22, 'product_6994afbaeabc61.81194282.jpeg'),
(35, 23, 'product_6994b00e385f07.20950019.jpeg'),
(36, 23, 'product_6994b00e38d235.65637962.jpeg'),
(37, 23, 'product_6994b00e3972d7.44068080.jpeg'),
(38, 27, 'product_6994b045e05c16.18373042.jpeg'),
(39, 27, 'product_6994b045e0da86.21769887.jpeg'),
(40, 28, 'product_6994b0978ff322.06550462.jpeg'),
(41, 28, 'product_6994b097907127.66210872.jpeg'),
(43, 1, 'product_6994b0d85d8755.67729400.jpeg'),
(44, 1, 'product_6994b0d85e6d64.30820013.jpeg'),
(45, 29, 'product_6994b1095bcf52.89130810.jpeg'),
(46, 29, 'product_6994b1095c4ed1.40658350.jpeg'),
(47, 29, 'product_6994b1095d3337.95794465.jpeg'),
(48, 29, 'product_6994b1095dcf99.99202556.jpeg'),
(50, 31, 'product_69aadaeba35132.51430267.jpeg'),
(51, 32, 'product_69aae7f37af176.37534077.jpeg'),
(52, 31, 'product_69aaeda57ac5b4.82213346.jpeg'),
(53, 35, 'default.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roles` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password`, `roles`, `created_at`) VALUES
(2, 'delpino', 'lucas', 'test@nelegance.fr', '$2y$10$44ArV3P.YLKqL.i1MYaebuuAzCIqE.imItMh1a8kybIVln6hWpVQm', 'user', '2026-02-13 10:27:40'),
(3, 'Lob', 'Madi', 'mad@g.com', '$2y$10$FV3MVWV11b0HGI.IYqoh5uvRBfrcgWSp3PbJPzl6rss/Es3fAlZye', 'admin', '2026-02-13 14:28:29'),
(4, 'Dupont', 'Corine', 'dupont.corine@free.fr', '$2y$10$kOzDySkCmn.Pwxsuoe42keyqNRv8cOD0qc8ArY4k1Gjb6sfxnmJYy', 'user', '2026-03-06 13:55:59'),
(5, 'Test', 'Lucas', 'lucas.test@nelegance.fr', '$2b$10$/LVaxeR7ua8iBjjV7ClyPOFvJlbUQ5zhzgd5ZKqS1PFRwNU1CB1wu', 'user', '2026-04-08 13:36:49'),
(6, 'Mo', 'Bil', 'mobil.test@test.fr', '$2b$10$h/A2Jeqb8Lo6JvXgVGwgNeYy0vfwvygYtfX6xSAd9Q4lNv1KCb/0u', 'user', '2026-04-08 13:47:59');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_products_slug` (`slug`),
  ADD UNIQUE KEY `uq_products_sku` (`sku`);

--
-- Index pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
