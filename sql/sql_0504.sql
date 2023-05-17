--添好運 台中勤美店
--https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14562.359172486611!2d120.66384800000003!3d24.151040000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693dcbf4e574dd%3A0xc8bc0ce278460b02!2z5re75aW96YGLIOWPsOS4reWLpOe-juW6lw!5e0!3m2!1szh-TW!2stw!4v1683163118584!5m2!1szh-TW!2stw

--NENE CHICKEN 中山醫大店 62
--https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3641.4319383257393!2d120.64839207416654!3d24.12146457841902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693db20aeed9ef%3A0x54aacda913b7a9b4!2zTkVORSBDSElDS0VOIOS4reWxsemGq-Wkp-W6lw!5e0!3m2!1szh-TW!2stw!4v1683163466216!5m2!1szh-TW!2stw

--12MINI快煮鍋-台中公益東興店 93
--https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14562.396951170953!2d120.6535395!3d24.1507085!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693daac9303efd%3A0xa543b78af6cda7d2!2zMTJNSU5J5b-r54Wu6Y2LLeWPsOS4reWFrOebiuadseiIiOW6lw!5e0!3m2!1szh-TW!2stw!4v1683163575091!5m2!1szh-TW!2stw


ALTER TABLE shop ADD shop_map_api VARCHAR(350);

-- 新增 添好運、nene、12 mini店家的 map api

UPDATE shop 
SET shop_map_api = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14562.359172486611!2d120.66384800000003!3d24.151040000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693dcbf4e574dd%3A0xc8bc0ce278460b02!2z5re75aW96YGLIOWPsOS4reWLpOe-juW6lw!5e0!3m2!1szh-TW!2stw!4v1683163118584!5m2!1szh-TW!2stw'
WHERE shop.shop_id = '14';

UPDATE shop 
SET shop_map_api = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3641.4319383257393!2d120.64839207416654!3d24.12146457841902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693db20aeed9ef%3A0x54aacda913b7a9b4!2zTkVORSBDSElDS0VOIOS4reWxsemGq-Wkp-W6lw!5e0!3m2!1szh-TW!2stw!4v1683163466216!5m2!1szh-TW!2stw'
WHERE shop.shop_id = '62';

UPDATE shop 
SET shop_map_api ='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14562.396951170953!2d120.6535395!3d24.1507085!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693daac9303efd%3A0xa543b78af6cda7d2!2zMTJNSU5J5b-r54Wu6Y2LLeWPsOS4reWFrOebiuadseiIiOW6lw!5e0!3m2!1szh-TW!2stw!4v1683163575091!5m2!1szh-TW!2stw'
WHERE shop.shop_id = '93';
