import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WinkLibrarySection } from "@/components/WinkLibrarySection";
import type { WinksManifest } from "@/lib/winkManifest";

const manifest: WinksManifest = {
  generatedAt: "2026-04-26T00:00:00.000Z",
  groups: {
    chat: {
      edgeGuidance: "Avoid edges.",
      height: 1024,
      items: [
        {
          apng: {
            bytes: 4567,
            fileName: "birthday-mega-party.apng",
            fps: 15,
            frameCount: 54,
            path: "/winks/chat/apng/birthday-mega-party.apng",
            sizeLabel: "4.5 KB",
            transparent: true,
          },
          aspectRatio: "3:4",
          category: "Happy Birthday",
          durationMs: 3600,
          edgeGuidance: "Avoid edges.",
          height: 1024,
          id: "birthday-mega-party",
          kind: "chat",
          name: "Birthday Mega Party",
          safeArea: "centered",
          safeAreaGuidance: "Keep key action centered.",
          svg: {
            bytes: 3210,
            fileName: "birthday-mega-party.svg",
            path: "/winks/chat/svg/birthday-mega-party.svg",
            sizeLabel: "3.1 KB",
          },
          typeLabel: "Portrait / Chat Overlay",
          viewBox: "0 0 768 1024",
          width: 768,
        },
      ],
      kind: "chat",
      label: "Gabriel Winks Chat",
      safeArea: "centered",
      safeAreaGuidance: "Keep key action centered.",
      width: 768,
    },
    effect: {
      edgeGuidance: null,
      height: 1080,
      items: [
        {
          apng: {
            bytes: 4567,
            fileName: "countdown-pop-bingo.apng",
            fps: 15,
            frameCount: 45,
            path: "/winks/effect/apng/countdown-pop-bingo.apng",
            sizeLabel: "4.5 KB",
            transparent: true,
          },
          aspectRatio: "16:9",
          category: "Countdown",
          durationMs: 3000,
          edgeGuidance: null,
          height: 1080,
          id: "countdown-pop-bingo",
          kind: "effect",
          name: "Countdown Pop Bingo",
          safeArea: "centered",
          safeAreaGuidance: "Keep key action centered.",
          svg: {
            bytes: 3210,
            fileName: "countdown-pop-bingo.svg",
            path: "/winks/effect/svg/countdown-pop-bingo.svg",
            sizeLabel: "3.1 KB",
          },
          typeLabel: "Overlay / Full Screen",
          viewBox: "0 0 1920 1080",
          width: 1920,
        },
      ],
      kind: "effect",
      label: "Gabriel Winks Effects",
      safeArea: "centered",
      safeAreaGuidance: "Keep key action centered.",
      width: 1920,
    },
  },
  recommendations: {
    cc213: true,
    fallbackFormat: "apng",
    loop: "infinite",
    primaryFormat: "svg-animation",
    recommendedApngFps: 15,
    recommendedDurationMs: {
      max: 4000,
      min: 2000,
    },
    transparencyRequired: true,
  },
  schemaVersion: 1,
  tooling: {
    encoder: "ffmpeg-static",
    fallbackFormat: "apng",
    optionalOptimizers: {
      oxipng: false,
      pngquant: false,
    },
    primaryFormat: "svg-animation",
    renderer: "puppeteer-core + system Chrome",
  },
};

describe("WinkLibrarySection", () => {
  it("renders card downloads and quick navigation", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    expect(screen.getAllByRole("button", { name: "All" })[0]).toHaveAttribute("type", "button");
    expect(screen.getByText("Browse by category:")).toBeInTheDocument();
    expect(screen.getByText("Filter by mood:")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "SVG" })[0]).toHaveAttribute(
      "href",
      "/winks/effect/svg/countdown-pop-bingo.svg"
    );
    expect(screen.getByText("Quick Jump")).toBeInTheDocument();
  });

  it("filters cards by search and category", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    fireEvent.click(screen.getByRole("button", { name: "Happy Birthday" }));
    expect(screen.getByText("Birthday Mega Party")).toBeInTheDocument();
    expect(screen.queryByText("Countdown Pop Bingo")).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "All" })[0]);
    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "countdown" },
    });

    expect(screen.getByText("Countdown Pop Bingo")).toBeInTheDocument();
    expect(screen.queryByText("Birthday Mega Party")).not.toBeInTheDocument();
  });

  it("filters cards by the Chat Winks type tab", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    fireEvent.click(screen.getByRole("button", { name: "Chat Winks" }));
    expect(screen.getByText("Birthday Mega Party")).toBeInTheDocument();
    expect(screen.queryByText("Countdown Pop Bingo")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "countdown" },
    });
    expect(screen.queryByText("Birthday Mega Party")).not.toBeInTheDocument();
  });

  it("filters cards by type and mood chips", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    fireEvent.click(screen.getByRole("button", { name: "Effect Winks" }));
    expect(screen.getByText("Countdown Pop Bingo")).toBeInTheDocument();
    expect(screen.queryByText("Birthday Mega Party")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Impact" }));
    expect(screen.getByText("Countdown Pop Bingo")).toBeInTheDocument();
    expect(screen.queryByText("Birthday Mega Party")).not.toBeInTheDocument();
  });

  it("filters cards by the mood row and shows subgroups", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    fireEvent.click(screen.getByRole("button", { name: "Party" }));
    expect(screen.getByText("Birthday Mega Party")).toBeInTheDocument();
    expect(screen.queryByText("Countdown Pop Bingo")).not.toBeInTheDocument();
    expect(screen.getAllByText("Party Burst").length).toBeGreaterThan(0);
  });

  it("shows the requested category browse order", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    const buttons = screen
      .getAllByRole("button")
      .map((button) => button.textContent)
      .filter((text): text is string => Boolean(text));

    expect(buttons.indexOf("All")).toBeLessThan(buttons.indexOf("Chat Winks"));
    expect(buttons.indexOf("Chat Winks")).toBeLessThan(buttons.indexOf("Effect Winks"));
    expect(buttons.indexOf("Effect Winks")).toBeLessThan(buttons.indexOf("Countdown"));
    expect(buttons.indexOf("Countdown")).toBeLessThan(buttons.indexOf("Happy Birthday"));
    expect(screen.getAllByText("Bingo Reveal").length).toBeGreaterThan(0);
  });
});
