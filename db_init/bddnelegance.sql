-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : dim. 08 mars 2026 à 09:17
-- Version du serveur : 5.7.24
-- Version de PHP : 8.3.1

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
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `sale_reference` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','shipped','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `sale_reference`, `user_id`, `total`, `status`, `created_at`) VALUES
(1, '', 2, '79.50', 'cancelled', '2026-02-13 10:28:29'),
(2, '', 2, '49.99', 'pending', '2026-02-13 10:29:05'),
(3, '', 2, '79.50', 'shipped', '2026-02-13 10:29:18'),
(4, '', 2, '25.99', 'shipped', '2026-02-13 10:31:01'),
(5, 'VENTE-20260303-8474', 3, '59.00', 'pending', '2026-03-03 18:08:20'),
(6, 'VENTE-20260303-6163', 2, '39.99', 'paid', '2026-03-03 18:10:59'),
(7, 'VENTE-20260306-8777', 2, '79.50', 'pending', '2026-03-06 10:52:48'),
(8, 'VENTE-20260306-3972', 4, '109.97', 'pending', '2026-03-06 14:03:24');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 2, 1, '79.50'),
(3, 3, 5, 1, '79.50'),
(4, 4, 4, 1, '25.99'),
(5, 5, 1, 1, '59.00'),
(6, 6, 5, 1, '39.99'),
(7, 7, 2, 1, '79.50'),
(8, 8, 5, 1, '39.99'),
(9, 8, 27, 1, '29.99'),
(10, 8, 29, 1, '39.99');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `created_at`) VALUES
(1, 'Boucles d\'oreilles', 'Look élégant en forme de bulle', '57.00', '2026-02-13 09:41:01'),
(2, 'Collier', 'Au couleur du printemps', '79.50', '2026-02-13 09:41:01'),
(4, 'Bracelet', 'Indémodable , il se porte très bien avec du rouge !', '25.99', '2026-02-13 09:50:18'),
(5, 'Boucles d\'oreilles', 'Imitation or, elles sont élégante et scintillante.', '39.99', '2026-02-13 09:50:18'),
(13, 'Collier', 'Collier en acier', '29.99', '2026-02-14 08:10:38'),
(22, 'Collier', 'Collier multiple, léger, il se porte très facilement', '49.99', '2026-02-14 13:26:35'),
(23, 'Boucles d\'oreilles', 'Des boucles simple, mais belles !', '39.99', '2026-02-14 13:34:43'),
(27, 'Bague', 'Style marin, passe partout, très confort et résistant', '29.99', '2026-02-16 10:02:25'),
(28, 'Bracelet', 'Look Egyptien, couleur or, il sublime vos robes de soirées.', '69.99', '2026-02-17 18:01:51'),
(29, 'Bracelet', 'Boémian !', '39.99', '2026-02-17 18:18:49'),
(31, 'Collier chaîne', 'PROMO en cours !! Profitez-en !! \r\nDouble collier en plaqué or, imitation chaîne. ', '29.99', '2026-03-06 13:47:23'),
(32, 'Bague Inox', 'Bague en acier inoxydable, idéale pour utilisation courante', '29.99', '2026-03-06 14:42:59');

-- --------------------------------------------------------

--
-- Structure de la table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
(52, 31, 'product_69aaeda57ac5b4.82213346.jpeg');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roles` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password`, `roles`, `created_at`) VALUES
(2, 'delpino', 'lucas', 'test@nelegance.fr', '$2y$10$44ArV3P.YLKqL.i1MYaebuuAzCIqE.imItMh1a8kybIVln6hWpVQm', 'user', '2026-02-13 10:27:40'),
(3, 'Lob', 'Madi', 'mad@g.com', '$2y$10$FV3MVWV11b0HGI.IYqoh5uvRBfrcgWSp3PbJPzl6rss/Es3fAlZye', 'admin', '2026-02-13 14:28:29'),
(4, 'Dupont', 'Corine', 'dupont.corine@free.fr', '$2y$10$kOzDySkCmn.Pwxsuoe42keyqNRv8cOD0qc8ArY4k1Gjb6sfxnmJYy', 'user', '2026-03-06 13:55:59');

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
