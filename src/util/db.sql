-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: serprovisa_db
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `family`
--

DROP TABLE IF EXISTS `family`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `family` (
  `id_fam` int NOT NULL AUTO_INCREMENT,
  `cod_fam` char(5) DEFAULT NULL,
  `des_fam` varchar(45) DEFAULT NULL,
  `status_fam` char(1) DEFAULT NULL,
  PRIMARY KEY (`id_fam`),
  UNIQUE KEY `idfamily_UNIQUE` (`id_fam`),
  UNIQUE KEY `cod_UNIQUE` (`cod_fam`),
  UNIQUE KEY `des_fam_UNIQUE` (`des_fam`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family`
--

LOCK TABLES `family` WRITE;
/*!40000 ALTER TABLE `family` DISABLE KEYS */;
INSERT INTO `family` VALUES (129,'FAM','AMBIENTACION','1'),(130,'FDI','DISPLAY','1'),(131,'FES','ESTRUCTURAS','1'),(132,'FPO','POP','1');
/*!40000 ALTER TABLE `family` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_produc`
--

DROP TABLE IF EXISTS `group_produc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_produc` (
  `id_grou` int NOT NULL AUTO_INCREMENT,
  `cod_gru` varchar(5) DEFAULT NULL,
  `des_gru` varchar(50) DEFAULT NULL,
  `status_gru` char(1) DEFAULT NULL,
  `linea_id_line` int NOT NULL,
  `fec_regis` date NOT NULL,
  `fam_id_familia` int NOT NULL,
  `cod_gru_final` varchar(50) DEFAULT NULL,
  `total_product` int DEFAULT '0',
  PRIMARY KEY (`id_grou`),
  UNIQUE KEY `idgrupo_UNIQUE` (`id_grou`),
  UNIQUE KEY `cod_gru_UNIQUE` (`cod_gru`),
  UNIQUE KEY `des_gru_UNIQUE` (`des_gru`),
  KEY `fk_grupo_Linea1_idx` (`linea_id_line`),
  KEY `fam_id_familia_idx` (`fam_id_familia`),
  CONSTRAINT `fam_id_familia` FOREIGN KEY (`fam_id_familia`) REFERENCES `family` (`id_fam`),
  CONSTRAINT `fk_grupo_Linea1` FOREIGN KEY (`linea_id_line`) REFERENCES `linea` (`id_line`)
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_produc`
--

LOCK TABLES `group_produc` WRITE;
/*!40000 ALTER TABLE `group_produc` DISABLE KEYS */;
INSERT INTO `group_produc` VALUES (167,'GMA','MATE','1',45,'2023-12-12',129,'AMB-BAN-MAT',1),(168,'GAR','ARAÑA','1',45,'2023-12-12',130,'DIS-PAR-ARA',0),(169,'GCO','COLUMNA','1',47,'2023-12-12',131,'EST-COL-COL',0),(170,'GMI','MIXTO','1',46,'2023-12-12',132,'POP-JAL-MIX',0);
/*!40000 ALTER TABLE `group_produc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linea`
--

DROP TABLE IF EXISTS `linea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea` (
  `id_line` int NOT NULL AUTO_INCREMENT,
  `cod_line` char(5) NOT NULL,
  `des_line` varchar(50) NOT NULL,
  `status_line` char(1) DEFAULT NULL,
  `family_id_fam` int NOT NULL,
  PRIMARY KEY (`id_line`),
  UNIQUE KEY `idLinea_UNIQUE` (`id_line`),
  UNIQUE KEY `cod_lin_UNIQUE` (`cod_line`),
  UNIQUE KEY `des_line_UNIQUE` (`des_line`),
  KEY `fk_Linea_family1_idx` (`family_id_fam`),
  CONSTRAINT `fk_Linea_family1` FOREIGN KEY (`family_id_fam`) REFERENCES `family` (`id_fam`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea`
--

LOCK TABLES `linea` WRITE;
/*!40000 ALTER TABLE `linea` DISABLE KEYS */;
INSERT INTO `linea` VALUES (44,'LBA','BANNER','1',129),(45,'LPA','PARANTE','1',130),(46,'LJA','JALAVISTA','1',132),(47,'LCO','COLUMNA','1',131);
/*!40000 ALTER TABLE `linea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id_permission` int NOT NULL AUTO_INCREMENT,
  `permission_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_permission`),
  UNIQUE KEY `id_permission_UNIQUE` (`id_permission`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'CREAR REGISTRO'),(2,'ACTUALIZAR REGISTRO'),(3,'ELIMINAR REGISTRO'),(4,'ASIGNAR PRODUCTOS'),(5,'VER PRODUCTOS');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id_prod` int NOT NULL AUTO_INCREMENT,
  `cod_product` varchar(50) NOT NULL,
  `name_product` longtext NOT NULL,
  `des_product` longtext,
  `status_product` char(1) DEFAULT NULL,
  `group_id_group` int NOT NULL,
  `user_id_user` int NOT NULL,
  `fech_regis` date NOT NULL,
  PRIMARY KEY (`id_prod`),
  UNIQUE KEY `cod_produ_UNIQUE` (`cod_product`),
  KEY `fk_products_grupo1_idx` (`group_id_group`),
  KEY `fk_products_user1_idx` (`user_id_user`),
  CONSTRAINT `fk_products_grupo1` FOREIGN KEY (`group_id_group`) REFERENCES `group_produc` (`id_grou`),
  CONSTRAINT `fk_products_user1` FOREIGN KEY (`user_id_user`) REFERENCES `users` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (65,'AMB-BAN-MAT-001','BRILLOSO','12122','1',167,73,'2023-12-16');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `ro_name` varchar(45) DEFAULT NULL,
  `ro_status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Super Admin','1'),(2,'Comercial','1'),(3,'Gerente OP','1');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `permission_id` int DEFAULT NULL,
  `modulo` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`),
  CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id_permission`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
INSERT INTO `user_permissions` VALUES (90,73,1,1),(91,73,2,1),(92,73,3,2),(93,73,1,3),(94,73,1,4),(95,73,4,4),(96,73,5,4),(97,73,1,5);
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `us_username` varchar(45) NOT NULL,
  `us_password` text NOT NULL,
  `us_avatar` varchar(45) DEFAULT NULL,
  `us_full_name` varchar(70) DEFAULT NULL,
  `role_idrole` int NOT NULL,
  `us_fec_regis` date DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `iduser_UNIQUE` (`id_user`),
  UNIQUE KEY `username_UNIQUE` (`us_username`),
  KEY `fk_user_role_idx` (`role_idrole`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_idrole`) REFERENCES `rol` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (53,'deyvisgc@gmail.com','$2b$10$uXtN..KcNsBDOW7ntP68ruOI.LeVcKztvXfWRQRZ84iWj6HXnNX/K',NULL,'Deyvis Garcia Cercado',1,'2023-12-07'),(73,'ronaldgc@gmail.com','$2b$10$2ub6riMB45otAnPboeObZuNStincoRJWWtsYPVi9JF9M5irT/aQHm',NULL,'Ronald Garcia Cercado',2,'2023-12-16');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-17  9:53:04
