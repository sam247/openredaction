/**
 * Tests for financial patterns
 */

import { describe, expect, it } from "vitest";
import { OpenRedaction } from "../src/detector";

describe("Financial Pattern Detection", () => {
  describe("IBAN", () => {
    const ibanShield = new OpenRedaction({ patterns: ["IBAN"] });

    const detectIbans = async (text: string) => {
      const result = await ibanShield.detect(text);

      return result.detections
        .filter((d) => d.type === "IBAN")
        .map((d) => d.value);
    };

    it.each([
      ["Send to DE89370400440532013000 by Friday", "DE89370400440532013000"],
      [
        "IBAN: GB82 WEST 1234 5698 7654 32 and thanks",
        "GB82 WEST 1234 5698 7654 32",
      ],
      ["IBAN DE89-3704-0044-0532-0130-00 ok", "DE89-3704-0044-0532-0130-00"],
      ["Konto BE68 5390 0754 7034 SEPA", "BE68 5390 0754 7034"],
      ["IBAN DE89.3704.0044.0532.0130.00 ok", "DE89.3704.0044.0532.0130.00"],
      [
        "IBAN GB82\u00A0WEST\u00A01234\u00A05698\u00A07654\u00A032 ok",
        "GB82\u00A0WEST\u00A01234\u00A05698\u00A07654\u00A032",
      ],
      ["Pay de89 3704 0044 0532 0130 00 now", "de89 3704 0044 0532 0130 00"],
    ])("should detect IBAN followed by text: %s", async (text, expected) => {
      expect(await detectIbans(text)).toEqual([expected]);
    });

    // Shortest (NO, 15) and longest (RU, 33) registered lengths
    it.each([
      ["NO9386011117947", "NO93 8601 1117 947"],
      [
        "RU0304452522540817810538091310419",
        "RU03 0445 2522 5408 1781 0538 0913 1041 9",
      ],
    ])("should detect %s compact and grouped", async (compact, grouped) => {
      expect(
        await detectIbans(`Pay ${compact} today and ${grouped} tomorrow`),
      ).toEqual([compact, grouped]);
    });

    it("should detect IBAN regardless of test/example wording nearby", async () => {
      expect(
        await detectIbans(
          "Not a test iban. Real customer IBAN: DE89370400440532013000",
        ),
      ).toEqual(["DE89370400440532013000"]);
    });

    it("should not detect IBAN with invalid checksum", async () => {
      expect(await detectIbans("IBAN DE00370400440532013000")).toEqual([]);
    });

    it("should not detect IBAN embedded in a longer token", async () => {
      expect(await detectIbans("ref DE8937040044053201300099")).toEqual([]);
    });
  });
});
