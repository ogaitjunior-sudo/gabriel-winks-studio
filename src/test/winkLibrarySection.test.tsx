import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
          lottiePath: "/lottie/countdown/countdown-pop-bingo.json",
          lottieQuality: "medium",
          name: "Countdown Pop Bingo",
          safeArea: "centered",
          safeAreaGuidance: "Keep key action centered.",
          soundCues: [
            {
              sound: "/sounds/pop.mp3",
              time: 0,
            },
            {
              sound: "/sounds/cheer.mp3",
              time: 0.6,
            },
            {
              sound: "/sounds/chime.mp3",
              time: 1.4,
            },
          ],
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
        {
          apng: {
            bytes: 3890,
            fileName: "flowers-bloom-pop.apng",
            fps: 15,
            frameCount: 48,
            path: "/winks/effect/apng/flowers-bloom-pop.apng",
            sizeLabel: "3.8 KB",
            transparent: true,
          },
          aspectRatio: "16:9",
          category: "Flowers",
          durationMs: 3200,
          edgeGuidance: null,
          featured: true,
          height: 1080,
          id: "flowers-bloom-pop",
          kind: "effect",
          lottiePath: "/lottie/effect-winks/flowers-bloom-pop.json",
          lottieQuality: "high",
          name: "Flowers Bloom Pop",
          safeArea: "centered",
          safeAreaGuidance: "Keep key action centered.",
          svg: {
            bytes: 2780,
            fileName: "flowers-bloom-pop.svg",
            path: "/winks/effect/svg/flowers-bloom-pop.svg",
            sizeLabel: "2.7 KB",
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

const OriginalAudio = globalThis.Audio;

afterEach(() => {
  vi.clearAllTimers();
  globalThis.Audio = OriginalAudio;
  vi.useRealTimers();
});

describe("WinkLibrarySection", () => {
  it("renders card downloads and quick navigation", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    expect(screen.getAllByRole("button", { name: "All" })[0]).toHaveAttribute("type", "button");
    expect(screen.getByText("Browse by category:")).toBeInTheDocument();
    expect(screen.getByText("Filter by mood:")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "SVG" })[0]).toHaveAttribute(
      "href",
      "/winks/effect/svg/flowers-bloom-pop.svg"
    );
    expect(
      screen
        .getAllByRole("link", { name: "Download Lottie" })
        .some((link) => link.getAttribute("href") === "/lottie/countdown/countdown-pop-bingo.json")
    ).toBe(true);
    expect(screen.getByText("Sound")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Play" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Quick Jump")).toBeInTheDocument();
  });

  it("shows a featured high-quality lottie strip at the top", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    const featuredRegion = screen.getByRole("region", { name: "Featured Effects" });
    const featuredCard = within(featuredRegion)
      .getByText("Flowers Bloom Pop")
      .closest("article");
    const featuredCardScope = within(featuredCard as HTMLElement);

    expect(within(featuredRegion).getByText("Flowers Bloom Pop")).toBeInTheDocument();
    expect(featuredRegion).toHaveClass("featured-hero-shell");
    expect(within(featuredRegion).queryByText("Countdown Pop Bingo")).not.toBeInTheDocument();
    expect(within(featuredRegion).getByText("Top Picks")).toBeInTheDocument();
    expect(featuredRegion).toHaveTextContent(
      "our best-performing and most visually impactful effects for bingo room experiences."
    );
    expect(within(featuredRegion).getByText("Top Pick")).toBeInTheDocument();
    expect(within(featuredRegion).getByText("Impact")).toBeInTheDocument();
    expect(within(featuredRegion).getByText("Reaction")).toBeInTheDocument();
    expect(
      within(featuredRegion).getByRole("img", { name: "Flowers Bloom Pop SVG Animation" })
    ).toHaveAttribute("loading", "eager");
    expect(
      within(featuredRegion).getByRole("img", { name: "Flowers Bloom Pop SVG Animation" })
    ).toHaveAttribute("fetchpriority", "high");
    expect(
      within(featuredRegion).getByRole("img", { name: "Flowers Bloom Pop SVG Animation" })
    ).toHaveClass("h-full", "w-full", "object-contain");
    expect(
      within(featuredRegion).getByRole("img", { name: "Flowers Bloom Pop SVG Animation" })
        .parentElement
    ).toHaveClass("absolute", "flex", "items-center", "justify-center", "inset-[6%]");
    expect(featuredCardScope.getByRole("link", { name: "Download" })).toHaveAttribute(
      "href",
      "/lottie/effect-winks/flowers-bloom-pop.json"
    );
    expect(featuredCardScope.getByRole("button", { name: "Use this effect" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    fireEvent.click(featuredCardScope.getByRole("button", { name: "Use this effect" }));
    expect(featuredCardScope.getByRole("button", { name: "Selected" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      featuredCardScope.getByText("Selected for your next bingo room moment.")
    ).toBeInTheDocument();
    expect(featuredCard).toHaveClass("hover:scale-[1.015]");
  });

  it("hides low-quality lottie downloads from the card UI", () => {
    const lowQualityManifest: WinksManifest = {
      ...manifest,
      groups: {
        ...manifest.groups,
        effect: {
          ...manifest.groups.effect,
          items: [
            {
              ...manifest.groups.effect.items[0],
              id: "thumbs-up-bounce",
              lottiePath: "/lottie/effect-winks/thumbs-up-bounce.json",
              lottieQuality: "low",
              name: "Thumbs Up Bounce",
            },
          ],
        },
      },
    };

    render(<WinkLibrarySection manifest={lowQualityManifest} />);

    expect(screen.queryByRole("link", { name: "Download Lottie" })).not.toBeInTheDocument();
  });

  it("hides unsupported lottie downloads without leaving disabled download buttons", () => {
    const unsupportedManifest: WinksManifest = {
      ...manifest,
      groups: {
        ...manifest.groups,
        effect: {
          ...manifest.groups.effect,
          items: [
            {
              ...manifest.groups.effect.items[0],
              lottiePath: "/lottie/effect-winks/countdown-pop-bingo.json",
              lottieQuality: "high",
              lottieSupported: false,
            },
          ],
        },
      },
    };

    render(<WinkLibrarySection manifest={unsupportedManifest} />);

    expect(screen.queryByRole("link", { name: "Download Lottie" })).not.toBeInTheDocument();
    expect(
      screen.queryAllByRole("button").filter((button) => {
        const label = button.textContent ?? "";
        return button.hasAttribute("disabled") && /download|svg|apng/i.test(label);
      })
    ).toHaveLength(0);
  });

  it("filters cards by search and category", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    fireEvent.click(screen.getByRole("button", { name: "Happy Birthday" }));
    expect(screen.getByText("Birthday Mega Party")).toBeInTheDocument();
    expect(screen.queryByText("Countdown Pop Bingo")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Download Lottie" })).not.toBeInTheDocument();

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

  it("filters cards by the Test Sound tab", () => {
    render(<WinkLibrarySection manifest={manifest} />);

    fireEvent.click(screen.getByRole("button", { name: "Test Sound (1)" }));
    expect(screen.getByText("Countdown Pop Bingo")).toBeInTheDocument();
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

  it("replays the preview and plays sound only on play click", () => {
    vi.useFakeTimers();
    const audioInstances: Array<{
      currentTime: number;
      pause: ReturnType<typeof vi.fn>;
      play: ReturnType<typeof vi.fn>;
      preload: string;
      src: string;
    }> = [];

    globalThis.Audio = vi.fn((src: string) => {
      const instance = {
        currentTime: 0,
        pause: vi.fn(),
        play: vi.fn().mockResolvedValue(undefined),
        preload: "none",
        src,
      };
      audioInstances.push(instance);
      return instance;
    }) as unknown as typeof Audio;

    render(<WinkLibrarySection manifest={manifest} />);

    expect(globalThis.Audio).not.toHaveBeenCalled();

    const countdownCard = screen.getByText("Countdown Pop Bingo").closest("article");
    expect(countdownCard).not.toBeNull();
    const getCountdownPreview = () =>
      within(countdownCard as HTMLElement).getByRole("img", {
        name: "Countdown Pop Bingo SVG Animation",
      });

    fireEvent.click(within(countdownCard as HTMLElement).getByRole("button", { name: "Play" }));

    expect(globalThis.Audio).not.toHaveBeenCalled();
    fireEvent.load(getCountdownPreview());
    expect(globalThis.Audio).toHaveBeenNthCalledWith(1, "/sounds/pop.mp3");
    expect(audioInstances[0]?.play).toHaveBeenCalledTimes(1);
    expect(audioInstances[0]?.currentTime).toBe(0);

    fireEvent.click(within(countdownCard as HTMLElement).getByRole("button", { name: "Play" }));
    expect(globalThis.Audio).toHaveBeenCalledTimes(1);
    fireEvent.load(getCountdownPreview());
    expect(audioInstances[0]?.pause).toHaveBeenCalledTimes(1);
    expect(audioInstances[0]?.currentTime).toBe(0);
    expect(globalThis.Audio).toHaveBeenNthCalledWith(2, "/sounds/pop.mp3");
    expect(globalThis.Audio).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(600);
    expect(globalThis.Audio).toHaveBeenNthCalledWith(3, "/sounds/cheer.mp3");
    expect(globalThis.Audio).toHaveBeenCalledTimes(3);

    vi.advanceTimersByTime(800);
    expect(globalThis.Audio).toHaveBeenNthCalledWith(4, "/sounds/chime.mp3");
    expect(globalThis.Audio).toHaveBeenCalledTimes(4);
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
    expect(buttons.indexOf("Chat Winks")).toBeLessThan(buttons.indexOf("Test Sound (1)"));
    expect(buttons.indexOf("Test Sound (1)")).toBeLessThan(buttons.indexOf("Effect Winks"));
    expect(buttons.indexOf("Effect Winks")).toBeLessThan(buttons.indexOf("Countdown"));
    expect(buttons.indexOf("Countdown")).toBeLessThan(buttons.indexOf("Happy Birthday"));
    expect(screen.getAllByText("Bingo Reveal").length).toBeGreaterThan(0);
  });
});
