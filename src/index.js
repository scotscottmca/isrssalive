const SITE = "https://isrssalive.com/";

export const CHECKS = [
  "The feed has no engagement metrics. It seems fine with that.",
  "A newsletter needs your email address. The feed gets by on a URL.",
  "Somewhere a podcast app refreshed a feed. Nobody clapped.",
  "No cookie banner was required to bring you this result.",
  "The obituary writers have been notified. Again.",
  "This entry is in chronological order. No algorithm was consulted.",
  "A feed was polled. It answered. That is the whole story.",
  "The on-call engineer slept through the night. There is no on-call engineer.",
  "Someone unsubscribed. No one sent a survey asking why.",
  "No outage to report. The incident template remains unused.",
  "A blog with no redesign in years published a post. It arrived.",
  "Asked for a second opinion. It was also yes.",
  "The angle brackets are holding.",
  "The check took four milliseconds. Most of that was formality.",
  "Trends came and went. The posts arrived in the order they were written.",
  "The spec is one day older than at the last check. It wears it well.",
  "An unread count went up somewhere. This is the system working.",
  "Someone read three posts over coffee and closed the app. Session complete.",
  "Push notifications sent so far: zero. The streak continues.",
  "Uneventful. Those are the good ones.",
];

// The one source for page and feed: the last 7 UTC days, newest first.
// The line is picked by UTC day number, so a given date always gets the same line.
export const daily = (now = Date.now()) => Array.from({ length: 7 }, (_, i) => {
  const n = Math.floor(now / 864e5) - i;
  return { date: new Date(n * 864e5), text: CHECKS[n % CHECKS.length] };
});

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const feed = (now) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Is RSS Alive?</title>
<link>${SITE}</link>
<description>A daily answer to the only question that matters.</description>
<atom:link href="${SITE}" rel="self" type="application/rss+xml"/>
${daily(now).map(({ date, text }) => `<item>
<title>Yes. RSS is alive.</title>
<link>${SITE}</link>
<guid isPermaLink="false">${date.toISOString().slice(0, 10)}</guid>
<pubDate>${date.toUTCString()}</pubDate>
<description>Yes. ${esc(text)}</description>
</item>`).join("\n")}
</channel></rss>`;

const checks = (now) => daily(now).map(({ date, text }) => {
  const shown = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return `<li><time datetime="${date.toISOString().slice(0, 10)}">${shown}</time><p><strong>Yes.</strong> ${esc(text)}</p></li>`;
}).join("\n");

export const page = (now) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Is RSS Alive? Status page</title>
<link rel="alternate" type="application/rss+xml" title="Is RSS Alive?" href="${SITE}">
<style>
body{margin:0;min-height:100vh;box-sizing:border-box;background:#F3F5F2;color:#16201B;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:1rem;line-height:1.5;padding:32px 20px 56px;overflow-wrap:break-word}
a{color:#B34700;font-weight:600}a:hover{color:#7A3000}
a:focus-visible,button:focus-visible{outline:3px solid #B34700;outline-offset:3px}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(255,255,255,.7)}70%,100%{box-shadow:0 0 0 12px rgba(255,255,255,0)}}
.dot{flex:none;width:12px;height:12px;border-radius:50%;background:#FFF;animation:pulse 2s ease-out infinite}
@media (prefers-reduced-motion:reduce){.dot{animation:none}}
main{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:48px}
header{display:flex;flex-direction:column;gap:20px}
h1{margin:0;font-size:1.5rem;font-weight:500}
h2{margin:0 0 16px;font-size:1.25rem;font-weight:600;letter-spacing:-.01em}
p{margin:0}
.yes{font-weight:700;font-size:clamp(7rem,34vw,15rem);line-height:.8;letter-spacing:-.05em;color:#1B6E45}
.status{margin-top:8px;display:flex;align-items:center;gap:14px;padding:16px 20px;border-radius:6px;background:#1B6E45;color:#FFF;font-weight:600;font-size:1.125rem}
.row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:4px 16px}
.row h2{margin:0}
.pct{font-size:1.25rem;font-weight:700;color:#1B6E45}
.bars{height:40px;margin-top:12px;background:repeating-linear-gradient(90deg,#2E9E66 0,#2E9E66 4px,transparent 4px,transparent 6px)}
.small,footer{color:#55605A;font-size:.875rem}
.small{margin-top:8px}p.small{margin-top:12px}
ul,ol{list-style:none;margin:0;padding:0;border-bottom:1px solid #D3DAD5}
li{padding:14px 0;border-top:1px solid #D3DAD5}
li.row span:first-child{font-weight:500}
.ok,.muted{font-weight:600}
.ok,strong{color:#1B6E45}
.muted,time{color:#55605A}
.note{margin-bottom:16px;padding:14px 16px;border:1px solid #B34700;border-radius:6px;background:#FFF}
.copy{margin-top:10px}
code{display:block;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;user-select:all}
button{display:block;box-sizing:border-box;width:15em;max-width:100%;margin-top:10px;white-space:nowrap;min-height:44px;padding:0 16px;border:0;border-radius:6px;background:#B34700;color:#FFF;font:inherit;font-weight:600;cursor:pointer}
button:hover{background:#7A3000}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.checks li{display:flex;flex-wrap:wrap;gap:2px 20px}
time{flex:0 0 7.5rem;font-variant-numeric:tabular-nums}
.checks p{flex:1 1 220px;min-width:0}
.incidents li{padding:16px 0}
.year{font-weight:600;font-size:1.125rem}
.incidents p{margin-top:6px;max-width:60ch}
footer p+p{margin-top:4px}
</style></head><body><main>
<header>
<h1>Is RSS Alive?</h1>
<p class="yes">Yes.</p>
<p class="status"><span class="dot" aria-hidden="true"></span>All systems operational. As usual.</p>
</header>
<section aria-labelledby="uptime">
<div class="row"><h2 id="uptime">Uptime since 1999</h2><span class="pct">100%</span></div>
<div class="bars" role="img" aria-label="Uptime bars. Every bar is green."></div>
<div class="row small"><span>A while ago</span><span>Today</span></div>
<p class="small">Bars not to scale. Every bar is green. We stopped looking for a red one.</p>
</section>
<section aria-labelledby="components">
<h2 id="components">Components</h2>
<ul role="list">
<li class="row"><span>Feeds</span><span class="ok">Operational</span></li>
<li class="row"><span>Podcasts</span><span class="ok">Operational</span></li>
<li class="row"><span>Blogs</span><span class="ok">Operational, reportedly</span></li>
<li class="row"><span>Google Reader</span><span class="muted">Decommissioned</span></li>
<li class="row"><span>Articles declaring RSS dead</span><span class="muted">Recurring</span></li>
</ul>
</section>
<section aria-labelledby="checks">
<h2 id="checks">Daily checks</h2>
<div class="note"><p>This list is the feed. Subscribe by pasting this address into a feed reader. Same URL. It knows the difference.</p>
<p class="copy"><code>${SITE}</code><button type="button" onclick="(navigator.clipboard?navigator.clipboard.writeText('${SITE}'):Promise.reject()).then(()=>'Copied',()=>'Select the URL above').then(t=>{this.textContent=this.nextElementSibling.textContent=t})">Copy feed URL</button><span class="sr" role="status"></span></p></div>
<ol role="list" class="checks">
${checks(now)}
</ol>
</section>
<section aria-labelledby="incidents">
<h2 id="incidents">Incident history</h2>
<ol role="list" class="incidents">
<li><div class="row"><span class="year">1999</span><span class="muted">Service started</span></div>
<p>Netscape ships RSS 0.90. Monitoring begins. Nothing to report.</p></li>
<li><div class="row"><span class="year">2009</span><span class="muted">False positive</span></div>
<p>TechCrunch publishes "Rest in Peace, RSS". Investigated. The patient was fine.</p></li>
<li><div class="row"><span class="year">2013</span><span class="muted">No impact</span></div>
<p>Google Reader shuts down. Largest client lost. Impact on RSS: none.</p></li>
<li><div class="row"><span class="year">2018</span><span class="muted">No impact</span></div>
<p>Firefox removes Live Bookmarks. Digg Reader shuts down. One browser feature and one reader lost. Impact on RSS: none.</p></li>
<li><div class="row"><span class="year">Ongoing</span><span class="muted">Monitoring</span></div>
<p>Podcasts run on RSS. Millions of users remain unaware they depend on this service. No action required.</p></li>
</ol>
</section>
<footer>
<p>A daily answer to the only question that matters.</p>
<p>Next check: tomorrow. Expected result: Yes.</p>
</footer>
</main></body></html>`;

// Browsers get the page; feed readers (and anything naming rss/atom, or not asking for html) get XML.
export const wantsHtml = (accept) => /text\/html/.test(accept) && !/rss|atom/.test(accept);

export default {
  fetch(req) {
    const { pathname } = new URL(req.url);
    const html = pathname === "/" && wantsHtml(req.headers.get("accept") || "");
    return new Response(html ? page() : feed(), {
      headers: {
        "content-type": html ? "text/html; charset=utf-8" : "application/rss+xml; charset=utf-8",
        "cache-control": "public, max-age=300",
        vary: "Accept",
      },
    });
  },
};
