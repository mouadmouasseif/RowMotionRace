import { describe, expect, it } from "vitest";
import { formatTime } from "./start-sequence-demo";

describe("format du chronomètre", () => {
  it("conserve la précision milliseconde", () => expect(formatTime(198254)).toBe("03:18.254"));
  it("formate les temps inférieurs à une minute", () => expect(formatTime(42031)).toBe("00:42.031"));
});
