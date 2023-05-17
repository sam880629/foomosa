-- 新增資料庫
create database foomosa default character set utf8;

-- 建立地區資料庫 
CREATE TABLE location (
    location_id TINYINT NOT NULL PRIMARY KEY,
    location_name VARCHAR(3) NOT NULL UNIQUE
);
-- 建立店家種類資料庫
CREATE TABLE class (
    class_id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(5) NOT NULL UNIQUE
);
-- 建立店家資料庫 
CREATE TABLE shop (
    shop_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    shop_tax_id VARCHAR(8) NOT NULL PRIMARY KEY, -- 統一編號
    shop_name VARCHAR(30) NOT NULL,
    location_id TINYINT NOT NULL,
    shop_address VARCHAR(30) NOT NULL,
    shop_phone VARCHAR(15) NOT NULL,
    shop_email VARCHAR(50) NOT NULL,
    shop_start_1 VARCHAR(5) NOT NULL,
    shop_end_1 VARCHAR(5) NOT NULL,
    shop_start_2 VARCHAR(5),
    shop_end_2 VARCHAR(5),
    shop_break SET("1", "2", "3", "4", "5", "6", "7"),
    class_id TINYINT UNSIGNED NOT NULL default '1', -- 店家食物種類，預設為"其他"
    shop_uber VARCHAR(1000),
    shop_panda VARCHAR(1000),
    shop_parking TINYINT(1) default 0,
    shop_child TINYINT(1) default 0,
    shop_pet TINYINT(1) default 0,
    shop_credit_card TINYINT(1) default 0,
    shop_linepay TINYINT(1) default 0,
    shop_jkopay TINYINT(1) default 0,
    shop_logo_img VARCHAR(50),
    shop_index_img VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES location(location_id),
    FOREIGN KEY (class_id) REFERENCES class(class_id)
);

-- 建立菜單
CREATE TABLE menu (
    shop_id INT NOT NULL,
    menu_id INT NOT NULL,
    menu_name VARCHAR(15) NOT NULL,
    menu_price SMALLINT NOT NULL,
    menu_uber SMALLINT,
    menu_panda SMALLINT,
    menu_picture VARCHAR(50),
    menu_type VARCHAR(10),
    PRIMARY KEY(shop_id, menu_id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id)
);

-- 建立會員資料
CREATE TABLE user (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_pw VARCHAR(100) NOT NULL,
    user_name VARCHAR(10) NOT NULL,
    user_gender VARCHAR(1) NOT NULL,
    user_birth DATE NOT NULL,
    user_email VARCHAR(50) NOT NULL UNIQUE,
    user_avatar VARCHAR(50)
);

-- 建立評論表格
CREATE TABLE comment (
    user_id INT NOT NULL,
    shop_id INT NOT NULL,
    comment_star SMALLINT,
    comment_text VARCHAR(100),
    comment_favorite TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, shop_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id)
);

--------------------------------------------
-- 下面這三個 table 還沒確定功能，請都先不要建立
--------------------------------------------

-- 建立會員擁有的優惠券表格 
CREATE TABLE coupon (
    user_id INT NOT NULL,
    coupon_id INT NOT NULL,
    coupon_used TINYINT(1) default 0,
    PRIMARY KEY(user_id, coupon_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (coupon_id) REFERENCES coupon_list(coupon_id)
);
-- 建立優惠券列表 (看要不要直接當轉盤獎項) 
CREATE TABLE coupon_list (
    coupon_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    coupon_name VARCHAR(10) NOT NULL UNIQUE,
    coupon_expire DATE NOT NULL,
);

-- 店家自己的活動優惠 / 起訖時間 / 開關 /  
CREATE TABLE active (
    shop_id INT NOT NULL,
    active_id INT NOT NULL,
    active_content VARCHAR(500),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id),
);


------------------------   insert部分，一定要照順序  ----------------------------------

-- 建立地區資料庫 (location)
insert into location values ('1','東區');
insert into location values ('2','西區');
insert into location values ('3','南區');
insert into location values ('4','北區');
insert into location values ('5','中區');
insert into location values ('6','西屯區');
insert into location values ('7','南屯區');
insert into location values ('8','北屯區');
insert into location values ('9','豐原區');
insert into location values ('10','東勢區');
insert into location values ('11','大甲區');
insert into location values ('12','清水區');
insert into location values ('13','沙鹿區');
insert into location values ('14','梧棲區');
insert into location values ('15','后里區');
insert into location values ('16','神岡區');
insert into location values ('17','潭子區');
insert into location values ('18','大雅區');
insert into location values ('19','新社區');
insert into location values ('20','石岡區');
insert into location values ('21','外埔區');
insert into location values ('22','大安區');
insert into location values ('23','烏日區');
insert into location values ('24','大肚區');
insert into location values ('25','龍井區');
insert into location values ('26','霧峰區');
insert into location values ('27','太平區');
insert into location values ('28','大里區');
insert into location values ('29','和平區');

-- 建立店家種類資料庫(class)
insert into class values ('1','其他');
insert into class values ('2','異國料理');
insert into class values ('3','素食');
insert into class values ('4','中式料理');
insert into class values ('5','健康餐盒');
insert into class values ('6','下午茶');
insert into class values ('7','韓式料理');
insert into class values ('8','日式料理');
insert into class values ('9','早午餐');
insert into class values ('10','速食');
insert into class values ('11','火鍋');
insert into class values ('12','飲料');
insert into class values ('13','宵夜');

-- 建立店家資料庫(shop) 
-- 這邊請到 phpMyAdmin 匯入 shop_raw_data_format.csv ，如果不知道怎麼匯入的話，請參考以下教學
-- https://docs.google.com/presentation/d/1jAkQFj3iCCUkVTYNEsfGdlNOPP06M1EOv0oE2yJRXFs/edit?usp=share_link

-- 建立菜單(menu)
-- 這邊請到 phpMyAdmin 匯入 menu_raw_data_format.csv

-- 建立會員(uber)
insert into user values ('1','1111','金城武','M','1973-10-11','aniki@gmail.com',NULL);
insert into user values ('2','2222','瑪利歐','M','1981-03-10','mario@gmail.com',NULL);
insert into user values ('3','3333','性感寶貝','F','1999-01-01','sexybaby@gmail.com',NULL);
insert into user values ('4','4444','錢達智','M','1980-05-28','money@gmail.com',NULL);
insert into user values ('5','5555','李多慧很會','F','1999-08-04','lalala@gmail.com',NULL);

-- 評論(comment)
insert into comment values ('1','14','5','添好運豪好吃','1','20230419185048');
insert into comment values ('3','14','4','好吃但好盤','0','20230417205048');




