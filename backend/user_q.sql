/*
 Navicat Premium Data Transfer

 Source Server         : weijia-139.196.81.156
 Source Server Type    : MySQL
 Source Server Version : 50731
 Source Host           : 139.196.81.156:3306
 Source Schema         : user_q

 Target Server Type    : MySQL
 Target Server Version : 50731
 File Encoding         : 65001

 Date: 31/05/2022 13:42:42
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for alembic_version
-- ----------------------------
DROP TABLE IF EXISTS `alembic_version`;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of alembic_version
-- ----------------------------
BEGIN;
INSERT INTO `alembic_version` VALUES ('e64950aea950');
COMMIT;

-- ----------------------------
-- Table structure for intention
-- ----------------------------
DROP TABLE IF EXISTS `intention`;
CREATE TABLE `intention` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `school_name` varchar(255) DEFAULT NULL,
  `score` decimal(10,2) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of intention
-- ----------------------------
BEGIN;
INSERT INTO `intention` VALUES (4, 1, '北京大学', 676.00, '2022-05-31 12:18:38');
INSERT INTO `intention` VALUES (6, 3, '北京大学', 676.00, '2022-05-31 13:11:56');
INSERT INTO `intention` VALUES (7, 3, '中国科技大学', 660.00, '2022-05-31 13:11:58');
INSERT INTO `intention` VALUES (8, 3, '清华大学', 1200.00, '2022-05-31 13:11:59');
COMMIT;

-- ----------------------------
-- Table structure for school
-- ----------------------------
DROP TABLE IF EXISTS `school`;
CREATE TABLE `school` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `score` decimal(10,2) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of school
-- ----------------------------
BEGIN;
INSERT INTO `school` VALUES (1, '10001', '北京大学', '北京 985', 676.00, '2022-05-30 18:52:30', '2022-09-13 00:00:00');
INSERT INTO `school` VALUES (2, '20001', '中国科技大学', '安徽 985', 660.00, '2022-05-30 18:53:08', '2022-09-13 00:00:00');
INSERT INTO `school` VALUES (5, '10009', '清华大学', 'test', 1200.00, '2022-05-31 11:32:31', '2022-02-02 00:00:00');
INSERT INTO `school` VALUES (7, '10009', '清华小学', '测试', 1150.00, '2022-05-31 13:05:08', '2022-05-31 00:00:00');
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1, 'admin', '111111', 1);
INSERT INTO `user` VALUES (2, 'test1', '111111', 2);
INSERT INTO `user` VALUES (3, 'zhangsan', '111', 2);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
