/**
 * Regression fixtures for false positives on technical strings (UUIDs, hashes,
 * timestamps, version strings). See tests/fixtures/technical-strings.ts.
 *
 * Rows that are flagged today are listed below and run with `it.fails` in the
 * "known false positives (baseline)" block, so the suite stays green. When a
 * pattern change fixes one, its test fails with "Expect test to fail": take
 * that row off the list and lower the baseline count.
 */

import { describe, expect, it } from "vitest";
import { OpenRedaction } from "../src/detector";
import {
  type TechnicalFixture,
  technicalStrings,
} from "./fixtures/technical-strings";

// Every row of these shapes was flagged on its technical value when this was added.
const knownFalsePositiveShapes = new Set([
  "timestamp-epoch-seconds", // PHONE_UK
  "timestamp-git-date", // NAME
  "timestamp-http-date", // DATE
  "version-package-at", // DATE
  "version-firmware", // IPV4, DATE, PHONE_UK
  "version-windows-build", // PHONE_UK, XBOX_GAMERTAG
  "version-assembly", // DATE, ZIP_CODE_US
]);

// Single rows flagged where the rest of their shape passes.
const knownFalsePositiveRows = new Set([
  "hash-docker-digest-0", // CREDIT_CARD inside the digest
  "hash-git-short-11", // SEDOL
  "uuid-v4-log-9", // PHONE_UK inside the UUID
]);

const shapeOf = (fixture: TechnicalFixture) => fixture.id.replace(/-\d+$/, "");
const isKnown = (fixture: TechnicalFixture) =>
  knownFalsePositiveShapes.has(shapeOf(fixture)) ||
  knownFalsePositiveRows.has(fixture.id);

// Detections that overlap one of the row's technical values.
async function falsePositives(
  shield: OpenRedaction,
  fixture: TechnicalFixture,
) {
  const result = await shield.detect(fixture.text);
  const spans = fixture.values.map((value) => {
    const start = fixture.text.indexOf(value);
    return [start, start + value.length] as const;
  });
  return result.detections
    .filter((d) =>
      spans.some(
        ([start, end]) => d.position[0] < end && d.position[1] > start,
      ),
    )
    .map((d) => `${d.type}: ${d.value}`);
}

describe("Technical strings are not PII", () => {
  const shield = new OpenRedaction();

  for (const kind of ["uuid", "hash", "timestamp", "version"] as const) {
    describe(kind, () => {
      const rows = technicalStrings.filter(
        (f) => f.kind === kind && !isKnown(f),
      );

      it.each(rows)("$id: $text", async (fixture) => {
        expect(await falsePositives(shield, fixture)).toEqual([]);
      });
    });
  }

  describe("known false positives (baseline)", () => {
    const flaggedLines = technicalStrings.filter(isKnown);

    // Only goes down: a fix takes rows off the lists above and lowers this.
    it("has 87 lines", () => {
      expect(flaggedLines).toHaveLength(87);
    });

    it.fails.each(flaggedLines)("$id: $text", async (fixture) => {
      expect(await falsePositives(shield, fixture)).toEqual([]);
    });
  });

  it("lists only fixtures that exist", () => {
    const ids = new Set(technicalStrings.map((f) => f.id));
    const shapes = new Set(technicalStrings.map(shapeOf));
    expect([...knownFalsePositiveRows].filter((id) => !ids.has(id))).toEqual(
      [],
    );
    expect(
      [...knownFalsePositiveShapes].filter((shape) => !shapes.has(shape)),
    ).toEqual([]);
  });
});
