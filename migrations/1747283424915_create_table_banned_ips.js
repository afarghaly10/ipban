module.exports = {
	up:
		'CREATE TABLE IF NOT EXISTS `bannedIps` (\n' +
		'  `id` int(11) NOT NULL AUTO_INCREMENT,\n' +
		'  `ip` varchar(45) NOT NULL UNIQUE,\n' +
		'  `reason` TEXT,\n' +
		'  `bannedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n' +
		'  `expiresAt` TIMESTAMP NULL DEFAULT NULL,\n' +
		'  `deletedAt` TIMESTAMP NULL DEFAULT NULL,\n' +
		'  PRIMARY KEY (`id`)\n' +
		');',
	down: 'DROP TABLE IF EXISTS `bannedIps`;',
};
