CREATE TABLE `directories` (
	dirOId CHAR(24) PRIMARY KEY,

  dirIdx INT UNSIGNED NOT NULL,
  dirName VARCHAR(255) NOT NULL,
  fileArrLen INT UNSIGNED NOT NULL DEFAULT 0,

  parentDirOId CHAR(24) NOT NULL,
  subDirArrLen INT UNSIGNED NOT NULL DEFAULT 0,

  UNIQUE (parentDirOId, dirName)

) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;