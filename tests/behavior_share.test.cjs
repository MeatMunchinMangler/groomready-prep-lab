const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const privateUrl = 'https://example.org/groomready/?private=test#card=%7B%22shop%22%3A%22Happy%20Tails%22%2C%22pet%22%3A%22Mochi%22%2C%22date%22%3A%222026-11-14T10%3A00%22%2C%22location%22%3A%22123%20Main%22%7D';

function startBrowser(overrides = {}) {
  const ids = ['shop','pet','date','location','notes','make','sample','card','result','status','copy','link','sharetool','sharestatus'];
  const els = {};
  for (const id of ids) els[id] = {
    value: '', textContent: '', hidden: true, events: {},
    addEventListener(name, handler) { this.events[name] = handler; }
  };
  const document = { getElementById(id) { assert.ok(els[id], 'missing node '+id); return els[id]; } };
  const location = { href: privateUrl, hash: privateUrl.slice(privateUrl.indexOf('#')) };
  const writes = [];
  const shares = [];
  const navigator = overrides.navigator || {
    clipboard: { async writeText(value) { writes.push(value); } }
  };
  const window = { document, location, navigator };
  vm.runInNewContext(script, { window, document, location, navigator, URL, Date, module: { exports: {} } }, {timeout:1000});
  return { els, writes, shares, navigator, location };
}

test('clicking Share this tool copies only the clean homepage', async () => {
  const b = startBrowser();
  assert.ok(b.els.sharetool.events.click);
  await b.els.sharetool.events.click();
  assert.equal(b.writes.length, 1);
  assert.match(b.writes[0], /https:\/\/example\.org\/groomready\/$/);
  assert.doesNotMatch(b.writes[0], /Mochi|123%20Main|card=|private=test/);
  assert.match(b.els.sharestatus.textContent, /No card details included/);
});

test('native share sends only the clean URL and a product description', async () => {
  const shares = [];
  const b = startBrowser({ navigator: { async share(payload) { shares.push(payload); } } });
  await b.els.sharetool.events.click();
  assert.equal(shares.length, 1);
  assert.equal(shares[0].url, 'https://example.org/groomready/');
  assert.equal(shares[0].title, 'GroomReady');
  assert.ok(!JSON.stringify(shares[0]).includes('Mochi'));
});

test('canceling native share does not claim success or send data elsewhere', async () => {
  const b = startBrowser({ navigator: { async share() { const err = new Error('Canceled'); err.name = 'AbortError'; throw err; } } });
  await b.els.sharetool.events.click();
  assert.equal(b.els.sharestatus.textContent, 'Share canceled.');
});

test('no-share-API device shows a safe URL instead of an appointment card', async () => {
  const b = startBrowser({ navigator: {} });
  await b.els.sharetool.events.click();
  assert.match(b.els.sharestatus.textContent, /https:\/\/example\.org\/groomready\/$/);
  assert.doesNotMatch(b.els.sharestatus.textContent, /Mochi|card=/);
});
