const SITE = "https://isrssalive.com/";

const feed = (day) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Is RSS Alive?</title>
<link>${SITE}</link>
<description>A daily answer to the only question that matters.</description>
<atom:link href="${SITE}" rel="self" type="application/rss+xml"/>
<item>
<title>Yes. RSS is alive.</title>
<link>${SITE}</link>
<guid isPermaLink="false">${day}</guid>
<pubDate>${new Date(day + "T00:00:00Z").toUTCString()}</pubDate>
<description>Yes. You're reading this in a feed reader, so you already knew.</description>
</item>
</channel></rss>`;

const page = (day) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Is RSS Alive?</title>
<link rel="alternate" type="application/rss+xml" title="Is RSS Alive?" href="${SITE}">
<style>
body{margin:0;min-height:100vh;display:flex;flex-direction:column;padding:28px clamp(20px,5vw,64px);box-sizing:border-box;background:#0E1A13;color:#E9F5EE;font-family:system-ui,sans-serif}
header{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;font-weight:700}
header a{display:inline-flex;align-items:center;min-height:44px;padding:0 20px;border:1px solid #3DDC84;border-radius:999px;color:#3DDC84;text-decoration:none;font-weight:500}
main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:28px;padding:48px 0}
.dot{position:relative;width:96px;height:96px;border-radius:50%;background:#3DDC84;animation:beat 1.2s ease-in-out infinite}
.dot::after{content:"";position:absolute;inset:0;border-radius:50%;background:#3DDC84;animation:ring 1.2s ease-out infinite}
@keyframes beat{50%{transform:scale(1.15)}}
@keyframes ring{from{opacity:.55}to{transform:scale(2.3);opacity:0}}
@media(prefers-reduced-motion:reduce){.dot,.dot::after{animation:none}}
h1{margin:0;font-size:clamp(56px,12vw,160px);line-height:.95;letter-spacing:-.04em}
p{margin:0;font-size:clamp(20px,3vw,32px);color:#9DB8A8}
.pill{padding:10px 18px;border-radius:999px;background:#17291F;font:15px ui-monospace,monospace;color:#C9E6D4}
footer{display:flex;flex-wrap:wrap;gap:12px 24px;justify-content:center;align-items:center;padding-top:24px;border-top:1px solid #22382B;color:#9DB8A8;font-size:15px}
code{padding:6px 12px;border-radius:8px;background:#17291F;color:#E9F5EE}
</style></head><body>
<header><span>isrssalive.com</span><a href="#feed">Subscribe</a></header>
<main><div class="dot"></div><h1>Yes.</h1><p>RSS is alive. Probably more than you.</p>
<div class="pill">Last pulse: today, ${day}</div></main>
<footer id="feed"><span>This page is also the feed. Paste the address into your reader:</span><code>${SITE}</code></footer>
</body></html>`;

// Browsers get the page; feed readers (and anything naming rss/atom, or not asking for html) get XML.
export const wantsHtml = (accept) => /text\/html/.test(accept) && !/rss|atom/.test(accept);

export default {
  fetch(req) {
    const day = new Date().toISOString().slice(0, 10);
    const { pathname } = new URL(req.url);
    const html = pathname === "/" && wantsHtml(req.headers.get("accept") || "");
    return new Response(html ? page(day) : feed(day), {
      headers: {
        "content-type": html ? "text/html; charset=utf-8" : "application/rss+xml; charset=utf-8",
        "cache-control": "public, max-age=300",
        vary: "Accept",
      },
    });
  },
};
