import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.PREVIEW_URL || "http://127.0.0.1:5173";
const root = path.resolve("output", "qa");
const edgeCandidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

await fs.mkdir(root, { recursive: true });
let executablePath;
for (const candidate of edgeCandidates) {
  try { await fs.access(candidate); executablePath = candidate; break; } catch {}
}

const browser = await chromium.launch({ headless: true, executablePath });
const viewports = [
  { name: "phone-320x568", width: 320, height: 568 },
  { name: "phone-390x844", width: 390, height: 844 },
  { name: "landscape-740x360", width: 740, height: 360 },
  { name: "desktop-1280x800", width: 1280, height: 800 },
];
const report = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => message.type() === "error" && consoleErrors.push(message.text()));
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(root, `${viewport.name}-01-envelope.png`), fullPage: false });

  const overflowBefore = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    overflowing: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));

  await page.locator("#open-invitation").click({ force: true });
  const sequence = viewport.name === "phone-390x844"
    ? [[220, "02-press"], [480, "03-release"], [500, "04-flap"], [650, "05-card"], [1350, "06-cover"]]
    : [[3600, "02-cover"]];

  for (const [delay, label] of sequence) {
    await page.waitForTimeout(delay);
    await page.screenshot({ path: path.join(root, `${viewport.name}-${label}.png`), fullPage: false });
  }

  const cover = await page.locator("#cover").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const content = element.querySelector(".cover-content")?.getBoundingClientRect();
    return {
      visible: getComputedStyle(element).visibility === "visible" && getComputedStyle(element).opacity !== "0",
      rect: { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height },
      content: content ? { top: content.top, bottom: content.bottom, width: content.width, height: content.height } : null,
      viewport: { width: innerWidth, height: innerHeight },
    };
  });
  const overflowAfter = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    overflowing: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));

  report.push({ viewport, overflowBefore, overflowAfter, cover, consoleErrors, pageErrors });
  await context.close();
}

await browser.close();
await fs.writeFile(path.join(root, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
