const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {cleanLandingUrl, createCard, encode, decode} = require('../app.js');

test('sharing the app never includes private appointment details', () => {
  const raw = 'https://example.org/groomready/?campaign=test#card=%7B%22pet%22%3A%22Mochi%22%2C%22location%22%3A%22123%20Main%20St%22%7D';
  assert.equal(cleanLandingUrl(raw), 'https://example.org/groomready/');
  assert.equal(cleanLandingUrl('https://example.org/index.html#card=secret'), 'https://example.org/index.html');
  assert.equal(cleanLandingUrl('http://localhost:8080/?a=1#card=secret'), 'http://localhost:8080/');
  assert.throws(() => cleanLandingUrl('javascript:alert(1)'), /Only web URLs/);
});

test('card-specific link still decodes correctly without a network request', () => {
  const card = {shop:'Happy Tails',pet:'Mochi',date:'2026-11-14T10:00',location:'123 Main St',notes:'Bring a leash'};
  const token = encode(card);
  assert.deepEqual(decode('#card='+token), card);
  assert.match(createCard(card), /Happy Tails/);
});

test('public feedback is opt-in and points to the known playtest', () => {
  const html = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  assert.match(html, /id="sharetool"/);
  assert.match(html, /id="sharestatus" role="status"/);
  assert.match(html, /href="https:\/\/moonshot-launch-deck-20261111\.vercel\.app\/playtest\.html\?app=groomready"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /github\.com\/MeatMunchinMangler\/groomready-prep-lab\/issues\/new\?title=GroomReady%20playtest%20feedback/);
  assert.match(html, /submitted issues are public/i);
  assert.match(html, /No feedback is sent unless you submit it there/i);
  assert.match(html, /nothing is submitted automatically/i);
  assert.doesNotMatch(html, /<script[^>]+(?:analytics|gtag|pixel|segment)/i);
});
