-- 宜蘭羅東小旅行 seed data

INSERT OR IGNORE INTO people (id, name, color) VALUES
  (1, '文文', 'wenwen'),
  (2, '亞軒', 'yaxuan'),
  (3, '莊家', 'zhuangjia'),
  (4, 'CA',   'qiao');

-- Day 1 (2026/08/15)
INSERT INTO itinerary_items (day, sort_order, time, title, location, map_url, note, created_by) VALUES
  (1, 10, '11:00', '台北轉運站搭車', '台北轉運站（4樓）', NULL, '葛瑪蘭客運・單程票，已訂：全票×4、座位9,5,6,8、總額600元 → 羅東轉運站下車', 1),
  (1, 20, NULL,     'Uber 接駁',       NULL, NULL, '車程約 7 分鐘，前往午餐地點', 1),
  (1, 30, NULL,     '午餐：福哥石窯雞羅東店', '五結村', 'https://maps.app.goo.gl/f9cPuJQTDdGjjpUb9', NULL, 1),
  (1, 40, NULL,     '下午茶：覺品 Initiate Coffee', NULL, 'https://maps.app.goo.gl/x4rXS6HdZ3qy61dN6?g_st=ic', '下午茶選項（3 擇 1）', 1),
  (1, 41, NULL,     '下午茶：季意咖啡廳', NULL, 'https://maps.app.goo.gl/9ktrYhFJZ9zno2um9?g_st=il', '下午茶選項（3 擇 1）', 1),
  (1, 42, NULL,     '羅東運動公園野餐', NULL, 'https://maps.app.goo.gl/Xnpfsf8LFeTrsk2Y9', '下午茶選項（3 擇 1）', 1),
  (1, 50, '15:00',  'Check in：羅東公園Villa民宿', NULL, 'https://maps.app.goo.gl/NXhU3KieQGPbJPFM9', NULL, 1),
  (1, 60, '18:00',  '羅東夜市', NULL, 'https://maps.app.goo.gl/YbAK8gLcSanMiA946', NULL, 1);

-- Day 2 (2026/08/16)
INSERT INTO itinerary_items (day, sort_order, time, title, location, map_url, note, created_by) VALUES
  (2, 10, '11:00', 'Check out，附近吃東西', NULL, NULL, NULL, 1),
  (2, 20, '13:00', '宜蘭傳藝園區', NULL, 'https://maps.app.goo.gl/59kiGSYLZ1fEjgFX6', NULL, 1),
  (2, 30, '15:00', '搭客運回台北', NULL, NULL, NULL, 1);

-- Expense seed: outbound bus tickets (from the ticket screenshot)
-- Uses explicit id=1 rather than last_insert_rowid(): this seed only ever
-- runs once against a fresh (empty) database, so the new expense row is
-- guaranteed to get id 1 — avoids last_insert_rowid() portability quirks
-- across the local file driver / Turso's remote protocol.
INSERT INTO expenses (id, day, title, amount, paid_by, split_type, created_by) VALUES
  (1, 1, '去程車票（台北→羅東，葛瑪蘭客運）', 600, 1, 'equal', 1),
  (2, 1, '飯店住宿費（羅東公園Villa民宿）', 4500, 1, 'equal', 1);

INSERT INTO expense_participants (expense_id, person_id, share_amount)
SELECT 1, id, 150 FROM people;

INSERT INTO expense_participants (expense_id, person_id, share_amount)
SELECT 2, id, 1125 FROM people;

-- Food: 羅東夜市
INSERT INTO food_items (category, name, note, created_by) VALUES
  ('night_market', '阿灶伯當歸羊肉湯', '羊肉湯人氣No.1｜中藥香層次豐富、清甜順口', 1),
  ('night_market', '羊舖子當歸羊肉湯', '假日中午就營業好安排｜羊肉片給得誠意十足', 1),
  ('night_market', '義豐蔥油派', '30年老店、當日現採青蔥｜餅皮外脆內有層次', 1),
  ('night_market', '魏姐包心粉圓', '包心粉圓創始店、超大顆彈牙｜牛奶雪沙冰透心涼', 1),
  ('night_market', '玉本舖三星蔥餅', '薄脆皮包滿三星蔥｜像用炸的水煎包', 1),
  ('night_market', '七巧味三星蔥多餅', '皮軟厚、胡椒粉撒得多｜附醬油辣醬，吃重鹹必選', 1),
  ('night_market', '羅東紅豆湯圓', '近60年甜品老店｜湯圓白胖軟彈、45元超平價', 1),
  ('night_market', '羅東帝爺廟口喉咕麵', '古早味乾麵、豬油烏醋調味｜麵體Q彈，營業早要趁早', 1),
  ('night_market', '堂薯薯臭薯條', '臭豆腐做成薯條狀、外酥內軟｜特調起司口味必試', 1),
  ('night_market', '小春卜肉', '現點現炸、粉漿香脆｜豬肉條紮實香甜不油膩', 1),
  ('night_market', '龍烤肉風味', '40年老店、一串10-40元｜三星蔥豬肉串必點', 1),
  ('night_market', '隆新一串心', '一串心創始店、食材多元｜雞肝最對味、適合當開胃菜', 1),
  ('night_market', '鄭記潤餅', '一捲50元超大份｜餅皮香Q、配料豐富不過甜', 1),
  ('night_market', '嘎味鮮湯包', '溫體豬肉、不加修飾澱粉｜三星蔥口味鮮甜多汁', 1),
  ('night_market', '三星蔥肉串', '排隊人氣名店、蔥給得大方｜偶爾烤偏焦偏柴，碰運氣', 1),
  ('night_market', '冰雪冷飲部', '在地人回憶、冰店還賣熟食｜牛奶花生雙色雪花冰加布丁', 1);

-- Food: 餐廳（來自行程，先預設，可自行刪改）
INSERT INTO food_items (category, name, note, map_url, created_by) VALUES
  ('restaurant', '福哥石窯雞羅東店', '五結村・Day1 午餐', 'https://maps.app.goo.gl/f9cPuJQTDdGjjpUb9', 1),
  ('restaurant', '覺品 Initiate Coffee', 'Day1 下午茶選項', 'https://maps.app.goo.gl/x4rXS6HdZ3qy61dN6?g_st=ic', 1),
  ('restaurant', '季意咖啡廳', 'Day1 下午茶選項', 'https://maps.app.goo.gl/9ktrYhFJZ9zno2um9?g_st=il', 1);

-- Food: 伴手禮
INSERT INTO food_items (category, name, note, created_by) VALUES
  ('souvenir', '年輪蛋糕－亞典菓子工場', '宜蘭當地烘焙名店必買｜特殊烤箱300多度高溫懸空式烘烤，濃郁蛋香、豐富多層次口感｜除經典奶油原味，還有巧克力、抹茶、草莓、米年輪四種口味', 1),
  ('souvenir', '奶凍捲／切達乳酪狀元餅－奕順軒宜蘭店', '宜蘭必買伴手禮，礁溪／宜蘭市／羅東皆有分店｜奶凍捲、派拿波崙、切達乳酪狀元餅都推薦，鳳眼酥、鳳梨酥也很多人推薦｜入口酥鬆、香氣十足', 1),
  ('souvenir', '特牛鮮奶酥餅－宜蘭餅', '宜蘭伴手禮名店，一站式購買伴手禮、土產首選｜特級牛奶餡料，奶香與酥皮交融、多層次口感｜紅色禮盒包裝喜氣，店內暢銷冠軍', 1);
