import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WinkFormatPreviewPanel } from "@/components/WinkFormatPreviewPanel";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { WinkManifestItem } from "@/lib/winkManifest";

const wink = {
  aspectRatio: "16:9",
  durationMs: 3600,
  height: 1080,
  id: "fw-grand-finale",
  kind: "effect" as const,
  name: "Fireworks Grand Finale",
  width: 1920,
};

function renderPanel(props: Partial<React.ComponentProps<typeof WinkFormatPreviewPanel>> = {}) {
  return render(
    <TooltipProvider>
      <WinkFormatPreviewPanel
        bg="checker"
        svgPreview={<div>SVG Preview</div>}
        wink={wink}
        {...props}
      />
    </TooltipProvider>
  );
}

describe("WinkFormatPreviewPanel", () => {
  it("shows the pending APNG state with calculated frame counts", () => {
    renderPanel();

    expect(screen.getAllByText("Pending export").length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "Transparent raster fallback for clients that do not support SVG animation."
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText(/54 frames/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/3600 ms/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/\? frames/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download APNG" })).toBeDisabled();
  });

  it("shows the ready APNG state with file size and enabled download", () => {
    const asset: WinkManifestItem = {
      apng: {
        bytes: 420_000,
        fileName: "fw-grand-finale.apng",
        fps: 15,
        frameCount: 54,
        path: "/winks/effect/apng/fw-grand-finale.apng",
        sizeLabel: "420 KB",
        transparent: true,
      },
      aspectRatio: "16:9",
      category: "Fireworks",
      durationMs: 3600,
      edgeGuidance: null,
      height: 1080,
      id: "fw-grand-finale",
      kind: "effect",
      name: "Fireworks Grand Finale",
      safeArea: "centered",
      safeAreaGuidance: "Keep key action centered.",
      svg: {
        bytes: 12000,
        fileName: "fw-grand-finale.svg",
        path: "/winks/effect/svg/fw-grand-finale.svg",
        sizeLabel: "12 KB",
      },
      typeLabel: "Overlay / Full Screen",
      viewBox: "0 0 1920 1080",
      width: 1920,
    };

    renderPanel({ asset });

    expect(screen.getAllByText("Ready").length).toBeGreaterThan(0);
    expect(screen.getAllByText("420 KB").length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "This animation has been exported as a transparent, optimized APNG fallback."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("54 frames")).toBeInTheDocument();
    expect(screen.getByAltText("Fireworks Grand Finale APNG Fallback")).toHaveAttribute(
      "src",
      "/winks/effect/apng/fw-grand-finale.apng"
    );
    expect(screen.getByRole("link", { name: "Download APNG" })).toHaveAttribute(
      "href",
      "/winks/effect/apng/fw-grand-finale.apng"
    );
  });

  it("shows a clean message instead of a broken image when the APNG preview fails", () => {
    const asset: WinkManifestItem = {
      apng: {
        bytes: 420_000,
        fileName: "fw-grand-finale.apng",
        fps: 15,
        frameCount: 54,
        path: "/winks/effect/apng/fw-grand-finale.apng",
        sizeLabel: "420 KB",
        transparent: true,
      },
      aspectRatio: "16:9",
      category: "Fireworks",
      durationMs: 3600,
      edgeGuidance: null,
      height: 1080,
      id: "fw-grand-finale",
      kind: "effect",
      name: "Fireworks Grand Finale",
      safeArea: "centered",
      safeAreaGuidance: "Keep key action centered.",
      svg: {
        bytes: 12000,
        fileName: "fw-grand-finale.svg",
        path: "/winks/effect/svg/fw-grand-finale.svg",
        sizeLabel: "12 KB",
      },
      typeLabel: "Overlay / Full Screen",
      viewBox: "0 0 1920 1080",
      width: 1920,
    };

    renderPanel({ asset });

    fireEvent.error(screen.getByAltText("Fireworks Grand Finale APNG Fallback"));

    expect(screen.getAllByText("APNG preview failed to load").length).toBeGreaterThan(0);
    expect(screen.queryByAltText("Fireworks Grand Finale APNG Fallback")).not.toBeInTheDocument();
  });
});
