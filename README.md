# Lini Diagrams for Obsidian

Renders [Lini](https://lini.rs) (```lini code blocks) as interactive,
pan/zoom SVG diagrams inside Obsidian — desktop and mobile.

Built on the official [`lini-wasm`](https://www.npmjs.com/package/lini-wasm)
compiler by [monfa-red](https://github.com/monfa-red/lini).

## Status

This plugin covers the basics: render, pan/zoom (mouse + touch), fullscreen
view, error reporting. It tracks Lini's own compiler — new Lini language
features arrive automatically on `lini-wasm` version bumps, without plugin
changes. New Obsidian-side features are welcome as community contributions,
but aren't planned by the maintainer.

## Install

Manual install until this lands in Community Plugins:
1. Download `main.js`, `manifest.json`, `styles.css` from the latest release.
2. Copy them into `<vault>/.obsidian/plugins/lini-view/`.
3. Enable "Lini Diagrams" in Settings → Community plugins.

## Usage

````
```lini
    ...your Lini source...
```
````

## Preview

![Lini Diagrams demo](docs/preview.gif)

## License

MIT
