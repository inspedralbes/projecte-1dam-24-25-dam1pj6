-- Adminer 5.2.1 MySQL 5.7.44 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `Actuacions`;
CREATE TABLE `Actuacions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `descripcio` text NOT NULL,
  `temps_invertit` int(11) NOT NULL,
  `visible_per_usuari` tinyint(1) DEFAULT '0',
  `resolt` tinyint(1) DEFAULT '0',
  `incidencia_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `incidencia_id` (`incidencia_id`),
  CONSTRAINT `Actuacions_ibfk_1` FOREIGN KEY (`incidencia_id`) REFERENCES `Incidencia` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Actuacions` (`id`, `data`, `descripcio`, `temps_invertit`, `visible_per_usuari`, `resolt`, `incidencia_id`) VALUES
(1,	'2025-05-10',	'Comprovació del cablejat i font d\'alimentació.',	15,	1,	0,	1),
(2,	'2025-05-11',	'Substitució de la font d\'alimentació.',	45,	0,	1,	1),
(3,	'2025-05-12',	'Proves funcionals post-reparació.',	30,	1,	1,	1),
(4,	'2025-05-13',	'Reinici del punt d\'accés del segon pis.',	10,	1,	0,	2),
(5,	'2025-05-14',	'Revisió de la configuració DHCP.',	20,	0,	0,	2),
(6,	'2025-05-14',	'Es detecta avaria a l\'switch. Es demana reemplaçament.',	25,	1,	0,	2),
(7,	'2025-05-08',	'Comprovació de la connexió HDMI.',	10,	1,	0,	3),
(8,	'2025-05-09',	'Substitució del cable HDMI.',	15,	0,	1,	3),
(9,	'2025-05-10',	'Confirmació de funcionament correcte.',	10,	1,	1,	3),
(10,	'2025-05-12',	'Test en local: no es reprodueix l\'error.',	20,	0,	0,	4),
(11,	'2025-05-13',	'Es demana a l’usuari repetir l’error en viu.',	10,	1,	0,	4),
(12,	'2025-05-14',	'Possible conflicte amb l\'antivirus. S\'està comprovant.',	25,	1,	0,	4),
(13,	'2025-05-13',	'Informe d’incidència automàtic generat pel sistema.',	0,	1,	0,	5),
(14,	'2025-05-13',	'Encara pendent d’assignació a tècnic.',	0,	0,	0,	5),
(15,	'2025-05-14',	'S\'ha notificat a l’equip de suport.',	5,	1,	0,	5),
(16,	'2025-05-19',	'11',	11,	0,	0,	NULL),
(17,	'2025-05-19',	'11',	11,	1,	0,	NULL);

DROP TABLE IF EXISTS `Departaments`;
CREATE TABLE `Departaments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Departaments` (`id`, `nom`) VALUES
(1,	'Departament d\'Informàtica'),
(4,	'Departament de Ciències'),
(3,	'Departament de Matemàtiques'),
(2,	'Departament de Tecnología');

DROP TABLE IF EXISTS `Estat`;
CREATE TABLE `Estat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL DEFAULT 'Pendent d''assignar',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Estat` (`id`, `nom`) VALUES
(2,	'Assignada'),
(3,	'En procés'),
(1,	'Pendent d\'assignar'),
(4,	'Resolta');

DROP TABLE IF EXISTS `Incidencia`;
CREATE TABLE `Incidencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `departament_id` int(11) NOT NULL,
  `tipus_id` int(11) NOT NULL,
  `descripcio` text NOT NULL,
  `datacreacio` date DEFAULT NULL,
  `estat_id` int(11) DEFAULT NULL,
  `tecnic_id` int(11) DEFAULT NULL,
  `prioritat_id` int(11) DEFAULT NULL,
  `dataresolucio` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `departament_id` (`departament_id`),
  KEY `tipus_id` (`tipus_id`),
  KEY `estat_id` (`estat_id`),
  KEY `tecnic_id` (`tecnic_id`),
  KEY `prioritat_id` (`prioritat_id`),
  CONSTRAINT `Incidencia_ibfk_1` FOREIGN KEY (`departament_id`) REFERENCES `Departaments` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `Incidencia_ibfk_2` FOREIGN KEY (`tipus_id`) REFERENCES `Tipus` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `Incidencia_ibfk_3` FOREIGN KEY (`estat_id`) REFERENCES `Estat` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Incidencia_ibfk_4` FOREIGN KEY (`tecnic_id`) REFERENCES `Tecnics` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Incidencia_ibfk_5` FOREIGN KEY (`prioritat_id`) REFERENCES `Prioritats` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Incidencia` (`id`, `nom`, `departament_id`, `tipus_id`, `descripcio`, `datacreacio`, `estat_id`, `tecnic_id`, `prioritat_id`, `dataresolucio`) VALUES
(1,	'Ordinador no arrenca',	3,	1,	'L\'ordinador del professor de matemàtiques no mostra res en pantalla.',	'2025-05-19',	4,	1,	1,	'2025-05-13'),
(2,	'No es pot accedir a la xarxa Wi-Fi',	1,	3,	'Cap dispositiu es connecta a la xarxa del segon pis.',	'2025-05-19',	3,	2,	2,	NULL),
(3,	'Projector no funciona',	2,	1,	'El projector de l\'aula de tecnología no mostra imatge.',	'2025-05-19',	4,	3,	3,	'2025-05-10'),
(4,	'Problema amb el programari de notes',	4,	2,	'L’aplicació de notes no desa els canvis.',	'2025-05-19',	2,	2,	2,	NULL),
(5,	'Pantalla tàctil no respon',	1,	1,	'La pantalla tàctil del laboratori no respon al tacte.',	'2025-05-19',	1,	NULL,	1,	NULL),
(6,	'dad',	4,	4,	'121',	'2025-05-19',	1,	NULL,	NULL,	NULL);

DROP TABLE IF EXISTS `Prioritats`;
CREATE TABLE `Prioritats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Prioritats` (`id`, `nom`) VALUES
(1,	'Alta'),
(3,	'Baixa'),
(2,	'Mitjana');

DROP TABLE IF EXISTS `Tecnics`;
CREATE TABLE `Tecnics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `cognoms` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Tecnics` (`id`, `nom`, `cognoms`, `email`) VALUES
(1,	'Roberto',	'Lotreanu',	'a22roblotlot@inspedralbes.cat'),
(2,	'Harsh',	'Jagani',	'a24gaujaghar@inspedralbes.cat'),
(3,	'Mateo',	'San Martin',	'Mateo.sanmartin@mail.com');

DROP TABLE IF EXISTS `Tipus`;
CREATE TABLE `Tipus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Tipus` (`id`, `nom`) VALUES
(4,	'Altres'),
(1,	'Hardware'),
(2,	'Software'),
(3,	'Xarxes');

-- 2025-05-19 11:26:47 UTC
