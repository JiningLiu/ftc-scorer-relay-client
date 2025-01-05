
# FTC Scorer Live Relay Client

_presented by_ **FTC Team 20240 Slingshot**

### This project is in early development. Please check back later for open source information and documentation.

© 2024-2025 FTC Team 20240 Slingshot & Contributors. [MIT License](LICENSE).

## Developing

```bash
bun i

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

> Note: Use `bun` for Svelte, and `npm` for Electron.

Make sure there's a `.env` file with required properties in `forge.config.js`. See [Electron Forge docs](https://www.electronforge.io/guides/code-signing/code-signing-macos#option-1-using-an-app-specific-password).

```bash
npm run make
```

This will build `.zip` binaries for macOS, Linux, and Windows. (arm64 and x64)

Your files will be in `electron/out`.
