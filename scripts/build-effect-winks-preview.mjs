import fs from "node:fs/promises";
import path from "node:path";

import { WINKS_ROOT, escapeHtml, formatBytes } from "./wink-config.mjs";
import { writeWinksManifest } from "./wink-manifest.mjs";

const previewPath = path.join(WINKS_ROOT, "preview.html");

function renderAssetBlock(kind, item, format) {
  const asset = format === "svg" ? item.svg : item.apng;
  const label = format === "svg" ? "SVG Animation" : "APNG Fallback";
  const badge = format === "svg" ? "Primary" : "Fallback";
  const aspectRatio = `${item.width} / ${item.height}`;
  const filePath =
    format === "svg"
      ? `${kind}/svg/${encodeURIComponent(item.svg?.fileName ?? "")}`
      : `${kind}/apng/${encodeURIComponent(item.apng?.fileName ?? "")}`;
  const downloadLabel = format === "svg" ? "Download SVG" : "Download APNG";

  if (!asset) {
    return `
      <section class="format-card is-missing">
        <div class="format-head">
          <div>
            <div class="eyebrow">${badge}</div>
            <h3>${label}</h3>
          </div>
          <span class="size">Pending export</span>
        </div>
        <div class="preview-frame" style="aspect-ratio: ${aspectRatio};">
          <div class="placeholder">No ${label} file available yet.</div>
        </div>
      </section>`;
  }

  return `
    <section class="format-card">
      <div class="format-head">
        <div>
          <div class="eyebrow">${badge}</div>
          <h3>${label}</h3>
        </div>
        <span class="size">${asset.sizeLabel ?? "Unknown size"}</span>
      </div>
      <div class="preview-frame" style="aspect-ratio: ${aspectRatio};" aria-label="${escapeHtml(
        item.name
      )} ${label} preview">
        <img src="${filePath}" alt="${escapeHtml(item.name)} ${label}" loading="lazy" decoding="async" />
      </div>
      <div class="format-meta">
        <span>${escapeHtml(asset.fileName)}</span>
        <a href="${filePath}" download="${escapeHtml(asset.fileName)}">${downloadLabel}</a>
      </div>
    </section>`;
}

function renderGroup(group) {
  const cards =
    group.items.length === 0
      ? `<div class="empty-state">No ${escapeHtml(group.label)} SVG files were found yet.</div>`
      : group.items
          .map(
            (item) => `
              <article class="wink-card">
                <header class="wink-card-head">
                  <div>
                    <p class="wink-kind">${escapeHtml(group.label)}</p>
                    <h2>${escapeHtml(item.name)}</h2>
                  </div>
                  <div class="wink-meta">
                    <span>${escapeHtml(item.aspectRatio)}</span>
                    <span>${item.durationMs ? `${item.durationMs} ms` : "Duration n/a"}</span>
                  </div>
                </header>
                <div class="formats-grid">
                  ${renderAssetBlock(group.kind, item, "svg")}
                  ${renderAssetBlock(group.kind, item, "apng")}
                </div>
              </article>`
          )
          .join("\n");

  return `
    <section class="group-section">
      <div class="group-head">
        <div>
          <p class="eyebrow">${escapeHtml(group.label)}</p>
          <h2>${escapeHtml(group.width)} x ${escapeHtml(group.height)} (${escapeHtml(
            group.safeAreaGuidance
          )})</h2>
        </div>
      </div>
      <div class="group-grid">
        ${cards}
      </div>
    </section>`;
}

function renderHtml(manifest) {
  const totalAssets = Object.values(manifest.groups).reduce(
    (sum, group) => sum + group.items.length,
    0
  );
  const totalSvgBytes = Object.values(manifest.groups)
    .flatMap((group) => group.items)
    .reduce((sum, item) => sum + (item.svg?.bytes ?? 0), 0);
  const totalApngBytes = Object.values(manifest.groups)
    .flatMap((group) => group.items)
    .reduce((sum, item) => sum + (item.apng?.bytes ?? 0), 0);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gabriel Winks Preview</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0d1016;
      --panel: #151a23;
      --panel-2: #0f141d;
      --border: #2c3442;
      --text: #f4f2ea;
      --muted: #aeb8c9;
      --accent: #f5c044;
      --safe: #6ad3ff;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(circle at top, rgba(245, 192, 68, 0.16), transparent 28%), var(--bg);
      color: var(--text);
      font: 14px/1.5 "Segoe UI", system-ui, sans-serif;
    }

    header {
      position: sticky;
      top: 0;
      z-index: 2;
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(14px);
      background: rgba(13, 16, 22, 0.92);
    }

    .wrap {
      width: min(1520px, calc(100vw - 32px));
      margin: 0 auto;
    }

    .header-inner {
      display: grid;
      gap: 14px;
      padding: 20px 0;
    }

    h1, h2, h3, p { margin: 0; }
    h1 {
      font-size: clamp(26px, 3vw, 38px);
      line-height: 1.05;
    }

    main {
      padding: 24px 0 48px;
    }

    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill {
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--panel);
      padding: 6px 10px;
      color: var(--muted);
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    button {
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--panel);
      color: var(--text);
      cursor: pointer;
      font: inherit;
      padding: 7px 10px;
    }

    button[aria-pressed="true"] {
      border-color: var(--accent);
      color: var(--accent);
    }

    .group-section + .group-section {
      margin-top: 28px;
    }

    .group-head {
      margin-bottom: 12px;
    }

    .group-grid {
      display: grid;
      gap: 16px;
    }

    .wink-card {
      border: 1px solid var(--border);
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(21, 26, 35, 0.96), rgba(15, 20, 29, 0.96));
      overflow: hidden;
    }

    .wink-card-head {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: start;
      padding: 14px 16px 0;
    }

    .wink-kind, .eyebrow {
      color: var(--accent);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .wink-meta {
      display: grid;
      gap: 4px;
      color: var(--muted);
      text-align: right;
      white-space: nowrap;
    }

    .formats-grid {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      padding: 14px 16px 16px;
    }

    .format-card {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      background: rgba(255,255,255,0.03);
      padding: 12px;
    }

    .format-card.is-missing {
      opacity: 0.78;
    }

    .format-head, .format-meta {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }

    .format-meta {
      margin-top: 10px;
      color: var(--muted);
      font-size: 12px;
      overflow-wrap: anywhere;
    }

    .format-meta a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }

    .size {
      color: var(--muted);
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 12px;
      white-space: nowrap;
    }

    .preview-frame {
      position: relative;
      margin-top: 10px;
      aspect-ratio: 16 / 9;
      border-radius: 12px;
      overflow: hidden;
      background-color: #171d27;
    }

    body[data-bg="checker"] .preview-frame {
      background-image:
        linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255,255,255,0.15) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.15) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.15) 75%);
      background-size: 22px 22px;
      background-position: 0 0, 0 11px, 11px -11px, -11px 0;
    }

    body[data-bg="black"] .preview-frame { background: #000; }
    body[data-bg="white"] .preview-frame { background: #fff; }

    .preview-frame::after {
      content: "";
      position: absolute;
      inset: 10%;
      border: 1px dashed rgba(106, 211, 255, 0.65);
      pointer-events: none;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .placeholder, .empty-state {
      display: grid;
      place-items: center;
      min-height: 100%;
      color: var(--muted);
      text-align: center;
      padding: 20px;
    }

    .empty-state {
      min-height: 140px;
      border: 1px dashed var(--border);
      border-radius: 16px;
      background: rgba(255,255,255,0.03);
    }
  </style>
</head>
<body data-bg="checker">
  <header>
    <div class="wrap header-inner">
      <div>
        <h1>Gabriel Winks Preview</h1>
        <p>SVG Animation remains the primary format. APNG is the transparent raster fallback.</p>
      </div>
      <div class="summary">
        <span class="pill">${totalAssets} wink entries</span>
        <span class="pill">${formatBytes(totalSvgBytes) ?? "0 B"} SVG total</span>
        <span class="pill">${formatBytes(totalApngBytes) ?? "0 B"} APNG total</span>
        <span class="pill">${manifest.recommendations.recommendedApngFps} FPS APNG target</span>
        <span class="pill">Optimized for size &middot; Transparent background &middot; Infinite loop</span>
      </div>
      <div class="controls" aria-label="Preview background">
        <button type="button" data-bg-choice="checker" aria-pressed="true">Checkerboard</button>
        <button type="button" data-bg-choice="black" aria-pressed="false">Black</button>
        <button type="button" data-bg-choice="white" aria-pressed="false">White</button>
      </div>
    </div>
  </header>
  <main class="wrap">
    ${Object.values(manifest.groups).map((group) => renderGroup(group)).join("\n")}
  </main>
  <script>
    const buttons = Array.from(document.querySelectorAll("[data-bg-choice]"));
    for (const button of buttons) {
      button.addEventListener("click", () => {
        document.body.dataset.bg = button.dataset.bgChoice;
        for (const next of buttons) {
          next.setAttribute("aria-pressed", String(next === button));
        }
      });
    }
  </script>
</body>
</html>`;
}

async function main() {
  await fs.mkdir(WINKS_ROOT, { recursive: true });
  const manifest = await writeWinksManifest();
  await fs.writeFile(previewPath, renderHtml(manifest), "utf8");
  console.log(`Wrote ${previewPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
