import { Plugin } from "obsidian";
import { ensureLiniReady, compile } from "./wasm-loader";
import { renderLiniView, LiniBlock } from "./lini-view";

export default class LiniPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("lini", (source, el, ctx) => {
      const block = new LiniBlock(el);
      ctx.addChild(block);
      void this.renderBlock(source, el, block);
    });
  }

  private async renderBlock(source: string, el: HTMLElement, block: LiniBlock) {
    el.empty();
    const wrapper = el.createDiv({ cls: "lini-wrapper" });
    const loading = wrapper.createDiv({
      cls: "lini-loading",
      text: "Rendering diagram…",
    });

    try {
      await ensureLiniReady();
      const svg = compile(source);
      loading.remove();
      renderLiniView(this.app, wrapper, svg, block);
    } catch (err) {
      loading.remove();
      this.renderError(wrapper, err);
    }
  }

  private renderError(wrapper: HTMLElement, err: unknown) {
    const box = wrapper.createDiv({ cls: "lini-error" });
    box.createDiv({ cls: "lini-error-title", text: "Lini compile error" });
    const pre = box.createEl("pre", { cls: "lini-error-body" });
    pre.setText(err instanceof Error ? err.message : String(err));
  }
}
