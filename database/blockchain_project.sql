-- phpMyAdmin SQL Dump
-- version 5.2.1
-- Questo è un file di dump generato da phpMyAdmin versione 5.2.1

-- Host: localhost
-- Informazioni sul server host locale

-- Creato il: Set 11, 2024 alle 12:24
-- Data e ora della creazione del dump

-- Versione del server: 10.4.28-MariaDB
-- Versione del database MariaDB

-- Versione PHP: 8.2.4
-- Versione PHP in uso

-- Disabilita la modalità SQL_AUTO_VALUE_ON_ZERO
-- Questo evita che il valore '0' venga utilizzato come auto-incremento
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- Inizia una transazione, il che significa che tutte le operazioni SQL
-- successive verranno eseguite come parte della stessa transazione
START TRANSACTION;

-- Imposta il fuso orario su UTC
SET time_zone = "+00:00";

-- Salva le impostazioni originali per client, risultati e connessione
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
 /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
 /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

-- Imposta la codifica dei caratteri a utf8mb4 per supportare Unicode
/*!40101 SET NAMES utf8mb4 */;

-- Sezione che descrive il database su cui viene operato
-- In questo caso, il database si chiama `blockchain_project`
--
-- Database: `blockchain_project`
--

-- --------------------------------------------------------

-- Struttura della tabella `Scores`
-- Questa tabella memorizza i punteggi dei giocatori per vari giochi
CREATE TABLE `Scores` (
  `id` int(11) NOT NULL, -- ID univoco per ogni giocatore
  `username` varchar(25) NOT NULL, -- Nome utente del giocatore
  `tetris` int(10) UNSIGNED NOT NULL DEFAULT 0, -- Punteggio di Tetris
  `snake` int(10) UNSIGNED NOT NULL DEFAULT 0, -- Punteggio di Snake
  `minesweeper` int(10) UNSIGNED DEFAULT 0, -- Punteggio di Minesweeper, opzionale
  `total` int(10) UNSIGNED NOT NULL DEFAULT 0 -- Totale punteggi dei giochi
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- La tabella usa il motore InnoDB per supportare le transazioni e utf8mb4 per la codifica

-- Trigger `Scores`
-- Questo trigger viene eseguito prima di ogni inserimento nella tabella `Scores`
-- Calcola il punteggio totale sommando i punteggi dei giochi
DELIMITER $$ -- Cambia il delimitatore di istruzioni SQL per includere trigger complessi
CREATE TRIGGER `before_scores_insert` 
BEFORE INSERT ON `Scores` 
FOR EACH ROW 
SET NEW.total = NEW.tetris + NEW.minesweeper + NEW.snake; -- Calcola il totale
$$
DELIMITER ; -- Ripristina il delimitatore standard

-- Stesso principio per il trigger `before_scores_update`, che calcola il totale prima di un aggiornamento
DELIMITER $$
CREATE TRIGGER `before_scores_update` 
BEFORE UPDATE ON `Scores` 
FOR EACH ROW 
SET NEW.total = NEW.tetris + NEW.minesweeper + NEW.snake; -- Aggiorna il totale
$$
DELIMITER ;

-- --------------------------------------------------------

-- Struttura della tabella `Users`
-- Questa tabella memorizza gli utenti e i loro indirizzi wallet
CREATE TABLE `Users` (
  `wallet_address` varchar(42) NOT NULL, -- Indirizzo wallet, chiave primaria
  `username` varchar(255) NOT NULL, -- Nome utente associato al wallet
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() -- Data e ora di creazione del record
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Indici per le tabelle scaricate
-- Creazione dell'indice primario per la tabella `Scores`
ALTER TABLE `Scores`
  ADD PRIMARY KEY (`id`); -- Imposta la colonna `id` come chiave primaria

-- Creazione dell'indice primario per la tabella `Users`
ALTER TABLE `Users`
  ADD PRIMARY KEY (`wallet_address`), -- Imposta l'indirizzo wallet come chiave primaria
  ADD UNIQUE KEY `username` (`username`); -- Imposta il nome utente come chiave univoca

-- AUTO_INCREMENT per la tabella `Scores`
-- Assegna l'auto-incremento alla colonna `id` per la tabella `Scores`
ALTER TABLE `Scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1; -- Ripristina l'auto-incremento a partire da 1

COMMIT; -- Conferma la transazione, rendendo permanenti tutte le modifiche

-- Ripristino delle impostazioni precedenti per client, risultati e connessione
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
 /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
 /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
