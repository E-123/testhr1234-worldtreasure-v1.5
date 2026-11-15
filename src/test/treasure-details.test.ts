import { describe, expect, it } from "vitest";
import { parseTags } from "@/components/admin/TreasureForm";

describe("treasure tags", () => {
  it("keeps multiple Chinese, English and French tags while removing empty duplicates", () => {
    expect(parseTags("瓷器，宋代, 瓷器\nCeramique")).toEqual(["瓷器", "宋代", "Ceramique"]);
  });
});
