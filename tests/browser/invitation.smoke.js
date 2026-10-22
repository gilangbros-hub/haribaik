// Run with playwright-cli run-code --filename tests/browser/invitation.smoke.js against npm run dev.
async (page) => {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const errors = [];
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  page.on('pageerror', error => errors.push(error.message));
  for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:4321/design/preview');
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    const button = page.getByRole('button', { name: 'Buka Undangan' });
    assert(await page.locator('#invitation-body').isHidden(), 'Content visible before opening');
    assert(await page.evaluate(() => getComputedStyle(document.documentElement).overflow === 'hidden'), 'Scroll not locked');
    await page.mouse.wheel(0, 600);
    assert(await page.evaluate(() => scrollY === 0), 'Cover scrolled before opening');
    const bounds = await button.boundingBox();
    assert(bounds && bounds.y >= 0 && bounds.y + bounds.height <= height, 'Open button outside viewport at ' + width);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow at ' + width);
    await button.click();
    await page.locator('.cover').waitFor({ state: 'hidden' });
    await page.locator('#invitation-body').waitFor({ state: 'visible' });
    assert(await page.locator('#invitation-body').evaluate(el => el === document.activeElement), 'Focus did not enter invitation');
    assert(await page.evaluate(() => getComputedStyle(document.documentElement).overflow !== 'hidden'), 'Scroll remained locked');
    await page.getByRole('link', { name: 'Acara', exact: true }).click();
    await page.waitForURL('**#acara');
    await page.locator('.event-card.is-visible').first().waitFor();
    assert(await page.locator('.event-time').first().innerText().then(text => text.includes('WIB') && !text.includes('Asia/Jakarta')), 'Timezone not readable');
    await page.locator('#panduan').scrollIntoViewIfNeeded();
    await page.getByText('Bagaimana cara menyimpan jadwal?', { exact: true }).click();
    assert(await page.locator('details[open]').count() === 1, 'FAQ did not expand');
    assert(await page.evaluate(() => scrollY > 0), 'Invitation cannot scroll');
    await page.getByRole('link', { name: 'Pembuka', exact: true }).click();
    assert(await page.locator('#kehadiran').count() === 0, 'Public invitation exposed RSVP');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.getByRole('button', { name: 'Buka Undangan' }).click();
  assert(await page.locator('.cover').isHidden(), 'Reduced-motion opening failed');
  assert(await page.locator('.welcome h2').evaluate(el => getComputedStyle(el).opacity === '1'), 'Reduced-motion content invisible');
  assert(await page.locator('#invitation-body').evaluate(el => el.getAnimations().length === 0), 'Reduced-motion transition still animates');
  const missing = await page.locator('img').evaluateAll(images => images.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
  assert(!missing.length, 'Broken images: ' + missing.join(', '));
  assert(!errors.length, 'Browser errors: ' + errors.join(', '));
  const noScript = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const staticPage = await noScript.newPage();
    await staticPage.goto('http://127.0.0.1:4321/design/preview');
    assert(await staticPage.locator('#invitation-body').isVisible(), 'No-JavaScript fallback hidden');
    assert(await staticPage.getByRole('button', { name: 'Buka Undangan' }).isHidden(), 'No-JavaScript dead button visible');
  } finally {
    await noScript.close();
  }
  console.log('PASS: locked cover, opening, focus, mobile/desktop layout, scroll, navigation, FAQ, timezone, reduced motion, assets.');
}
