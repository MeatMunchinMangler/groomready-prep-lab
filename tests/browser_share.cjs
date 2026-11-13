'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');

const root = path.join(__dirname, '..');
const files = { '/': 'index.html', '/index.html':'index.html', '/app.js':'app.js' };
const server = http.createServer((req,res) => {
  const file = files[new URL(req.url, 'http://127.0.0.1').pathname];
  if (!file) {res.writeHead(404); return res.end();}
  res.writeHead(200, {'Content-Type': file.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8','Cache-Control':'no-store'});
  res.end(fs.readFileSync(path.join(root,file)));
});

async function run() {
  await new Promise(ok => server.listen(0,'127.0.0.1',ok));
  const base = 'http://127.0.0.1:'+server.address().port+'/';
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [320,390,768]) {
      const page = await browser.newPage({viewport:{width,height:840}});
      const errors=[];
      page.on('pageerror',error=>errors.push(String(error)));
      await page.goto(base,{waitUntil:'load'});
      await page.click('#sample');
      assert.equal(await page.locator('#result').isVisible(),true);
      assert.match(await page.locator('#card').innerText(),/Happy Tails Grooming/);
      const cardUrl=page.url();
      assert.match(cardUrl,/#card=/);
      await page.evaluate(() => {
        window.__shared = '';
        Object.defineProperty(navigator,'share',{value:undefined,configurable:true});
        Object.defineProperty(navigator,'clipboard',{
          value:{writeText:async text=>{window.__shared=text}},
          configurable:true
        });
      });
      await page.click('#sharetool');
      await page.waitForFunction(()=>!!window.__shared);
      const shared=await page.evaluate(()=>window.__shared);
      assert.match(shared,/http:\/\/127\.0\.0\.1:\d+\/$/);
      assert.doesNotMatch(shared,/#card=|Happy%20Tails|Mochi|private=/);
      assert.match(await page.locator('#sharestatus').innerText(),/Clean app link copied/);
      assert.match(await page.locator('#feedback').getAttribute('href'),/playtest\.html\?app=groomready/);
      assert.match(await page.locator('#feedback-return').getAttribute('href'),/groomready-prep-lab\/issues\/new/);
      assert.deepEqual(errors,[], 'JS errors at '+width+'px');
      await page.close();
      console.log('GroomReady live DOM interaction OK at '+width+'px');
    }
  } finally {
    await browser.close();
  }
}
run().then(()=>server.close()).catch(err=>{console.error(err);server.close();process.exitCode=1});
