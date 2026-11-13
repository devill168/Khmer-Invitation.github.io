import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.PREVIEW_URL || "http://127.0.0.1:5173/Khmer-Invitation.github.io/";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const report = [];
const screenshotRoot = path.resolve("output", "qa");

if (process.env.SCREENSHOTS === "1") {
  await fs.mkdir(screenshotRoot, { recursive: true });
}

for (const width of [320, 360, 390, 430]) {
  const page = await browser.newPage({ viewport: { width, height: 844 } });
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);

  if (process.env.SCREENSHOTS === "1") {
    await page.evaluate(() => {
      document.querySelector(".preloader")?.remove();
      document.querySelector(".envelope-screen")?.remove();
      document.documentElement.classList.remove("invitation-locked");
      document.body.classList.remove("invitation-locked");
    });
    await page.locator(".formal-card").evaluate((card) => {
      card.style.opacity = "1";
      card.style.transform = "none";
    });
    await page.locator(".formal-card").screenshot({
      path: path.join(screenshotRoot, `parents-${width}px.png`),
    });
  }

  const result = await page.locator(".parents-grid").evaluate((grid) => ({
    width: innerWidth,
    documentOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    labels: [...grid.querySelectorAll(".parent-block .section-label.lang-km")].map((label) => {
      const range = document.createRange();
      range.selectNodeContents(label);
      return {
        text: label.textContent.trim(),
        lineCount: range.getClientRects().length,
        availableWidth: Math.round(label.getBoundingClientRect().width * 10) / 10,
        textWidth: Math.round(range.getBoundingClientRect().width * 10) / 10,
      };
    }),
    names: [...grid.querySelectorAll(".khmer-lines p")].map((paragraph) => {
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      return {
        text: paragraph.textContent.trim(),
        lineCount: range.getClientRects().length,
        availableWidth: Math.round(paragraph.getBoundingClientRect().width * 10) / 10,
        textWidth: Math.round(range.getBoundingClientRect().width * 10) / 10,
      };
    }),
  }));

  report.push(result);
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));

if (report.some(({ documentOverflow, labels, names }) => documentOverflow || [...labels, ...names].some(({ lineCount }) => lineCount !== 1))) {
  process.exitCode = 1;
}
