
# FTC Scorer Live Relay Client

_presented by_ **FTC Team 20240 Slingshot**

### This project is in early development. Please check back later for information.

© 2024-2025 FTC Team 20240 Slingshot & Contributors.
All Rights Reserved.

Open source information coming soon.

## Developing

Once you've created a project and installed dependencies with `bun install`, start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
cd electron
npm i
```

Make sure there's a `.env` file with required properties in `forge.config.js`. See [Electron Forge docs](https://www.electronforge.io/guides/code-signing/code-signing-macos#option-1-using-an-app-specific-password).

```bash
npm run make
```

> Note: Use `bun` for Svelte, and `npm` for Electron.

Your files will be in `electron/out`.