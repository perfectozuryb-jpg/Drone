import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("llms.txt route", () => {
  it("returns a concise AI-readable site map", async () => {
    const response = await GET();
    const text = await response.text();

    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(text).toContain("# Drone Việt");
    expect(text).toContain("Drone research and education");
    expect(text).toContain("https://droneviet.vn/san-pham/dv-research-platform");
    expect(text).toContain("https://droneviet.vn/en/products/dv-research-platform");
  });
});

