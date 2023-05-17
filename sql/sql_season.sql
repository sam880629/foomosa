--呈現 (異國料理、韓式料理、火鍋)，新增活動主題名稱、活動內容、活動背景。
--抓 shop_preview_img 、 精選3間店

-- 建立活動列表 
CREATE TABLE season (
    season_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    season_topic VARCHAR(20) NOT NULL, -- 活動主題名稱
    season_content VARCHAR(100) NOT NULL, -- 活動主題內
    season_background_img_1 VARCHAR(60) NOT NULL, -- 活動背景1
    season_background_img_2 VARCHAR(60), -- 活動背景2
    season_background_img_3 VARCHAR(60) -- 活動背景3
);

-- 建立活動對應店家的列表
CREATE TABLE season_shop_list (
    shop_id INT NOT NULL,
    season_id INT NOT NULL,
    PRIMARY KEY(shop_id, season_id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id),
    FOREIGN KEY (season_id) REFERENCES season(season_id)
);

-- 新增 異國料理 活動主題名稱、主題內容、背景、縮圖
insert into season values 
('1',
'異國風味，讓您的味蕾環遊世界!',
'您可以嘗試到來自世界各地的美食，每一種料理都有獨特的風味和故事。我們精心挑選的餐廳和食材，讓你感受到真正的異國風情，帶給你味蕾和心靈的雙重享受，探索你從未體驗過的美食文化！',
'../upload/season_id_1/seasonExotic_1.jpeg',
'../upload/season_id_1/seasonExotic_2.jpeg',
'../upload/season_id_1/seasonExotic_3.jpeg')

--新增 韓式料理 活動主題名稱、主題內容、背景、縮圖
insert into season values 
('2',
'한식향韓式料理探索',
'提供多家正宗韓式料理餐廳，品嚐炸雞、泡菜燉飯、石鍋拌飯等道道美食，讓您的味蕾盡享滋味。韓式料理以多種調味料烹調，風味獨特，讓您不僅享受美味佳餚，更能感受韓式文化的魅力。快來品嚐正宗韓式料理吧！',
'../upload/season_id_2/seasonKorea_1.jpeg',
'../upload/season_id_2/seasonKorea_2.jpeg',
'../upload/season_id_2/seasonKorea_3.jpeg')

-- 新增 火鍋 活動主題名稱、主題內3、背景3縮圖 
insert into season values 
('3',
'鍋鍋暖胃暖心',
'選用新鮮食材，搭配多樣湯底，香氣四溢，讓你一口接一口欲罷不能。不僅暖身，更能喚起你的味蕾，品嚐不同的滋味，享受舌尖上的美食盛宴。與摯友、親人一起共享，溫馨又愉快的用餐體驗，絕對讓你回味無窮！',
'../upload/season_id_3/seasonHotpot_1.jpeg',
'../upload/season_id_3/seasonHotpot_2.jpeg',
'../upload/season_id_3/seasonHotpot_3.jpeg')


--插入(14 添好運、34 瘋墨佬、40 小西藏)到 season 1 => 異國料理
INSERT INTO season_shop_list (shop_id, season_id) VALUES
(14, 1),
(34, 1),
(40, 1);

--插入(62 NENE、68 KATZ卡司、70 GangNam)到 season 2 => 韓式料理
INSERT INTO season_shop_list (shop_id, season_id) VALUES
(62, 2),
(68, 2),
(70, 2);

--插入(93 12mini、71 阿二靚鍋、74久久火鍋)到 season 3 => 火鍋
INSERT INTO season_shop_list (shop_id, season_id) VALUES
(93, 3),
(71, 3),
(74, 3);

--最新指令
-- 查符合季節活動1 的店家 與 季節活動資訊
SELECT s.season_topic, s.season_content, s.season_background_img_1, s.season_background_img_2, s.season_background_img_3, sh.shop_id, sh.shop_name, sh.shop_preview_img
FROM season AS s 
INNER JOIN season_shop_list AS sl ON s.season_id = sl.season_id 
INNER JOIN shop AS sh ON sl.shop_id = sh.shop_id 
WHERE s.season_id = ?;


--過去指令
-- 要取得符合活動的店家 1: (原本的指令)
SELECT s.*,shop.shop_id,shop.shop_preview_img
FROM season as s INNER JOIN shop
ON shop.class_id = ? && s.season_id = ?

-- 查符合季節活動1 的店家
SELECT sh.shop_id, sh.shop_name, sh.shop_preview_img
FROM season AS s INNER JOIN season_shop_list AS sl ON s.season_id = sl.season_id INNER JOIN shop AS sh 
ON sl.shop_id = sh.shop_id WHERE s.season_id = 1;





