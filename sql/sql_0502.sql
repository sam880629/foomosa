/* ******************************************
    以下為 0502 的更新  (尚未給大家)
***************************************** **/
-- shop table 新增一個 shop_preview_img 欄位，存搜尋頁的店家預覽照片
ALTER TABLE shop ADD shop_preview_img VARCHAR(60);

-- 新增 12 mini 店家資料
INSERT INTO shop (shop_tax_id, shop_name, location_id, shop_address, shop_phone, shop_email, shop_start_1, shop_end_1, class_id, shop_uber,  shop_credit_card, shop_linepay, shop_jkopay, shop_logo_img, shop_index_img, shop_pw, `shop_preview_img`) 
VALUES ('87292020', '12MINI快煮鍋-台中公益東興店', '2', '台中市西區公益路383號', '04-2322-1312', 'service@service.com.tw', '11:00', '23:00', '11', 'https://www.ubereats.com/tw/store/12mini%E5%8F%B0%E4%B8%AD%E5%85%AC%E7%9B%8A%E6%9D%B1%E8%88%88%E5%BA%97/WdYax0B2SGCRY_Du3QOi_g?diningMode=DELIVERY', '1', '1', '1', '../upload/shop_id_93/info_img/shoplogo_mini.jpg', '../upload/shop_id_93/info_img/shopbanner_mini.jpg', 'mosamosa', '../upload/shop_id_93/info_img/shopprev_mini.jpg');

-- 檢查一下新增的 12 mini 的店家 id 是不是 93，不是的話會影響後面菜單更新
-- 如果之前有自己新增店家測試的話，可以用這行 sql 將 shop_id 的 AUTO_INCREMENT 重置成 93
ALTER TABLE shop AUTO_INCREMENT = 93;

-- 新增 添好運跟nene的店家圖片
UPDATE shop 
SET shop_logo_img = '../upload/shop_id_14/info_img/shoplogo_tim.jpg', 
    shop_index_img = '../upload/shop_id_14/info_img/shopbanner_tim.jpg',
    shop_preview_img = '../upload/shop_id_14/info_img/shopprev_tim.jpg'
WHERE shop.shop_id = '14';

UPDATE shop 
SET shop_logo_img = '../upload/shop_id_62/info_img/shoplogo_ne.jpg', 
    shop_index_img = '../upload/shop_id_60/info_img/shopbanner_ne.jpg',
    shop_preview_img = '../upload/shop_id_60/info_img/shopprev_ne.jpg'
WHERE shop.shop_id = '62';

-- 新增添好運、nene、12 mini的菜單
-- 一、 清空目前menu的內容
TRUNCATE TABLE menu; 
-- 二、 到雲端硬碟/mySQL/請下載我
--      下載 "菜單生資料 (加圖片路徑).csv" 匯入 menu table

/* ******************************************
    以下為 0428 的更新  
***************************************** **/
-- 建立未經驗證的店家資料表 
CREATE TABLE potential_shop (
    p_shop_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    p_shop_tax_id VARCHAR(8) NOT NULL PRIMARY KEY, -- 統一編號
    p_shop_name VARCHAR(30) NOT NULL,
    location_id TINYINT NOT NULL,
    p_shop_address VARCHAR(30) UNIQUE NOT NULL,
    p_shop_phone VARCHAR(15) NOT NULL,
    p_shop_email VARCHAR(50) NOT NULL,
    p_shop_pw VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES location(location_id)
);

-- user table 增加積分欄位
ALTER TABLE user ADD user_point INT DEFAULT 0;


/* ******************************************
    以下為 0426 的更新  
***************************************** **/

-- user table 的有些欄位要改成接受 null (因為用google登入的話有些資料抓不到)
ALTER TABLE user CHANGE user_pw user_pw VARCHAR(100);
ALTER TABLE user CHANGE user_gender user_gender VARCHAR(1);
ALTER TABLE user CHANGE user_birth user_birth DATE;

-- user table 的 avatar 欄位大小改100
ALTER TABLE user CHANGE user_avatar user_avatar VARCHAR(100);

-- shop table 增加密碼欄位，然後全部都設成 'mosamosa'
ALTER TABLE shop ADD shop_pw VARCHAR(100) NOT NULL;
UPDATE shop SET shop_pw = 'mosamosa'; 

-- menu table 多一個時間戳記欄位
ALTER TABLE menu ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;