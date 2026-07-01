import { describe, expect, it } from "vitest";
import { OpenRedaction } from "../src/detector";
import { CsvProcessor } from "../src/document/CsvProcessor";
import { JsonProcessor } from "../src/document/JsonProcessor";

describe("JsonProcessor", () => {
  it("detects email in nested JSON string values", async () => {
    const detector = new OpenRedaction({
      patterns: ["EMAIL"],
      enableFalsePositiveFilter: false,
    });
    const jp = new JsonProcessor();
    const data = { user: { contact: "x@y.com" } };
    const res = await jp.detect(data, detector);
    expect(res.detections.some((d) => d.type === "EMAIL")).toBe(true);
    expect(res.pathsDetected.length).toBeGreaterThan(0);
  });
});

describe("CsvProcessor", () => {
  it("detects email in CSV with header row", async () => {
    const detector = new OpenRedaction({
      patterns: ["EMAIL"],
      enableFalsePositiveFilter: false,
    });
    const cp = new CsvProcessor();
    const csv = "email\nfoo@bar.com\n";
    const res = await cp.detect(csv, detector, {
      hasHeader: true,
      delimiter: ",",
    });
    expect(res.detections.some((d) => d.type === "EMAIL")).toBe(true);
    expect(res.rowCount).toBeGreaterThan(0);
  });
});
