// dev-server.mjs — zero-dependency static server with live reload.
// Run:  node dev-server.mjs   →   open http://localhost:5173
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Script injected into every HTML page: listens for reload events via SSE.
const LIVE_RELOAD = `
<script>
(function(){
  const es = new EventSource("/__livereload");
  es.onmessage = () => location.reload();
  es.onerror = () => { es.close(); setTimeout(() => location.reload(), 1000); };
})();
</script>`;

const clients = new Set();

function broadcastReload() {
  for (const res of clients) res.write("data: reload\n\n");
}

// Debounced file watcher (recursive works on Windows + macOS).
// Ignore VCS/deps/tooling dirs so git activity doesn't trigger reload storms.
const IGNORE = /(^|[\\/])(\.git|node_modules|\.claude)([\\/]|$)/;
let timer = null;
fs.watch(ROOT, { recursive: true }, (_evt, file) => {
  if (file && file.startsWith("dev-server")) return; // ignore self
  if (file && IGNORE.test(file)) return;             // ignore .git / deps / tooling
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log("  ↻ changed:", file, "→ reloading browser");
    broadcastReload();
  }, 80);
});

const server = http.createServer((req, res) => {
  // Live-reload event stream
  if (req.url === "/__livereload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("retry: 1000\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(ROOT, urlPath);

  // Prevent path traversal outside ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1 style='font-family:sans-serif'>404 — " + urlPath + "</h1>");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    if (ext === ".html") {
      const html = data.toString("utf-8").replace("</body>", LIVE_RELOAD + "\n</body>");
      res.writeHead(200, { "Content-Type": type });
      res.end(html);
    } else {
      res.writeHead(200, { "Content-Type": type });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log("\n  N1GHT CHXN9 dev server running");
  console.log("  → http://localhost:" + PORT + "\n");
  console.log("  Live reload is ON. Leave this running; edits refresh automatically.\n");
});
