const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:1360,height:1000}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await page.goto((process.env.SIGNAL_URL||'http://127.0.0.1:3000')+'/freedom.html');
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('signal-freedom-v1')));
  await page.locator('input[name=choice0][value=public]').check();await page.locator('#choose0').click();
  assert.equal((await read()).messages[0].to,'all');
  await page.locator('#fact').fill('La clé de mon premier atelier, offerte par ma sœur.');await page.locator('#add-fact').click();
  await page.getByText('Proposer un autre plan',{exact:true}).click();
  await page.locator('#plan-text').fill('Faire passer un masque par le conduit de service.');await page.locator('#plan-target').selectOption('3');await page.locator('#plan-helper').selectOption('2');await page.locator('#propose').click();
  assert.equal((await read()).players[0].second,'plan:0');
  await page.locator('[data-player="2"]').click();
  await page.locator('input[name=choice0][value=truth]').check();await page.locator('#choose0').click();await page.locator('[data-help="0"]').click();
  assert.equal((await read()).players[2].second,'assist:0');
  await page.locator('[data-player="4"]').click();await page.locator('input[name=choice0][value=confess]').check();await page.locator('#choose0').click();await page.locator('input[name=choice1][value=investigate]').check();await page.locator('#choose1').click();
  await page.locator('#message').fill('Je peux maintenant retrouver l’annulation.');await page.locator('#send').click();
  await page.locator('#control').click();await page.locator('#resolve').click();
  const result=(await read()).result;assert.equal(result.stopped,true);assert.equal(result.planResults[0].ok,true);assert.match(result.facts[0].text,/ma sœur/);
  await page.reload();assert.ok((await read()).result);assert.match(await page.locator('#app').innerText(),/La machine sait que vous êtes là/);
  await page.screenshot({path:'/tmp/signal-freedom.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);console.log('PASS: révélation, fait personnel, plan accepté, annulation de purge, transmissions, sauvegarde et largeur mobile.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
