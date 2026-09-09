import { App, MarkdownRenderChild, Modal, Notice, setIcon } from "obsidian";
import panzoom, { PanZoom } from "panzoom";

export class LiniBlock extends MarkdownRenderChild {
  private pz: PanZoom | null = null;

  setPanzoom(pz: PanZoom) {
    this.pz = pz;
  }

  onunload() {
    this.pz?.dispose();
  }
}

export function renderLiniView(
  app: App,
  container: HTMLElement,
  svgMarkup: string,
  block: LiniBlock
) {
  const { pz } = buildDiagramFrame(container, svgMarkup, "inline", () =>
    new LiniFullscreenModal(app, svgMarkup).open()
  );
  block.setPanzoom(pz);
}

function buildDiagramFrame(
  parent: HTMLElement,
  svgMarkup: string,
  variant: "inline" | "fullscreen",
  onExpand?: () => void
): { pz: PanZoom } {
  const frame = parent.createDiv({ cls: `lini-frame lini-frame-${variant}` });
  const stage = frame.createDiv({
    cls: variant === "fullscreen" ? "lini-stage lini-stage-fullscreen" : "lini-stage",
  });
  stage.innerHTML = svgMarkup;

  const svgEl = stage.querySelector("svg") || stage;
  const pz = attachPanzoom(svgEl as HTMLElement);

  const controls = frame.createDiv({ cls: `lini-controls lini-controls-${variant}` });

  const resetBtn = controls.createEl("button", {
    cls: "lini-btn",
    attr: { type: "button", "aria-label": "Reset zoom" },
  });
  setIcon(resetBtn, "rotate-ccw");

  resetBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    try {
      pz.moveTo(0, 0);
      pz.zoomAbs(0, 0, 1);
    } catch (err) {
      new Notice(`Lini: reset failed — ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  if (onExpand) {
    const expandBtn = controls.createEl("button", {
      cls: "lini-btn",
      attr: { type: "button", "aria-label": "Fullscreen" },
    });
    setIcon(expandBtn, "maximize");

    expandBtn.addEventListener("click", (evt) => {
      evt.preventDefault();
      try {
        onExpand();
      } catch (err) {
        new Notice(`Lini: fullscreen failed — ${err instanceof Error ? err.message : String(err)}`);
      }
    });
  }

  return { pz };
}

function attachPanzoom(target: HTMLElement): PanZoom {
  return panzoom(target, {
    maxZoom: 8,
    minZoom: 0.2,
    bounds: true,
    boundsPadding: 0.1,
    zoomDoubleClickSpeed: 1,
    filterKey: () => true,
    onTouch: (e: TouchEvent) => {
      const targetEl = e.target as HTMLElement;
      if (targetEl && targetEl.closest(".lini-controls")) {
        return false;
      }
      return true;
    },
  });
}

class LiniFullscreenModal extends Modal {
  private pz: PanZoom | null = null;

  constructor(app: App, private svgMarkup: string) {
    super(app);
  }

  onOpen() {
    this.modalEl.addClass("lini-fullscreen-modal");
    const { pz } = buildDiagramFrame(this.contentEl, this.svgMarkup, "fullscreen");
    this.pz = pz;
  }

  onClose() {
    this.pz?.dispose();
    this.contentEl.empty();
  }
}
