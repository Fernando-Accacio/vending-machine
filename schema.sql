-- --------------------------------------------------------
-- Servidor:                     shortline.proxy.rlwy.net
-- Versão do servidor:           9.4.0 - MySQL Community Server - GPL
-- OS do Servidor:               Linux
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para railway
CREATE DATABASE IF NOT EXISTS `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `railway`;

-- Copiando estrutura para tabela railway.dishes
CREATE TABLE IF NOT EXISTS `dishes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `custo` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `tempo_reposicao_min` int DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela railway.dishes: ~4 rows (aproximadamente)
INSERT INTO `dishes` (`id`, `custo`, `description`, `name`, `tempo_reposicao_min`, `is_active`) VALUES
	(12, 4.5, 'Pacote de absorventes higiênicos com 8 unidades, cobertura suave.', 'Absorvente Higiênico (Pacote 8 un.)', 10, b'1'),
	(13, 12, 'Pacote de fraldas infantis, tamanho P, com 10 unidades.', 'Fralda Infantil (Pacote P)', 20, b'1'),
	(14, 15, 'Lata de leite em pó integral instantâneo, 400g.', 'Leite em Pó (Lata 400g)', 15, b'1'),
	(15, 2.5, 'Cartela com 10 comprimidos de Paracetamol 500mg.', 'Analgésico Simples (Cartela)', 5, b'1');

-- Copiando estrutura para tabela railway.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `documento` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK66hiuien6n7r49ecmfugrcofc` (`documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela railway.users: ~2 rows (aproximadamente)
INSERT INTO `users` (`id`, `documento`, `email`, `name`, `password`, `phone_number`, `role`) VALUES
	(10, '555', 'gerente@gmail.com', 'Gerente', '$2a$10$u5VjPrBdHI7aNERFU1lpgOPXQjO./L0ugDZr/S9W1X2ayNeXiSQkC', '11555555555', 'GERENTE'),
	(11, '999', 'cliente@gmail.com', 'Cliente', '$2a$10$feJ8MTalP3eIm.qskANjkOUGsqFgFz6l3/mdYl2TXIjDEuJPOs1w6', '11999999999', 'cliente');

-- Copiando estrutura para tabela railway.withdrawals
CREATE TABLE IF NOT EXISTS `withdrawals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `total_cost` double DEFAULT NULL,
  `withdrawal_date` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKesk6migh8b3x43q3740dh5fja` (`user_id`),
  CONSTRAINT `FKesk6migh8b3x43q3740dh5fja` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela railway.withdrawals: ~1 rows (aproximadamente)
INSERT INTO `withdrawals` (`id`, `total_cost`, `withdrawal_date`, `user_id`) VALUES
	(11, 44.5, '2025-11-16 01:12:28.718304', 11);

-- Copiando estrutura para tabela railway.withdrawal_items
CREATE TABLE IF NOT EXISTS `withdrawal_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cost_at_time` double DEFAULT NULL,
  `quantity` int NOT NULL,
  `dish_id` bigint NOT NULL,
  `withdrawal_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8q16uqsyx54ag8wb6dgpplel6` (`dish_id`),
  KEY `FKj095oxjaj8wyfw8vtk3bkobin` (`withdrawal_id`),
  CONSTRAINT `FK8q16uqsyx54ag8wb6dgpplel6` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`),
  CONSTRAINT `FKj095oxjaj8wyfw8vtk3bkobin` FOREIGN KEY (`withdrawal_id`) REFERENCES `withdrawals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela railway.withdrawal_items: ~3 rows (aproximadamente)
INSERT INTO `withdrawal_items` (`id`, `cost_at_time`, `quantity`, `dish_id`, `withdrawal_id`) VALUES
	(11, 2.5, 1, 15, 11),
	(12, 15, 2, 14, 11),
	(13, 12, 1, 13, 11);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
