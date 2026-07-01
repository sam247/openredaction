import { describe, expect, it } from "bun:test";
import { dequal } from "../src/utils/dequal";

describe("dequal", () => {
  describe("primitives", () => {
    it.each([
      ["strings", "hello", "hello"],
      ["numbers", 42, 42],
      ["booleans", true, true],
      ["bigint", 10n, 10n],
      ["zero", 0, 0],
      ["negative zero", -0, -0],
      ["NaN", Number.NaN, Number.NaN],
      ["Infinity", Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
      ["empty string", "", ""],
      ["null", null, null],
      ["undefined", undefined, undefined],
    ])("returns true for equal %s", (_label, a, b) => {
      expect(dequal(a, b)).toBe(true);
    });

    it.each([
      ["different strings", "hello", "world"],
      ["different numbers", 42, 43],
      ["different booleans", true, false],
      ["string vs number", "42", 42],
      ["null vs undefined", null, undefined],
      ["number vs bigint", 10, 10n],
      ["positive vs negative zero", 0, -0],
      ["NaN vs Infinity", Number.NaN, Number.POSITIVE_INFINITY],
    ])("returns false for unequal %s", (_label, a, b) => {
      expect(dequal(a, b)).toBe(false);
    });
  });

  describe("arrays", () => {
    it.each([
      ["empty", [], []],
      ["numbers", [1, 2, 3], [1, 2, 3]],
      ["nested", [[1, 2], [3]], [[1, 2], [3]]],
      ["mixed types", [1, "a", true, null], [1, "a", true, null]],
      ["objects", [{ a: 1 }], [{ a: 1 }]],
    ])("returns true for equal arrays: %s", (_label, a, b) => {
      expect(dequal(a, b)).toBe(true);
    });

    it.each([
      ["different length", [1, 2], [1, 2, 3]],
      ["different element", [1, 2, 3], [1, 2, 4]],
      ["different order", [1, 2, 3], [3, 2, 1]],
      ["array vs non-array", [1, 2], { 0: 1, 1: 2 }],
      ["nested difference", [[1, 2], [3]], [[1, 2], [4]]],
    ])("returns false for unequal arrays: %s", (_label, a, b) => {
      expect(dequal(a, b)).toBe(false);
    });
  });

  describe("objects", () => {
    it.each([
      ["empty", {}, {}],
      ["flat", { a: 1, b: "x" }, { a: 1, b: "x" }],
      ["nested", { a: { b: { c: 1 } } }, { a: { b: { c: 1 } } }],
      ["with array values", { a: [1, 2] }, { a: [1, 2] }],
      ["key order irrelevant", { a: 1, b: 2 }, { b: 2, a: 1 }],
    ])("returns true for equal objects: %s", (_label, a, b) => {
      expect(dequal(a, b)).toBe(true);
    });

    it.each([
      ["different values", { a: 1 }, { a: 2 }],
      ["extra key", { a: 1 }, { a: 1, b: 2 }],
      ["missing key", { a: 1, b: 2 }, { a: 1 }],
      ["nested difference", { a: { b: 1 } }, { a: { b: 2 } }],
      ["object vs null", { a: 1 }, null],
      ["object vs array", { 0: 1, length: 1 }, [1]],
    ])("returns false for unequal objects: %s", (_label, a, b) => {
      expect(dequal(a, b)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("returns true for same reference", () => {
      const obj = { a: 1 };
      expect(dequal(obj, obj)).toBe(true);
    });

    it("handles deeply nested structures", () => {
      const a = { x: [{ y: { z: [1, { w: 2 }] } }] };
      const b = { x: [{ y: { z: [1, { w: 2 }] } }] };
      expect(dequal(a, b)).toBe(true);
    });

    it("detects difference in deeply nested structures", () => {
      const a = { x: [{ y: { z: [1, { w: 2 }] } }] };
      const b = { x: [{ y: { z: [1, { w: 3 }] } }] };
      expect(dequal(a, b)).toBe(false);
    });
  });
});
