import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' }).catch(e => console.log('GOTO_ERROR:', e.message));
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await page.screenshot({ path: 'screenshot.png' });
  
  await browser.close();
  console.log('Screenshot saved');
})();
