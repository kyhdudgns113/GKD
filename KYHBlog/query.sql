CREATE TABLE `users` (
	userOId CHAR(24) PRIMARY KEY,

  hashedPassword VARCHAR(255) NOT NULL,
  picture VARCHAR(255) NULL,
  signUpType ENUM('common', 'google') NOT NULL,
  
  userAuth TINYINT UNSIGNED NOT NULL DEFAULT 1,
  userId VARCHAR(16) NOT NULL,
  userName VARCHAR(30) NOT NULL,

  UNIQUE (userId),
  UNIQUE (userName),
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_cs;