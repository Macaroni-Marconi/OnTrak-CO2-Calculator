# Rail Carbon — install on your phone

This folder is a complete Progressive Web App. No accounts, no servers, no data collection — everything runs on your device and works offline after the first load.

## Deploy (pick one, ~5 minutes)

**Easiest — Netlify Drop:**
1. Go to https://app.netlify.com/drop (free account).
2. Drag this whole folder onto the page.
3. Netlify gives you a URL like `https://something.netlify.app`. Optional: set a password under Site settings → Access control if you want it private.

**Or GitHub Pages:**
1. Create a repository, upload these files to its root.
2. Settings → Pages → deploy from branch `main`, folder `/ (root)`.
3. Your URL: `https://<username>.github.io/<repo>/`.

## Add to your home screen
- **iPhone (Safari):** open the URL → Share button → "Add to Home Screen."
- **Android (Chrome):** open the URL → you'll be prompted to install, or use menu ⋮ → "Add to Home screen."

The icon launches full-screen like a native app and works with no signal (perfect on the Empire Builder through Montana).

## Updating the data later
Emission factors, load factors, routes, and stations live in `amtrak-carbon.jsx` (the readable source, included alongside this folder). To rebuild after editing:
```
npm install react react-dom esbuild
npx esbuild entry.jsx --bundle --minify --format=iife --outfile=bundle.js
```
…then re-inline the bundle into index.html (or just ask Claude to regenerate the folder). After deploying an update, bump the CACHE version string in `sw.js` (e.g. `rail-carbon-v2`) so phones fetch the new version.
