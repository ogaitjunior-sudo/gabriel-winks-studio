# Gabriel Winks Studio

This project produces transparent animated overlay assets with SVG Animation as the primary production format and APNG as the raster fallback.

Lottie is optional. SVG Animation remains the primary production format.

## Gabriel Winks Standard

The Gabriel Winks standard follows these rules:

- Transparency is mandatory.
- SVG Animation remains the preferred main format.
- APNG is the transparent raster fallback.
- APNG exports preserve alpha transparency end to end.
- APNG targets roughly 15 FPS.
- Loops should be short when possible, ideally 2 to 4 seconds.
- APNG files loop infinitely.
- APNG output should be optimized for size.
- GIF should be avoided for production delivery.
- WebM should not be recommended for transparent overlay playback in this use case because browser support is still unreliable, especially in Safari.
- Lottie can be considered later as an optional vector format, but only when the target playback environment provides the required runtime support.

## Artboards

### Gabriel Winks Effects

- Artboard: 16:9
- Ideal master size: 1920 x 1080
- Safe area: keep key action inside a centered safe area

### Gabriel Winks Chat

- Artboard: 3:4 portrait
- Ideal master size: 768 x 1024
- Safe area: keep key action centered and avoid placing important elements too close to the top and bottom edges

## Folder Structure

```text
public/
  winks/
    effect/
      svg/
      apng/
      frames/
      metadata.json
    chat/
      svg/
      apng/
      frames/
    manifest.json
    preview.html
```

`public/winks/effect/svg` is generated from the React Gabriel Winks effect catalog. `public/winks/chat/svg` is ready for manually authored Gabriel Winks portrait chat SVG animations.

## Export Pipeline

The APNG export path uses:

- `puppeteer-core` plus a local Chromium browser to render transparent PNG frames from animated SVG
- `ffmpeg-static` to assemble those frames into looping APNG files
- `upng-js` for validation and transparency checks

The pipeline never bakes a white, black, or colored background into APNG output.

### Export primary SVG assets

```bash
npm run export:effect-winks
```

This writes transparent SVG Animation files and metadata to `public/winks/effect/svg` and `public/winks/effect/metadata.json`.

### Export APNG fallback assets

Export every available APNG:

```bash
npm run export:apng
```

Export only Gabriel Winks effect assets:

```bash
npm run export:apng:effect
```

Export only Gabriel Winks chat assets:

```bash
npm run export:apng:chat
```

The APNG export script:

- reads animated SVG files from `public/winks/effect/svg` and `public/winks/chat/svg`
- renders transparent PNG frames into the matching `frames` directory
- keeps alpha transparency in every rendered frame
- writes the final APNG to the matching `apng` directory
- keeps the same base filename as the source SVG
- reports missing source files and failed exports
- refreshes `public/winks/manifest.json` for the preview UI

## Cleaning Generated Files

Delete generated PNG frame sequences:

```bash
npm run clean:frames
```

Delete generated APNG files:

```bash
npm run clean:apng
```

## Validation

Run:

```bash
npm run validate:winks
```

Validation checks:

- every SVG has a matching APNG
- APNG files exist where expected
- APNG files preserve transparency
- APNG files loop infinitely
- file size labels are present in the manifest for SVG and APNG assets
- Gabriel Winks effect assets use the expected 16:9 artboard when dimensions are available
- Gabriel Winks chat assets use the expected 3:4 artboard when dimensions are available
- docs do not recommend GIF or WebM for this production overlay workflow

Validation also warns when durations drift outside the 2 to 4 second recommendation.

## Preview

The Vite app now shows:

- the live SVG Animation authoring preview
- the exported SVG Animation asset preview
- the exported APNG fallback preview
- download buttons for both SVG and APNG assets
- format labels and file sizes when available

You can also build the static export preview page:

```bash
npm run build:winks-preview
```

This writes `public/winks/preview.html`.

The preview data comes from `public/winks/manifest.json`.

## Why GIF Falls Short Here

GIF lacks full alpha transparency, handles color poorly, and usually creates larger, lower-quality overlay animation files.

## Why WebM Falls Short Here

Transparent WebM remains unreliable across browsers for this overlay scenario, with Safari being the main compatibility risk.

## Current Delivery Model

- Primary: standalone SVG Animation
- Fallback: transparent APNG
- Future optional vector path: Lottie, only when runtime playback support is guaranteed
