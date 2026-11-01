import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.PREVIEW_URL || "http://127.0.0.1:5173";
const root = path.resolve("output", "sections");
await fs.mkdir(root, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const allViewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "390x844", width: 390, height: 844 },
  { name: "740x360", width: 740, height: 360 },
  { name: "1280x800", width: 1280, height: 800 },
];
const viewports = process.env.VIEWPORT
  ? allViewports.filter(({ name }) => name === process.env.VIEWPORT)
  : allViewports;
const sections = ["cover", "words", "couple", "countdown", "programme", "story", "candle", "gallery", "venue", "gift", "finale"];
const report = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.locator("#open-invitation").click({ force: true });
  await page.waitForTimeout(6000);
  const checks = [];

  for (const id of sections) {
    const metrics = await page.locator(`#${id}`).evaluate((element) => ({ top: element.offsetTop, height: element.offsetHeight }));
    const ratio = id === "programme" ? .36 : id === "story" ? .42 : id === "candle" ? .2 : 0;
    await page.evaluate(({ y }) => window.scrollTo(0, y), { y: metrics.top + metrics.height * ratio });
    await page.waitForTimeout(700);
    const state = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, width: innerWidth, x: scrollX, y: scrollY }));
    checks.push({ id, ...state, overflowing: state.scrollWidth > state.width + 1 });
    await page.screenshot({ path: path.join(root, `${viewport.name}-${id}.png`), fullPage: false });
  }

  await page.evaluate(() => document.querySelector("#candle").scrollIntoView());
  await page.waitForTimeout(500);
  await page.locator("#candle").click({ position: { x: Math.round(viewport.width * .58), y: Math.round(Math.min(viewport.height * .62, 420)) }, force: true });
  await page.screenshot({ path: path.join(root, `${viewport.name}-candle-interaction.png`) });

  await page.evaluate(() => document.querySelector("#gallery").scrollIntoView());
  await page.waitForTimeout(500);
  await page.locator("[data-gallery-index='0']").click({ force: true });
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(root, `${viewport.name}-gallery-viewer.png`) });
  await page.locator(".viewer-close").click({ force: true });

  report.push({ viewport, checks, errors });
  await context.close();
}

await browser.close();
const reportName = process.env.VIEWPORT ? `report-${process.env.VIEWPORT}.json` : "report.json";
await fs.writeFile(path.join(root, reportName), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
