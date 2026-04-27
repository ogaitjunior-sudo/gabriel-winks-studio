import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  BALL_COLORS,
  BINGO_LETTERS,
  MainBingoBall,
  SMALL_PALETTE,
  SmallBingoBall,
} from "@/effects/bingoBalls/_bingoShared";
import { EFFECTS } from "@/data/effects";

describe("bingo shared styling", () => {
  it("maps the official BINGO colors to the five letters", () => {
    expect(BINGO_LETTERS).toEqual(["B", "I", "N", "G", "O"]);
    expect(BALL_COLORS).toEqual([
      { bg: "#0278df", deep: "#015cab", letter: "B" },
      { bg: "#f70900", deep: "#c10700", letter: "I" },
      { bg: "#9610b8", deep: "#740c8f", letter: "N" },
      { bg: "#36af0a", deep: "#288407", letter: "G" },
      { bg: "#f7c901", deep: "#c89d01", letter: "O" },
    ]);
  });

  it("renders a main bingo ball with the official colored ring, white center, and matching letter", () => {
    const { container, getByText } = render(
      <svg>
        <MainBingoBall index={0} />
      </svg>
    );

    const letter = getByText("B");
    const circles = container.querySelectorAll("circle");

    expect(circles[0]).toHaveAttribute("fill", "#0278df");
    expect(circles[1]).toHaveAttribute("fill", "none");
    expect(circles[2]).toHaveAttribute("fill", "white");
    expect(letter).toHaveAttribute("fill", "#0278df");
  });

  it("renders a small bingo ball as a lettered BINGO ball instead of a plain colored dot", () => {
    const { container, getByText } = render(
      <svg>
        <SmallBingoBall cx={48} cy={48} r={24} color={SMALL_PALETTE[3]} />
      </svg>
    );

    const letter = getByText("G");
    const circles = container.querySelectorAll("circle");

    expect(circles[0]).toHaveAttribute("fill", "#36af0a");
    expect(circles[1]).toHaveAttribute("fill", "none");
    expect(circles[2]).toHaveAttribute("fill", "white");
    expect(letter).toHaveAttribute("fill", "#36af0a");
  });
});

describe("bingo effects", () => {
  it("render B, I, N, G, and O in every Bouncing Bingo Balls animation", () => {
    const bingoEffects = EFFECTS.filter((effect) => effect.category === "Bouncing Bingo Balls");

    for (const effect of bingoEffects) {
      const { container, unmount } = render(<effect.Component playing />);
      const textContent = Array.from(container.querySelectorAll("text"))
        .map((node) => node.textContent?.trim() ?? "")
        .filter(Boolean)
        .join(" ");

      expect(textContent, effect.id).toContain("B");
      expect(textContent, effect.id).toContain("I");
      expect(textContent, effect.id).toContain("N");
      expect(textContent, effect.id).toContain("G");
      expect(textContent, effect.id).toContain("O");

      unmount();
    }
  });
});
