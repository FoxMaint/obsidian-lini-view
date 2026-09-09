import esbuild from "esbuild";
import process from "process";

const production = process.argv[2] === "production";

const context = await esbuild.context({
  banner: { js: "/* Lini Diagrams plugin — bundled build, do not edit */" },
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian", "electron"],
  format: "cjs",
  target: "es2020",
  platform: "browser",
  // Pulls the .wasm file in as raw bytes (Uint8Array) at bundle time,
  // so main.js is fully self-contained — no separate .wasm to ship.
  loader: { ".wasm": "binary" },
  logLevel: "info",
  sourcemap: production ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  minify: production,
});

if (production) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
  console.log("Watching for changes...");
}
