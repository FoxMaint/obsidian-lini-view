// @ts-ignore — resolved by esbuild's binary loader as raw bytes (Uint8Array)
import wasmBinary from "lini-wasm/lini_wasm_bg.wasm";
import init, { compile as compileLini } from "lini-wasm/web";

let ready: Promise<void> | null = null;

export function ensureLiniReady(): Promise<void> {
  if (!ready) {
    ready = init(wasmBinary).then(() => undefined);
  }
  return ready;
}

export function compile(source: string): string {
  return compileLini(source, {});
}
