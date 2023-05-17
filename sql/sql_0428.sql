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