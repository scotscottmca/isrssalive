import assert from "node:assert";
import worker from "./src/index.js";

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
console.log("ok");
