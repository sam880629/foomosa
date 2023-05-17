--呈現 (下午茶、韓式料理、日式料理、早午餐、速食)，新增活動主題名稱、活動內容、活動背景、活動縮圖。

-- --------------- 修改如下 -----------------------------

-- 建立活動列表 
CREATE TABLE season (
    season_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    season_topic VARCHAR(20), -- 活動主題名稱
    season_content VARCHAR(100), -- 活動主題內容
    season_background_img VARCHAR(60), -- 活動背景
    season_preview_img VARCHAR(60) -- 活動縮圖
);

-- 建立活動對應店家的列表(暫定不建)
CREATE TABLE season_shop_list (
    shop_id INT NOT NULL,
    season_id INT NOT NULL,
    PRIMARY KEY(shop_id, season_id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id),
    FOREIGN KEY (season_id) REFERENCES season(season_id)
);

-- 新增 下午茶 活動主題名稱、主題內容、背景、縮圖
insert into season values 
('1',
'Bon Appétit!',
'喜愛下午茶的您，不妨來一趟美食之旅！我們提供多間下午茶餐廳選項，讓您盡情品味濃郁香醇的咖啡和軟綿可口的甜點。不管是和朋友小聚、還是獨自享受片刻寧靜，都能在溫馨舒適的環境中輕鬆放鬆身心，品味甜蜜與愉悅。',
'../upload/class_id_6/bg_img/seasonTea.jpeg',
'../upload/class_id_6/prev_img/slideTea.jpeg')

-- 要取得符合種類6:下午茶
SELECT s.*,shop.shop_id
FROM season as s INNER JOIN shop
ON shop.class_id = 6 && s.season_id = 1

--新增 韓式料理 活動主題名稱、主題內容、背景、縮圖
insert into season values 
('2',
'한식향韓式炸雞',
'提供多家正宗韓式料理餐廳，品嚐炸雞、泡菜燉飯、石鍋拌飯等道道美食，讓您的味蕾盡享滋味。韓式料理以多種調味料烹調，風味獨特，讓您不僅享受美味佳餚，更能感受韓式文化的魅力。快來品嚐正宗韓式料理吧！',
'../upload/class_id_7/bg_img/seasonKorea.jpeg',
'../upload/class_id_7/prev_img/slideKorea.jpeg')

-- 新增 日式料理 活動主題名稱、主題內容、背景、縮圖 
insert into season values 
('3',
'夏祭り',
'夏季美食季節到了！我們挑選了多家日式料理餐廳，提供夏祭り主題活動。透過美食，品嚐正宗的日式料理，感受日本文化之美，讓您的味蕾也能體驗日本之美，為您帶來一場異國風情的美食之旅！一起享受美食的盛宴！',
'../upload/class_id_8/bg_img/seasonJapan.jpeg',
'../upload/class_id_8/prev_img/slideJapan.jpeg')

-- 新增 早午餐 活動主題名稱、主題內容、背景、縮圖
insert into season values 
('4',
'Brunch it up!',
'讓您的早晨從美味早午餐開始！我們嚴選多間餐廳，提供豐富多樣的選項，包括經典美式早餐、創意口味、素食等。無論您喜歡健康或豐盛，這裡都能滿足您。趕快來一場與美味、健康的早晨約會吧！',
'../upload/class_id_9/bg_img/seasonBrunch.jpeg',
'../upload/class_id_9/prev_img/slideBrunch.jpeg')

-- 新增 速食 活動主題名稱、主題內容、背景、縮圖 
insert into season values 
('5',
'Big Satisfaction',
'匆忙都市中，快速餐飲愈受歡迎。我們選擇多家優質速食餐廳，提供快速美味飲食體驗。漢堡、炸雞、披薩、墨西哥捲餅等多種口味應有盡有。輕鬆享受美食，有效完成工作或行程。來瀏覽選擇，找到喜愛速食餐廳！',
'../upload/class_id_10/bg_img/seasonFastfood.jpeg',
'../upload/class_id_10/prev_img/slideFastfood.jpeg')

--------------------------------------------------------
--新增欄位，活動主題名稱
ALTER TABLE class ADD season_topic VARCHAR(20);

--新增欄位，活動主題內容
ALTER TABLE class ADD season_content VARCHAR(100);

--新增欄位，活動背景
ALTER TABLE class ADD season_background_img VARCHAR(60);

--新增欄位，活動縮圖
ALTER TABLE class ADD season_preview_img VARCHAR(60);

-- 新增 下午茶 活動主題名稱、主題內容、背景、縮圖
UPDATE class
SET season_topic = 'Bon Appétit!',
    season_content = '喜愛下午茶的您，不妨來一趟美食之旅！我們提供多間下午茶餐廳選項，讓您盡情品味濃郁香醇的咖啡和軟綿可口的甜點。不管是和朋友小聚、還是獨自享受片刻寧靜，都能在溫馨舒適的環境中輕鬆放鬆身心，品味甜蜜與愉悅。',  
    season_background_img = '../upload/class_id_6/bg_img/seasonTea.jpeg',
    season_preview_img = '../upload/class_id_6/prev_img/slideTea.jpeg'
WHERE class.class_id = '6';

-- 新增 韓式料理 活動主題名稱、主題內容、背景、縮圖
UPDATE class
SET season_topic = '한식향-韓式料理探險',
    season_content = '提供多家正宗韓式料理餐廳，品嚐炸雞、泡菜燉飯、石鍋拌飯等道道美食，讓您的味蕾盡享滋味。韓式料理以多種調味料烹調，風味獨特，讓您不僅享受美味佳餚，更能感受韓式文化的魅力。快來品嚐正宗韓式料理吧！',  
    season_background_img = '../upload/class_id_7/bg_img/seasonKorea.jpeg',
    season_preview_img = '../upload/class_id_7/prev_img/slideKorea.jpeg'
WHERE class.class_id = '7';

-- 新增 日式料理 活動主題名稱、主題內容、背景、縮圖 
UPDATE class
SET season_topic = '夏祭り',
    season_content = '夏季美食季節到了！我們挑選了多家日式料理餐廳，提供夏祭り主題活動。透過美食，品嚐正宗的日式料理，感受日本文化之美，讓您的味蕾也能體驗日本之美，為您帶來一場異國風情的美食之旅！一起享受美食的盛宴！',  
    season_background_img = '../upload/class_id_8/bg_img/seasonJapan.jpeg',
    season_preview_img = '../upload/class_id_8/prev_img/slideJapan.jpeg'
WHERE class.class_id = '8';

-- 新增 早午餐 活動主題名稱、主題內容、背景、縮圖
UPDATE class
SET season_topic = 'Brunch it up',
    season_content = '讓您的早晨從美味早午餐開始！我們嚴選多間餐廳，提供豐富多樣的選項，包括經典美式早餐、創意口味、素食等。無論您喜歡健康或豐盛，這裡都能滿足您。趕快來一場與美味、健康的早晨約會吧！',  
    season_background_img = '../upload/class_id_9/bg_img/seasonBrunch.jpeg',
    season_preview_img = '../upload/class_id_9/prev_img/slideBrunch.jpeg'
WHERE class.class_id = '9';

-- 新增 速食 活動主題名稱、主題內容、背景、縮圖 
UPDATE class
SET season_topic = 'Big Satisfaction',
    season_content = '匆忙都市中，快速餐飲愈受歡迎。我們選擇多家優質速食餐廳，提供快速美味飲食體驗。漢堡、炸雞、披薩、墨西哥捲餅等多種口味應有盡有。輕鬆享受美食，有效完成工作或行程。來瀏覽選擇，找到喜愛速食餐廳！',  
    season_background_img = '../upload/class_id_10/bg_img/seasonFastfood.jpeg',
    season_preview_img = '../upload/class_id_10/prev_img/slideFastfood.jpeg'
WHERE class.class_id = '10';


