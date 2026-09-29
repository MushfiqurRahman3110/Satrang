const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

async function prepareFullPage(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * .8) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(700);
}

(async () => {
  fs.mkdirSync('artifacts', { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
  const routes = ['/', '/shop', '/shop/tops', '/shop/bottoms', '/shop/footwear', '/product/gulabi-tie-dye-kamiz', '/about', '/contact'];
  for (const route of routes) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.equal(width, 1440, 'Desktop overflow: ' + route);
    if (['/shop/tops', '/product/gulabi-tie-dye-kamiz', '/contact'].includes(route)) {
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'artifacts/' + route.split('/').pop() + '-desktop.png', fullPage: false });
    }
    console.log('PASS page ' + route);
  }
  await page.goto(base + '/');
  await page.evaluate(() => document.fonts.ready);
  await prepareFullPage(page);
  await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: false });
  await page.screenshot({ path: 'artifacts/home-full.png', fullPage: true });
  await page.locator('.language-toggle').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'bn');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'artifacts/home-bengali.png', fullPage: false });
  await page.locator('.language-toggle').click();
  await page.locator('.search-button').click();
  await page.locator('.search-input-row input').fill('indigo');
  await page.waitForTimeout(650);
  assert.equal(await page.locator('.search-result').count(), 1);
  await page.keyboard.press('Escape');
  console.log('PASS language and live search');
  await page.goto(base + '/shop');
  await page.locator('.color-filter').filter({ hasText: 'Blue' }).locator('input').check();
  assert.equal(await page.locator('.shop-product-grid .product-card').count(), 2);
  await page.locator('.filter-heading button').click();
  assert.equal(await page.locator('.shop-product-grid .product-card').count(), 8);
  await page.locator('.wishlist-button').first().click();
  await page.locator('.saved-filter').click();
  assert.equal(await page.locator('.shop-product-grid .product-card').count(), 1);
  await page.locator('.saved-filter').click();
  await page.locator('.results-toolbar select').selectOption('price-low');
  assert.match(await page.locator('.product-info h3').first().innerText(), /Mati/);
  console.log('PASS filters, sorting, and favourites');
  await page.goto(base + '/product/gulabi-tie-dye-kamiz');
  await page.locator('.size-label-row button').click();
  assert.equal(await page.locator('.size-guide-modal tbody tr').count(), 4);
  await page.keyboard.press('Escape');
  await page.locator('.pdp-sizes button').filter({ hasText: /^S$/ }).click();
  await page.locator('.pdp-buy-row .button').click();
  await page.locator('.cart-drawer').waitFor();
  await page.waitForTimeout(400);
  assert.equal(await page.locator('.cart-item').count(), 1);
  await page.getByRole('button', { name: 'Increase quantity of Gulabi Tie-Dye Kamiz', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.cart-item .quantity-control span')?.textContent === '2');
  await page.getByRole('button', { name: 'Close shopping bag', exact: true }).click();
  await page.reload();
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.bag-count').innerText(), '2');
  await page.locator('.bag-button').click();
  await page.getByRole('button', { name: 'Continue to checkout', exact: true }).click();
  for (const [key, value] of Object.entries({ name: 'Satrang Studio QA', email: 'studio-qa@example.com', phone: '01700000000', address: 'Studio test address, road 1', city: 'Dhaka' })) {
    await page.locator('.checkout-form [name="' + key + '"]').fill(value);
  }
  await page.getByRole('button', { name: 'Place my order', exact: true }).click();
  await page.locator('.order-success').waitFor();
  console.log('PASS cart persistence and checkout', await page.locator('.order-number strong').innerText());
  await page.getByRole('button', { name: 'Close shopping bag', exact: true }).click();
  await page.goto(base + '/contact');
  for (const [key, value] of Object.entries({ name: 'Studio QA', email: 'studio-qa@example.com', message: 'This is an automated storefront quality assurance message. No response is required.' })) {
    await page.locator('.contact-form [name="' + key + '"]').fill(value);
  }
  await page.locator('.contact-form .button').click();
  await page.locator('.contact-success').waitFor();
  console.log('PASS contact form');
  await page.locator('#newsletter-email').fill('studio-qa@example.com');
  await page.locator('.newsletter-form button').click();
  await page.locator('.newsletter-success').waitFor();
  console.log('PASS newsletter subscription');
  assert.deepEqual(errors, [], 'Browser errors');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  const mobile = await mobileContext.newPage();
  for (const route of routes) {
    await mobile.goto(base + route);
    await mobile.evaluate(() => document.fonts.ready);
    const width = await mobile.evaluate(() => document.documentElement.scrollWidth);
    assert.equal(width, 390, 'Mobile overflow: ' + route);
    console.log('PASS mobile page ' + route);
  }
  await mobile.goto(base + '/');
  await mobile.evaluate(() => document.fonts.ready);
  await prepareFullPage(mobile);
  await mobile.screenshot({ path: 'artifacts/home-mobile-first.png', fullPage: false });
  await mobile.screenshot({ path: 'artifacts/home-mobile.png', fullPage: true });
  await mobile.locator('.language-toggle').click();
  await mobile.waitForTimeout(600);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth), 390, 'Bengali mobile overflow');
  await mobile.screenshot({ path: 'artifacts/home-mobile-bengali.png', fullPage: false });
  await mobile.locator('.language-toggle').click();
  await mobile.locator('.mobile-menu-button').click();
  await mobile.locator('.mobile-nav button').click();
  await mobile.locator('.search-input-row input').fill('sandals');
  await mobile.waitForTimeout(600);
  assert.equal(await mobile.locator('.search-result').count(), 1);
  await mobile.keyboard.press('Escape');
  await mobile.locator('.mobile-menu-button').click();
  await mobile.locator('.mobile-nav').getByRole('link', { name: 'Tops', exact: true }).click();
  await mobile.locator('.mobile-filter-toggle').click();
  assert.equal(await mobile.locator('.filter-inner').isVisible(), true);
  console.log('PASS mobile language, search, navigation, and filters');
  await browser.close();
  console.log('ALL BROWSER CHECKS PASSED');
})().catch((error) => { console.error(error); process.exit(1); });
