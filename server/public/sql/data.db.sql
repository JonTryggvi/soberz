BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `user_roles` (
	`role_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`role_name`	TEXT NOT NULL
);
INSERT INTO `user_roles` (role_id,role_name) VALUES (1,'Admin');
INSERT INTO `user_roles` (role_id,role_name) VALUES (2,'User');
INSERT INTO `user_roles` (role_id,role_name) VALUES (3,'Guest');
CREATE TABLE IF NOT EXISTS `sponsor_inquiries` (
	`sponsor_inquiries_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`who_is_asking`	INTEGER,
	`who_is_asked`	INTEGER,
	`date`	TEXT,
	`accepted`	INTEGER DEFAULT 0
);
INSERT INTO `sponsor_inquiries` (sponsor_inquiries_id,who_is_asking,who_is_asked,date,accepted) VALUES (63,22,23,'1526886828734.0',0);
CREATE TABLE IF NOT EXISTS `genders` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`gender_name`	TEXT
);
INSERT INTO `genders` (id,gender_name) VALUES (1,'Male');
INSERT INTO `genders` (id,gender_name) VALUES (2,'Female');
INSERT INTO `genders` (id,gender_name) VALUES (3,'Other');
INSERT INTO `genders` (id,gender_name) VALUES (4,'Bamby');
INSERT INTO `genders` (id,gender_name) VALUES (5,'Zombie');
CREATE TABLE IF NOT EXISTS `Users` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`firstname`	TEXT NOT NULL,
	`lastname`	TEXT NOT NULL,
	`username`	TEXT NOT NULL,
	`email`	TEXT NOT NULL,
	`mobile`	TEXT NOT NULL,
	`gender`	NUMERIC,
	`sponsor`	BLOB,
	`imgUrl`	TEXT DEFAULT '{}',
	`user_role`	INTEGER NOT NULL DEFAULT 2,
	`password`	TEXT NOT NULL,
	`sponsees`	TEXT DEFAULT '[]',
	`sponsors`	TEXT DEFAULT '[]',
	`about`	TEXT,
	`date`	TEXT,
	`online`	TEXT,
	`activated`	INTEGER DEFAULT 0,
	`code`	INTEGER,
	`pending_sponsor_request`	TEXT DEFAULT '[]',
	`sent_sponsor_request`	TEXT DEFAULT '[]',
	FOREIGN KEY(`gender`) REFERENCES `genders`(`id`)
);
INSERT INTO `Users` (id,firstname,lastname,username,email,mobile,gender,sponsor,imgUrl,user_role,password,sponsees,sponsors,about,date,online,activated,code,pending_sponsor_request,sent_sponsor_request) VALUES (22,'Jón','Unnarsson','JT','jontryggvi@jontryggvi.is','+4541888898',5,1,'{ "imgPath":  "/uploads/img/upload_b9429f14e4e315a56269c0ec39a5a82f.JPG", "imgId": "upload_b9429f14e4e315a56269c0ec39a5a82f" }',1,'123#$%','[]','[]','This is me in a nutshell','2018-05-16 22:21:45 +02:00',NULL,1,6780,'[]','[63]');
INSERT INTO `Users` (id,firstname,lastname,username,email,mobile,gender,sponsor,imgUrl,user_role,password,sponsees,sponsors,about,date,online,activated,code,pending_sponsor_request,sent_sponsor_request) VALUES (23,'Elvis','Prestley','theKing','jontryggvi@jontryggvi.is','+4541888897',5,1,'{ "imgPath":  "/uploads/img/upload_8ef36b5864d97848356e8550c4b92a8a.JPG", "imgId": "upload_8ef36b5864d97848356e8550c4b92a8a" }',2,'$%&654','[]','[]',NULL,'2018-05-16 22:21:45 +02:00',NULL,1,5749,'[63]','[]
');
CREATE UNIQUE INDEX IF NOT EXISTS `uniq_request` ON `sponsor_inquiries` (
	`who_is_asking`,
	`who_is_asked`
);
CREATE TRIGGER update_pending_users AFTER INSERT ON sponsor_inquiries
BEGIN
UPDATE Users
SET pending_sponsor_request = json_insert(pending_sponsor_request,"$["|| json_array_length(pending_sponsor_request) || "]", NEW.sponsor_inquiries_id)
WHERE id = NEW.who_is_asked;
UPDATE Users
SET sent_sponsor_request = json_insert(sent_sponsor_request, "$[" || json_array_length(sent_sponsor_request) || "]", NEW.sponsor_inquiries_id)
WHERE id = NEW.who_is_asking;
END;
COMMIT;
