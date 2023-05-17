CREATE TABLE active (
shop_id INT NOT NULL,
active_id int auto_increment,
active_title varchar(50), -- 活動主題
active_picture varchar(100) ,
active_startdate date,--  開始時間
active_enddate date,
active_content VARCHAR(500),-- 活動內容
active_ifDel tinyint default 1,-- 歷史資料(抓最新)
active_editdate timestamp default now(), -- 編輯時間
PRIMARY KEY(shop_id, active_id),
FOREIGN KEY (shop_id) REFERENCES shop(shop_id)
);
insert into active (shop_id,active_title,active_picture,active_startdate,active_enddate,active_content) values ('14','皮丘','./public/upload/shop_id_14/event_img/pichu.jpg','2023-05-05','2023-05-05','我是測試用活動說明的皮卡皮卡~');
--語法
SELECT shop_id,active_title,active_picture,DATE_FORMAT(active_editdate,'%Y/%m/%d %H:%i')active_editdate,DATE_FORMAT(active_startdate,'%Y/%m/%d')active_startdate,DATE_FORMAT(active_enddate,'%Y/%m/%d')active_enddate , active_content, active_ifDel FROM active;