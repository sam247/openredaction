import { describe, expect, it } from "vitest";
import { OpenRedaction } from "../src/detector";
import { NPI_NUMBER } from "../src/patterns/industries/healthcare";

// Check digit per CMS: Luhn over the 9-digit base with the "80840" prefix
// https://www.cms.gov/Regulations-and-Guidance/Administrative-Simplification/NationalProvIdentStand/Downloads/NPIcheckdigit.pdf
describe("NPI_NUMBER", () => {
  const context = "Referring provider NPI";

  it("accepts NPIs with a valid CMS check digit", () => {
    expect(NPI_NUMBER.validator?.("1234567893", context)).toBe(true); // CMS example
    expect(NPI_NUMBER.validator?.("9876543213", context)).toBe(true);
  });

  it("rejects NPIs with a wrong check digit", () => {
    expect(NPI_NUMBER.validator?.("1234567897", context)).toBe(false);
    expect(NPI_NUMBER.validator?.("9876543217", context)).toBe(false);
  });

  it("redacts a valid NPI in text", async () => {
    const shield = new OpenRedaction({ patterns: ["NPI_NUMBER"] });
    const result = await shield.detect("Referring provider NPI: 1234567893");
    expect(result.detections.some((d) => d.type === "NPI_NUMBER")).toBe(true);
    expect(result.redacted).not.toContain("1234567893");
  });
});
