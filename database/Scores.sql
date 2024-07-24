-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Lug 24, 2024 alle 20:26
-- Versione del server: 10.4.28-MariaDB
-- Versione PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Blockchain_project`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `Scores`
--

CREATE TABLE `Scores` (
  `id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `tetris` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `snake` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `minesweeper` int(10) UNSIGNED DEFAULT 0,
  `total` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `Scores`
--

INSERT INTO `Scores` (`id`, `username`, `tetris`, `snake`, `minesweeper`, `total`) VALUES
(18, 'stefano', 0, 6, 18, 24),
(19, 'prova', 0, 0, 18, 18),
(20, 'prova2', 166, 0, 0, 166),
(21, 'kkmkmk', 0, 6, 0, 6);

--
-- Trigger `Scores`
--
DELIMITER $$
CREATE TRIGGER `before_scores_insert` BEFORE INSERT ON `Scores` FOR EACH ROW SET NEW.total = NEW.tetris + NEW.minesweeper + NEW.snake
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_scores_update` BEFORE UPDATE ON `Scores` FOR EACH ROW SET NEW.total = NEW.tetris + NEW.minesweeper + NEW.snake
$$
DELIMITER ;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `Scores`
--
ALTER TABLE `Scores`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `Scores`
--
ALTER TABLE `Scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
