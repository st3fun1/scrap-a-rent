import puppeteer from "puppeteer";

const browserLaunchOptions = {
  headless: process.env.HEADLESS,
  args: ["--disable-setuid-sandbox"],
  ignoreHTTPSErrors: true,
};

export const startBrowser = async () => {
  let browser;
  try {
    console.log("Opening the browser.....");
    browser = await puppeteer.launch();
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
  return browser;
};

export const goToPage = async (url) => {
  let data = [];
  try {
    const browser = await startBrowser({ headless: true });
    const page = await browser.newPage();
    console.log(`Navigating to ${url}...`);
    await page.goto(url);
    // get all announcements
    data = await page.$$eval(".box-anunt", (items) => {
      console.log("EVAl", items);
      return [{ ceva: "test" }];
    });

    browser.close();
  } catch (e) {
    console.error("ERROR", e);
  }
  return data;
};
