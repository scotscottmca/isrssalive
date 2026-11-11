import assert from "node:assert";
import worker, { CHECKS, daily, feed, page } from "./src/index.js";

const get = async (accept, path = "/") => {
  const r = await worker.fetch(new Request("https://isrssalive.com" + path, { headers: accept ? { accept } : {} }));
  return [r.headers.get("content-type"), r.headers.get("vary"), await r.text()];
};

const chrome = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8";
const reader = "application/rss+xml, application/xml, text/xml, text/html;q=0.5, */*;q=0.1";

assert.match((await get(chrome))[0], /text\/html/);
assert.match((await get(reader))[0], /rss\+xml/);
assert.match((await get("*/*"))[0], /rss\+xml/);
assert.match((await get(null))[0], /rss\+xml/);
assert.match((await get(chrome, "/feed.xml"))[0], /rss\+xml/);
assert.equal((await get(chrome))[1], "Accept");
assert.match((await get(null))[2], /<item>/);
assert.match((await get(chrome))[2], /All systems operational/);
assert.match((await get(chrome))[2], /<link rel="alternate" type="application\/rss\+xml" title="Is RSS Alive\?" href="https:\/\/isrssalive\.com\/">/);
assert.equal((await get(chrome))[2].match(/<time datetime="\d{4}-\d\d-\d\d">/g).length, 7);
assert.match((await get(reader))[2], /^<\?xml[^]*<rss version="2\.0"[^]*<\/rss>$/);

// Page and feed render the same 7 daily checks.
const unesc = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const all = (s, re) => [...s.matchAll(re)].map((m) => m.slice(1).map(unesc).join("|"));
const today = new Date().toISOString().slice(0, 10);
const fixed = Date.UTC(2026, 0, 15, 13);
for (const now of [undefined, fixed]) {
  const html = page(now), xml = feed(now), days = daily(now);
  const end = now === undefined ? today : "2026-01-15";
  const want = days.map((_, i) => new Date(Date.parse(end) - i * 864e5).toISOString().slice(0, 10));
  assert.deepEqual(days.map((d) => d.date.toISOString().slice(0, 10)), want);
  const pageRows = all(html, /<time datetime="([^"]+)">[^<]*<\/time><p><strong>Yes\.<\/strong> ([^<]*)<\/p>/g);
  assert.deepEqual(pageRows, days.map((d, i) => want[i] + "|" + d.text));
  assert.deepEqual(all(xml, /<guid isPermaLink="false">([^<]+)<\/guid>\n<pubDate>[^<]+<\/pubDate>\n<description>Yes\. ([^<]*)<\/description>/g), pageRows);
  assert.deepEqual(all(xml, /<pubDate>([^<]+)<\/pubDate>/g), want.map((d) => new Date(d).toUTCString()));
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.match(xml, /<rss version="2\.0"/);
  assert.equal(xml.match(/<item>/g).length, 7);
  assert.equal(new Set(all(xml, /<guid[^>]*>([^<]+)<\/guid>/g)).size, 7);
  assert.equal(new Set(days.map((d) => d.text)).size, 7);
}
// A date always gets the same line, whatever the time of day, and the next day gets another.
assert.equal(daily(fixed)[0].text, daily(fixed + 3600e3)[0].text);
assert.equal(daily(fixed)[0].text, daily(fixed + 864e5)[1].text);
assert.notEqual(daily(fixed)[0].text, daily(fixed + 864e5)[0].text);
assert.match(page(), /<button type="button"[^<]*>Copy feed URL<\/button>/);
assert.doesNotMatch(page() + feed(), /\u2014|undefined/);
for (const line of CHECKS) assert.doesNotMatch(line, /\b(today|yesterday|tomorrow|tonight)\b/i);
assert.equal(CHECKS.length, 20);
assert.equal(new Set(CHECKS).size, 20);
assert.doesNotMatch(page(), /fonts\.googleapis|gstatic/);
assert.match(page(), /Select the URL above/);
assert.equal(page().match(/role="status"/g).length, 1);
// Indexes 2 to 9 are the lines for days already published. They must not change.
assert.deepEqual(CHECKS.slice(2, 10), [
  "Somewhere a podcast app refreshed a feed. Nobody clapped.",
  "No cookie banner was required to bring you this result.",
  "The obituary writers have been notified. Again.",
  "This entry is in chronological order. No algorithm was consulted.",
  "A feed was polled. It answered. That is the whole story.",
  "The on-call engineer slept through the night. There is no on-call engineer.",
  "Someone unsubscribed. No one sent a survey asking why.",
  "No outage to report. The incident template remains unused.",
]);
for (const line of CHECKS) assert.ok(line.length < 90, line);
console.log("ok");
