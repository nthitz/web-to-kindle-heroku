import puppeteer from 'puppeteer'

async function doIt() {

  const browser = await puppeteer.launch({  args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 800 });
  await page.goto(`https://reddit.com`);
  // await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.waitFor(5000);
  await page.screenshot({
    path: './testScreenshot.png',
  });

  await browser.close()

}
doIt()
