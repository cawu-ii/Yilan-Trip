# 宜蘭羅東小旅行 🎫

文文・亞軒・莊家・CA的 2026/08/15–08/16 宜蘭羅東小旅行行動網頁：行程、記帳（分攤/平分）、美食清單（羅東夜市／餐廳／伴手禮），4 人都能編輯、多裝置即時同步。

技術：Next.js（App Router）＋ Tailwind CSS ＋ Turso（libSQL）＋ Pusher（即時同步，選填）＋ Vercel。

---

## 今晚要上線的最快路徑（trip 明天就出發）

1. 只申請 **Turso** 帳號（免費、免信用卡）→ 5 分鐘可完成 → App 就能正常運作（多人編輯會同步，只是要手動下拉/等 45 秒自動整理，不是逐秒即時）。
2. **Pusher**（即時同步）可以先跳過，之後有空再補，不影響今晚能不能用。
3. 部署到 Vercel。

以下是完整步驟：

## 1. 本機先跑起來看看（選用，但建議先確認畫面沒問題）

```bash
npm install
npm run db:init   # 建立本地 SQLite 檔案 local.db，並灌入行程/記帳/美食種子資料
npm run dev
```

打開 http://localhost:3000 ，第一次會跳出「你是誰？」選一位。這個模式資料庫是本機檔案 `local.db`，只有你自己看得到，不會跟朋友同步——正式使用要接 Turso（見下方）。

## 2. 申請 Turso（資料庫，必要）

1. 到 https://turso.tech 註冊帳號（可以用 GitHub 登入）。
2. 安裝 CLI 並登入：
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   turso auth login
   ```
3. 建立資料庫：
   ```bash
   turso db create ylrd-trip
   ```
4. 灌入 schema + 種子資料（行程、車票記帳、美食清單都已經幫你打好了）：
   ```bash
   turso db shell ylrd-trip < db/schema.sql
   turso db shell ylrd-trip < db/seed.sql
   ```
5. 取得連線資訊：
   ```bash
   turso db show ylrd-trip --url
   turso db tokens create ylrd-trip
   ```
   分別對應 `.env.local.example` 裡的 `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN`。

也可以跳過手動 shell 匯入，改用專案內建的腳本（會自動判斷 people 表是否已有資料，避免重複灌種子）：

```bash
TURSO_DATABASE_URL=libsql://xxx.turso.io TURSO_AUTH_TOKEN=xxx npm run db:init
```

## 3. 申請 Pusher（即時同步，選填但建議之後補上）

1. 到 https://pusher.com 註冊帳號，建立一個 **Channels** app。
2. Cluster 選 **ap3（Singapore）**，離台灣最近、延遲最低。
3. 在 App Keys 頁面複製：`app_id`、`key`、`secret`、`cluster`，填進 `.env.local` 對應欄位（`NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER` 跟 `PUSHER_KEY` / `PUSHER_CLUSTER` 填一樣的值）。

沒填這組變數也完全不影響功能——只是同步方式從「幾秒內即時推播」降級成「每 45 秒自動重新整理」。

## 4. 部署到 Vercel

1. 把這個資料夾 push 到一個 GitHub repo。
2. 到 https://vercel.com/new 匯入這個 repo（會自動偵測是 Next.js 專案，不用改設定）。
3. 在 Vercel 專案的 **Settings → Environment Variables**，把 `.env.local.example` 裡列的所有變數（Turso 一定要，Pusher 那組看你要不要接）貼上去，記得 Production 跟 Preview 都要打勾。
4. Deploy。完成後會拿到一個 `*.vercel.app` 網址，直接分享給文文、亞軒、莊家、CA，不需要註冊登入。

## 已經幫你灌好的種子資料

- **行程**：Day1（8/15）從搭車、午餐福哥石窯雞、下午茶三選一、Check in 民宿到羅東夜市；Day2（8/16）Check out、宜蘭傳藝園區、搭車回台北。
- **記帳**：去程車票 600 元（已依你傳的車票截圖建立，平分成每人 150 元；付款人先預設「文文」，記得在 App 上改成實際刷卡的人）。
- **美食**：羅東夜市 16 家必吃、餐廳 3 家（行程裡提到的）、伴手禮 3 個（亞典菓子工場年輪蛋糕、奕順軒奶凍捲、宜蘭餅特牛鮮奶酥餅）。

都可以直接在 App 上編輯、刪除、新增，不需要重新部署。

## 已知取捨

- 沒有帳號密碼保護，知道網址的人就能編輯——網址請只在你們 4 人的群組裡分享。
- 記帳只顯示每人的「淨結餘」，不會自動算「誰該轉帳給誰」，4 人自己對一下金額即可。
- 兩人同時編辑同一筆資料時，後儲存的會蓋掉先儲存的（沒有版本鎖定），4 人小群組使用風險很低。

## 專案結構

```
app/                Next.js App Router 頁面與 API routes
components/          UI 元件（layout / itinerary / expenses / food / shared / ui）
lib/                 資料庫、Pusher、身份識別、驗證等共用邏輯
db/schema.sql        資料表結構
db/seed.sql          種子資料（行程／記帳／美食）
scripts/init-db.mjs  一鍵建表＋灌種子資料的腳本（本機或 Turso 都能用）
```
