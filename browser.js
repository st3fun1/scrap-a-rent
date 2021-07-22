const puppeteer = require("puppeteer");

const browserLaunchOptions = {
  headless: process.env.HEADLESS,
  args: ["--disable-setuid-sandbox"],
  ignoreHTTPSErrors: true,
};

const startBrowser = async () => {
  let browser;
  try {
    browser = await puppeteer.launch();
  } catch (err) {}
  return browser;
};

const goToPage = async (url) => {
  let data = [];
  try {
    const browser = await startBrowser({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    // get all announcements
    data = await page.$$eval(".box-anunt", (items) => {
      return [{ ceva: "test" }];
    });

    browser.close();
  } catch (e) {}
  return data;
};

module.exports = {
  startBrowser,
  goToPage,
};
