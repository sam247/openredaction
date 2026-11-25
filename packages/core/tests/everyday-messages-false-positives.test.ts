/**
 * Regression fixtures for false positives on everyday messages in nine languages. See
 * tests/fixtures/everyday-messages.ts. None of the messages holds personal data, so every
 * detection is a false positive.
 *
 * Two patterns flag a large share of the set today, so they are counted instead of listed, and
 * left out of the per-message checks:
 * - NAME flags capitalised words at the start of a sentence ("Can you help me").
 * - INSTAGRAM_USERNAME accepts any word when the text nearby holds one of its context words. The
 *   check also matches "ig" inside words like "big" and "light", and everyday verbs like
 *   "handle" and "follow".
 * When a change moves one of those counts, update it here: lower is a fix, higher is a new false
 * positive.
 *
 * Messages flagged by any other pattern today are listed below and run with `it.fails`, so the
 * suite stays green. When a pattern change fixes one, its test fails with "Expect test to fail":
 * take that message off the list.
 */

import { describe, expect, it } from "vitest";
import { OpenRedaction } from "../src/detector";
import {
  type EverydayLanguage,
  everydayMessages,
} from "./fixtures/everyday-messages";

// How many messages each of these patterns flags today.
const broadFalsePositives: Record<string, number> = {
  NAME: 619,
  INSTAGRAM_USERNAME: 15,
};

const knownFalsePositives = new Set([
  "en-109", // ZIP_CODE_US
  "en-113", // ZIP_CODE_US, PHONE_UK
  "en-114", // PHONE_UK
  "en-123", // XBOX_GAMERTAG
  "en-201", // GENERIC_SECRET
  "en-204", // USERNAME
  "en-212", // USERNAME
  "en-214", // DATE
  "en-219", // GENERIC_SECRET
  "en-220", // USERNAME
  "en-227", // XBOX_GAMERTAG
  "en-231", // PHONE_UK
  "en-233", // ZIP_CODE_US
  "en-271", // XBOX_GAMERTAG
  "en-273", // USERNAME
  "en-288", // GENERIC_SECRET
  "en-290", // USERNAME
  "en-291", // PHONE_UK
  "en-315", // ADDRESS_STREET
  "en-316", // ADDRESS_STREET
  "en-318", // DATE
  "en-325", // ZIP_CODE_US
  "en-336", // ZIP_CODE_US
  "en-348", // PASSPORT_US
  "en-376", // XBOX_GAMERTAG
  "en-377", // XBOX_GAMERTAG
  "en-378", // XBOX_GAMERTAG
  "en-380", // USERNAME
  "en-383", // PSN_ID
  "en-396", // XBOX_GAMERTAG
  "en-397", // PHONE_UK
  "en-398", // XBOX_GAMERTAG
  "en-399", // XBOX_GAMERTAG
  "en-402", // XBOX_GAMERTAG
  "en-432", // ADDRESS_STREET
  "en-433", // ADDRESS_STREET
  "en-434", // ADDRESS_STREET
  "en-435", // ADDRESS_STREET
  "en-436", // ADDRESS_STREET
  "en-437", // ADDRESS_STREET
  "en-442", // ADDRESS_STREET
  "en-443", // ADDRESS_STREET
  "en-460", // XBOX_GAMERTAG
  "en-470", // CVV
  "en-477", // PHONE_UK
  "en-481", // VISA_NUMBER
  "en-483", // PHONE_UK
  "en-493", // PHONE_UK, SEDOL
  "en-494", // DATE
  "en-497", // ZIP_CODE_US
  "en-500", // GENERIC_SECRET
  "en-505", // ZIP_CODE_US
  "en-507", // ZIP_CODE_US
  "en-512", // DATE
  "es-090", // PHONE_UK
  "es-118", // XBOX_GAMERTAG
  "es-129", // ZIP_CODE_US
  "es-153", // XBOX_GAMERTAG
  "es-158", // PSN_ID
  "es-207", // PHONE_UK
  "es-208", // PHONE_UK
  "es-219", // PHONE_UK, SEDOL
  "es-221", // PHONE_UK
  "es-227", // DATE
  "es-229", // DATE
  "es-232", // PHONE_UK
  "es-234", // PHONE_UK, DATE
  "es-236", // ZIP_CODE_US
  "es-242", // PHONE_UK
  "es-244", // DATE
  "es-248", // PHONE_UK
  "de-001", // DATE
  "de-003", // DATE
  "de-004", // DATE
  "de-007", // PHONE_UK, SEDOL, DATE
  "de-009", // DATE
  "de-010", // DATE
  "de-013", // PHONE_UK
  "de-014", // PHONE_UK
  "de-015", // PHONE_UK
  "de-016", // PHONE_UK
  "de-023", // DATE
  "de-029", // DATE
  "de-032", // PHONE_UK
  "de-035", // DATE
  "fr-003", // DATE
  "fr-006", // DATE
  "fr-008", // PHONE_UK
  "fr-010", // PHONE_UK, DATE
  "fr-011", // PHONE_UK
  "fr-012", // PHONE_UK, DATE
  "fr-013", // PHONE_UK
  "fr-016", // DATE
  "fr-032", // DATE
  "pt-001", // DATE
  "pt-003", // DATE
  "pt-007", // DATE
  "pt-010", // DATE
  "pt-020", // DATE
  "pt-025", // PHONE_UK
  "pt-034", // DATE
  "pt-035", // PHONE_UK
  "ar-001", // DATE
  "ar-003", // DATE
  "ar-006", // PHONE_UK
  "ar-012", // ZIP_CODE_US, DATE
  "ar-017", // DATE
  "hi-001", // DATE
  "hi-006", // PHONE_UK
  "hi-007", // ZIP_CODE_US
  "hi-013", // ZIP_CODE_US, DATE
  "hi-019", // DATE
  "ja-006", // PHONE_UK
  "ja-013", // ZIP_CODE_US
  "zh-014", // PHONE_UK
]);

const shield = new OpenRedaction();
const detected = new Map<string, Promise<string[]>>();

// Every detection in a message, as "TYPE: value". Each message is scanned once.
function detections(text: string) {
  let found = detected.get(text);
  if (!found) {
    found = shield
      .detect(text)
      .then((result) => result.detections.map((d) => `${d.type}: ${d.value}`));
    detected.set(text, found);
  }
  return found;
}

const isBroad = (detection: string) =>
  Object.keys(broadFalsePositives).some((type) =>
    detection.startsWith(`${type}: `),
  );

describe("Everyday messages are not PII", () => {
  const languages = [
    ...new Set(everydayMessages.map((m) => m.lang)),
  ] as EverydayLanguage[];

  for (const lang of languages) {
    describe(lang, () => {
      const rows = everydayMessages.filter((m) => m.lang === lang);

      it.each(rows.filter((m) => !knownFalsePositives.has(m.id)))(
        "$id",
        async (message) => {
          const found = await detections(message.text);
          expect(found.filter((d) => !isBroad(d))).toEqual([]);
        },
      );

      const known = rows.filter((m) => knownFalsePositives.has(m.id));
      if (known.length > 0) {
        it.fails.each(known)("known false positive, $id", async (message) => {
          const found = await detections(message.text);
          expect(found.filter((d) => !isBroad(d))).toEqual([]);
        });
      }
    });
  }

  it.each(Object.entries(broadFalsePositives))(
    "%s flags %i messages today",
    async (type, count) => {
      let flagged = 0;
      for (const message of everydayMessages) {
        const found = await detections(message.text);
        if (found.some((d) => d.startsWith(`${type}: `))) flagged++;
      }
      expect(flagged).toBe(count);
    },
  );

  it("has unique ids and lists only messages that exist", () => {
    const ids = everydayMessages.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...knownFalsePositives].filter((id) => !ids.includes(id))).toEqual(
      [],
    );
  });
});
