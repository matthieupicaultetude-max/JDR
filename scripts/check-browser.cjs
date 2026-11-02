// Optional regression check. Requires Playwright and Chromium; see README.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  try {
    for (const embedded of [false, true]) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const url = process.env.SIGNAL_URL || 'http://127.0.0.1:3000';
      await page.goto(url);
      if (embedded) {
        await page.setContent(`<iframe sandbox="allow-scripts allow-same-origin" src="${url}" style="width:1200px;height:1200px"></iframe>`);
      }
      const ui = embedded ? page.frameLocator('iframe') : page;
      const state = async () => {
        const frame = embedded ? page.frames()[1] : page;
        return frame.evaluate(() => JSON.parse(localStorage.getItem('signal-prototype-v1')));
      };
      await ui.locator('#alloc0').fill('1');
      await ui.locator('#save-decision').click();
      assert.deepEqual((await state()).players[0].choice.alloc, [1, 0]);
      await ui.locator('#alloc1').fill('1');
      await ui.locator('#save-decision').click();
      assert.deepEqual((await state()).players[0].choice.alloc, [1, 0], 'Over-allocation must not replace the saved choice');
      await ui.locator('#text').fill('Accord collectif');
      await ui.locator('#send-message').click();
      assert.equal((await state()).messages[0].text, 'Accord collectif');
      await ui.locator('#recipient').selectOption('1');
      await ui.locator('#text').fill('Message privé');
      await ui.locator('#send-message').click();
      await ui.locator('[data-player="1"]').click();
      assert.equal(await ui.locator('.message').count(), 2);
      await ui.locator('[data-player="2"]').click();
      assert.equal(await ui.locator('.message').count(), 1, 'Private message must be hidden from other players');
      await ui.locator('#send-message').click();
      assert.equal((await state()).messages.length, 2, 'Empty message must not be sent');
      if (embedded) await page.frames()[1].evaluate(() => location.reload());
      else await page.reload();
      await ui.locator('#decision').waitFor();
      assert.deepEqual((await state()).players[0].choice.alloc, [1, 0]);
      assert.equal((await state()).messages.length, 2);
      assert.deepEqual(errors, []);
      console.log(`PASS: decisions, validation, public/private messages, persistence (${embedded ? 'sandboxed preview' : 'normal page'})`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
