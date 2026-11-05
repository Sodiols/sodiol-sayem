// Run against the built app. Reuses an existing external Playwright installation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium, firefox, webkit } = await import(process.env.PLAYWRIGHT_MODULE_PATH ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE_PATH, 'index.mjs')).href : 'playwright');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3203';
const output = '.reference/refinement';
fs.mkdirSync(output, { recursive: true });
const projects = ['husnalogy', 'tara', 'epic-elites', 'prichat'];
const names = ['Husnalogy', 'TARA', 'Epic Elites', 'PriChat'];
const reports = [];
const browserErrors = [];
async function ready(page, url = '/') {
  await page.goto(base + url);
  await page.waitForSelector('[data-intro="complete"]', { state: 'attached' });
  const reject = page.getByRole('button', { name: 'Reject optional', exact: true }).first();
  if (await reject.isVisible()) await reject.click();
}
async function images(page) {
  // Visit the whole document before checking lazy assets. A jump straight to
  // the footer can otherwise leave skipped lazy images waiting indefinitely.
  await page.evaluate(async () => {
    const original = scrollY;
    for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight) {
      scrollTo({ top, behavior: 'instant' });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    scrollTo({ top: original, behavior: 'instant' });
  });
  await page.locator('img').evaluateAll(async elements => {
    await Promise.all(elements.map(el => el.decode().catch(() => {})));
  });
  assert.deepEqual(await page.locator('img').evaluateAll(elements => elements.filter(el => el.complete && !el.naturalWidth).map(el => el.src)), []);
}
function errors(page) { page.on('pageerror', error => browserErrors.push(error.message)); page.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()); }); }
try {
  for (const slug of projects) {
    const response = await fetch(`${base}/work/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert(html.includes('Development Case Study | Sodiol Sayem'));
    assert(html.includes(`rel="canonical" href="https://sodiol-sayem.vercel.app/work/${slug}"`));
    assert(html.includes('property="og:type" content="article"'));
    assert(!html.includes('href="https://github.com/Sodiols/husnalogy'));
    assert(!html.includes('href="https://github.com/Sodiols/prichat'));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  }
  assert.equal((await fetch(base + '/work/missing-case')).status, 404);
  const sitemap = await (await fetch(base + '/sitemap.xml')).text();
  for (const slug of projects) assert(sitemap.includes(`/work/${slug}</loc>`));
  reports.push({ caseMetadata: true, staticCasePages: 4, unknownCase404: true, sitemap: true });
  const engines = (process.env.TEST_ENGINES || 'chromium,firefox,webkit').split(',');
  for (const [engineName, engine] of [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]].filter(([name]) => engines.includes(name))) {
    console.log('Starting', engineName);
    const browser = await engine.launch();
    try {
      for (const width of engineName === 'chromium' ? [320, 390, 768, 1440] : [390]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        errors(page);
        await ready(page);
        assert.equal(await page.locator('h1').innerText(), 'Full-Stack Developer.');
        assert(await page.locator('#experience').innerText().then(text => text.includes('Senior Developer') && text.includes('July 2026')));
        assert(await page.locator('#experience time').getAttribute('datetime') === '2026-07-01');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await images(page);
        await page.screenshot({ path: `${output}/${engineName}-home-${width}.png`, fullPage: true });
        // Every project, its inline case, return action, and real destination.
        for (let i = 0; i < projects.length; i++) {
          await page.getByRole('button', { name: `Show ${names[i]}`, exact: true }).click();
          await page.waitForSelector(`[data-showcase][data-active="${i}"] [data-carousel][aria-busy="false"]`);
          const live = page.locator('[data-project-info] a');
          assert.equal(await live.getAttribute('target'), '_blank');
          await page.getByRole('button', { name: 'Read the case' }).click();
          const article = page.locator('[data-case-study]');
          assert.equal(await article.getAttribute('data-project'), projects[i]);
          assert(await article.getByRole('list', { name: 'Technologies used' }).isVisible());
          assert.equal(await article.locator('[data-case-decisions] > div').count(), 3);
          assert.equal(await article.getByRole('link', { name: 'Open full case study' }).getAttribute('href'), `/work/${projects[i]}`);
          await article.getByRole('button', { name: 'Back to work' }).first().click();
          await article.waitFor({ state: 'detached' });
          assert.equal(await page.locator(':focus').getAttribute('id'), 'project-carousel');
        }
        const carousel = page.locator('[data-carousel]');
        await carousel.focus(); await page.keyboard.press('Home');
        await page.waitForSelector('[data-showcase][data-active="0"] [aria-busy="false"]');
        await page.keyboard.press('End');
        await page.waitForSelector('[data-showcase][data-active="3"] [aria-busy="false"]');
        await page.keyboard.press('ArrowRight');
        await page.waitForSelector('[data-showcase][data-active="0"] [aria-busy="false"]');
        // Native disclosure is operable from the keyboard.
        const additional = page.locator('#skills summary');
        await additional.focus(); await page.keyboard.press('Enter');
        assert(await additional.evaluate(el => el.parentElement.open));
        assert.equal(await page.locator('#skills details li').count(), 10);
        await page.keyboard.press('Space');
        assert(!await additional.evaluate(el => el.parentElement.open));
        // Escape restores focus; each navigation destination closes the modal.
        const menu = page.getByRole('button', { name: 'Open navigation menu' });
        await menu.click(); await page.getByRole('dialog', { name: 'Main navigation' }).waitFor();
        await page.keyboard.press('Escape');
        await page.getByRole('dialog', { name: 'Main navigation' }).waitFor({ state: 'hidden' });
        await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Open navigation menu');
        for (const [label, hash] of [['About', '#about'], ['Toolkit', '#skills'], ['Contact', '#contact'], ['Works', '#work']]) {
          await menu.click();
          await page.locator('#navigation-overlay').getByRole('link', { name: new RegExp(label) }).click();
          await page.waitForFunction(hash => location.hash === hash && !document.querySelector('#navigation-overlay[open]'), hash);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        }
        for (const slug of projects) {
          await ready(page, `/work/${slug}`);
          await images(page);
          assert.equal(await page.locator('h1').count(), 1);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          if (width === 390 || width === 1440) await page.screenshot({ path: `${output}/${engineName}-${slug}-${width}.png`, fullPage: true });
        }
        reports.push({ engine: engineName, width, carousel: true, allCases: true, keyboard: true, navigation: true, images: true, overflow: false });
        await page.close();
        console.log(engineName, width, 'portfolio checks passed');
      }
      if (engineName === 'chromium') {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        errors(page);
        await page.addInitScript(() => {
          window.__qaVitals = { cls: 0, lcp: 0 };
          new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__qaVitals.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver(list => { window.__qaVitals.lcp = list.getEntries().at(-1).startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        });
        await ready(page);
        const introMs = await page.evaluate(() => performance.now());
        const menu = page.getByRole('button', { name: 'Open navigation menu' });
        await menu.click();
        await page.waitForSelector('#navigation-overlay[data-state="open"]');
        await page.getByRole('button', { name: 'Close navigation menu' }).focus();
        await page.keyboard.press('Shift+Tab');
        assert(await page.locator(':focus').evaluate(el => Boolean(el.closest('#navigation-overlay'))));
        await page.keyboard.press('Escape');
        await page.locator('#navigation-overlay').waitFor({ state: 'hidden' });
        await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Open navigation menu');
        await menu.click();
        await page.locator('#navigation-overlay').waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        await page.locator('#navigation-overlay').waitFor({ state: 'hidden' });
        const artwork = page.locator('[data-carousel] > div').first();
        await artwork.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: 280, clientY: 160 });
        await artwork.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: 100, clientY: 165 });
        await page.waitForSelector('[data-showcase][data-active="1"] [aria-busy="false"]');
        await page.getByRole('button', { name: 'Show PriChat', exact: true }).click();
        await page.getByRole('button', { name: 'Show TARA', exact: true }).click();
        await page.getByRole('button', { name: 'Show Epic Elites', exact: true }).click();
        await page.waitForSelector('[data-showcase][data-active="2"] [aria-busy="false"]');
        await page.getByRole('button', { name: 'Read the case' }).click();
        await page.goBack();
        await page.locator('[data-case-study]').waitFor({ state: 'detached' });
        await ready(page, '/#case-prichat');
        await page.waitForSelector('[data-case-study][data-project="prichat"]');
        const vitals = await page.evaluate(() => window.__qaVitals);
        reports.push({ normalMotion: true, animatedMenu: true, focusTrap: true, quickMenuReversal: true, swipeHandler: true, rapidSelection: true, browserHistory: true, directCaseHash: true, introReadyAfterMs: Math.round(introMs), localLabVitals: vitals });
        await page.close();
        const noJS = await browser.newPage({ javaScriptEnabled: false });
        await noJS.goto(base);
        assert(await noJS.getByRole('heading', { level: 1 }).isVisible());
        assert.equal(await noJS.locator('noscript a[href^="/work/"]').count(), 4);
        await noJS.goto(base + '/work/tara');
        assert(await noJS.getByRole('heading', { level: 1 }).isVisible());
        assert.equal(await noJS.locator('[data-case-decisions] > div').count(), 3);
        reports.push({ noJavaScript: true });
        await noJS.close();
      }
    } finally { await browser.close(); }
  }
  assert.deepEqual(browserErrors, []);
  fs.writeFileSync(`${output}/verification.json`, JSON.stringify({ reports, browserErrors }, null, 2));
  console.log('All portfolio refinement checks passed. Live form delivery and field CWV remain separate checks.');
} catch (error) { console.error(error); process.exitCode = 1; }
