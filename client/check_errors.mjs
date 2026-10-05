import puppeteer from 'puppeteer';

const WEB_PORT = process.env.WEB_PORT || '5173';
const ROUTES = ['/', '/menu', '/about', '/contact'];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log('BROWSER_CONSOLE:', msg.type(), msg.text());
    }
  });
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  page.on('requestfailed', r => console.log('REQUEST_FAILED:', r.url(), r.failure().errorText));
  page.on('response', r => {
    if (r.status() >= 400) console.log('HTTP_' + r.status() + ':', r.url());
  });

  console.log('--- Route rendering ---');
  for (const route of ROUTES) {
    await page.goto(`http://localhost:${WEB_PORT}${route}`, { waitUntil: 'networkidle0' })
      .catch(e => console.log('GOTO_ERROR:', route, e.message));
    await new Promise(r => setTimeout(r, 4500));
    const info = await page.evaluate(() => {
      const root = document.getElementById('root');
      const main = document.querySelector('main');
      return {
        len: root ? root.innerHTML.length : -1,
        main: !!main,
        h: main ? Math.round(main.getBoundingClientRect().height) : 0,
        title: main?.querySelector('h1')?.innerText || document.title,
      };
    });
    console.log(`  ROUTE ${route}:`, JSON.stringify(info));
    await page.screenshot({ path: `debug${route === '/' ? '-home' : route.replace(/\//g, '-')}.png` });
  }

  console.log('\n--- Integration: cart checkout against the real API ---');
  const apiCalls = [];
  page.on('response', r => {
    if (r.url().includes('/api/orders')) apiCalls.push(`POST /api/orders -> ${r.status()}`);
  });

  await page.goto(`http://localhost:${WEB_PORT}/menu`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4500));

  const added = await page.evaluate(() => {
    const btn = document.querySelector('.menu-item__add-btn:not([disabled])');
    if (!btn) return 'no add button';
    btn.click();
    return 'clicked';
  });
  console.log('  add-to-cart:', added);
  await new Promise(r => setTimeout(r, 1500));

  console.log('  cart:', JSON.stringify(await page.evaluate(() => ({
    badge: document.querySelector('.navbar__cart-badge')?.innerText || 'none',
    drawerOpen: !!document.querySelector('.cart-drawer.open'),
    total: document.querySelector('.cart-drawer__total-value')?.innerText || 'none',
  }))));

  // Open the cart drawer (adding from the menu grid doesn't open it).
  await page.evaluate(() => document.querySelector('#cart-toggle')?.click());
  await new Promise(r => setTimeout(r, 900));
  console.log('  drawer open:', await page.evaluate(() => !!document.querySelector('.cart-drawer.open')));

  // Type into the customer fields. The drawer footer can sit outside the
  // viewport, so focus() + keyboard is used instead of a physical click.
  const fields = await page.$$('.cart-drawer__input');
  console.log('  customer fields found:', fields.length);
  for (const [i, value] of ['Puppeteer Tester', '5 Allen Avenue, Ikeja, Lagos'].entries()) {
    if (fields[i]) {
      await fields[i].focus();
      await page.keyboard.type(value, { delay: 20 });
    }
  }
  await new Promise(r => setTimeout(r, 800));

  console.log('  checkout button:', JSON.stringify(await page.evaluate(() => {
    const b = document.querySelector('.cart-drawer__checkout');
    return { disabled: b?.disabled, text: b?.innerText.trim() };
  })));

  await page.evaluate(() => document.querySelector('.cart-drawer__checkout')?.click());
  await new Promise(r => setTimeout(r, 3000));

  console.log('  api calls:', apiCalls.length ? apiCalls.join(', ') : 'NONE');
  console.log('  final button label:', await page.evaluate(() =>
    document.querySelector('.cart-drawer__checkout')?.innerText.trim()
  ));
  await page.screenshot({ path: 'debug-checkout.png' });

  await browser.close();
})();
