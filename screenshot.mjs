import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto("http://localhost:3100/itinerary");
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/v3-01-identity-modal.png" });

await page.getByRole("button", { name: "文 文文" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/v3-02-itinerary-day1.png" });

// Scroll the inner <main> to confirm header/bottom-nav stay fixed while
// only the middle content scrolls.
await page.evaluate(() => {
  document.querySelector("main")?.scrollTo(0, 400);
});
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/v3-02b-itinerary-scrolled.png" });

await page.getByRole("link", { name: "記帳" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/v3-03-expenses.png" });

await page.getByRole("link", { name: "美食" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/v3-04-food.png" });

// Souvenir category, likely has cute empty-state or content
await page.getByRole("button", { name: "伴手禮" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/v3-05-food-souvenir.png" });

await browser.close();
console.log("done");
