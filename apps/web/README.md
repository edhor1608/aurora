# Aurora Web App

Sprint 1 foundation web starter for Aurora, based on Vite + React + TanStack Router dependencies.

## Getting Started

```bash
bun install
bun --bun run dev
```

## Build

```bash
bun --bun run build
```

## Test

```bash
bun --bun run test
```

## Styling

This app uses Tailwind CSS via Vite plugin.

If you want to remove Tailwind support:
1. Remove the Tailwind import from `src/styles.css`.
2. Remove `tailwindcss()` from `vite.config.ts`.
3. Uninstall packages with `bun remove @tailwindcss/vite tailwindcss`.
