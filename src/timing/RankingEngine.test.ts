import { describe, expect, it } from "vitest";
import { rankResults } from "./RankingEngine";

describe("RankingEngine", () => {
  it("orders finished athletes by official time including penalties", () => {
    const ranking = rankResults([
      { entryId: "lane-1", lane: 1, athleteName: "A", rawTimeMs: 88400, penaltyMs: 2000, status: "FINISHED" },
      { entryId: "lane-2", lane: 2, athleteName: "B", rawTimeMs: 89000, status: "FINISHED" }
    ]);

    expect(ranking.finished.map((item) => item.entryId)).toEqual(["lane-2", "lane-1"]);
    expect(ranking.finished[1].displayTime).toBe("01:30.400");
  });

  it("keeps racing athletes out of official ranks", () => {
    const ranking = rankResults([
      { entryId: "lane-1", lane: 1, athleteName: "Finished", rawTimeMs: 88400, status: "FINISHED" },
      { entryId: "lane-2", lane: 2, athleteName: "Racing", rawTimeMs: 70000, status: "RACING" }
    ]);

    expect(ranking.finished).toHaveLength(1);
    expect(ranking.racing).toHaveLength(1);
    expect(ranking.racing[0].rank).toBeNull();
  });
});
