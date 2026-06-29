// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDeepMemo } from "../src/utils/use-deep-memo";

describe("useDeepMemo", () => {
  describe("value stability", () => {
    it("returns the initial value on first render", () => {
      const initial = { a: 1 };
      const { result } = renderHook(() => useDeepMemo(initial, [initial]));

      expect(result.current).toBe(initial);
    });

    it.each([
      ["object", { a: 1, b: 2 }],
      ["array", [1, 2, 3]],
      ["nested object", { a: { b: { c: 1 } } }],
      [
        "nested array",
        [
          [1, 2],
          [3, 4],
        ],
      ],
      ["mixed", { a: [1, { b: 2 }], c: "x" }],
    ])("preserves value reference across rerenders with equal %s deps", (_label, depsValue) => {
      const { result, rerender } = renderHook(
        ({ deps }) => useDeepMemo(deps, [deps]),
        { initialProps: { deps: depsValue } },
      );

      const first = result.current;
      rerender({ deps: structuredClone(depsValue) });
      expect(result.current).toBe(first);
    });

    it.each([
      ["object", { a: 1 }, { a: 2 }],
      ["array", [1, 2, 3], [1, 2, 4]],
      ["nested", { a: { b: 1 } }, { a: { b: 2 } }],
      ["extra key", { a: 1 }, { a: 1, b: 2 }],
      ["missing key", { a: 1, b: 2 }, { a: 1 }],
    ])("swaps value when %s deps change", (_label, oldDeps, newDeps) => {
      const { result, rerender } = renderHook(
        ({ deps }) => useDeepMemo(deps, [deps]),
        { initialProps: { deps: oldDeps } },
      );

      const first = result.current;
      rerender({ deps: newDeps });
      expect(result.current).not.toBe(first);
      expect(result.current).toStrictEqual(newDeps);
    });
  });

  describe("multiple deps", () => {
    it("preserves reference when all deps are deeply equal", () => {
      const { result, rerender } = renderHook(
        ({ a, b }) => useDeepMemo({ a, b }, [a, b]),
        { initialProps: { a: { x: 1 }, b: [1, 2] } },
      );

      const first = result.current;
      rerender({ a: { x: 1 }, b: [1, 2] });
      expect(result.current).toBe(first);
    });

    it("swaps when any single dep changes", () => {
      const { result, rerender } = renderHook(
        ({ a, b }) => useDeepMemo({ a, b }, [a, b]),
        { initialProps: { a: { x: 1 }, b: [1, 2] } },
      );

      const first = result.current;
      rerender({ a: { x: 1 }, b: [1, 3] });
      expect(result.current).not.toBe(first);
    });
  });

  describe("render behavior", () => {
    it("does not trigger re-renders when deps are stable", () => {
      let renderCount = 0;
      const { rerender } = renderHook(() => {
        renderCount++;
        return useDeepMemo({ a: 1 }, [{ a: 1 }]);
      });

      expect(renderCount).toBe(1);
      rerender();
      rerender();
      rerender();
      expect(renderCount).toBe(4);
    });

    it("computes value eagerly on first render (no lazy initializer needed)", () => {
      const factory = vi.fn(() => ({ computed: true }));
      const { result, rerender } = renderHook(() =>
        useDeepMemo(factory(), [{ key: "stable" }]),
      );

      expect(factory).toHaveBeenCalledTimes(1);
      expect(result.current).toStrictEqual({ computed: true });

      rerender();
      expect(factory).toHaveBeenCalledTimes(2);
      expect(result.current).toStrictEqual({ computed: true });
    });
  });

  describe("edge cases", () => {
    it("handles empty deps array", () => {
      const value = { stable: true };
      const { result, rerender } = renderHook(() => useDeepMemo(value, []));

      const first = result.current;
      rerender();
      expect(result.current).toBe(first);
    });

    it("handles undefined and null deps", () => {
      const { result, rerender } = renderHook(
        ({ deps }) => useDeepMemo(deps, [deps]),
        { initialProps: { deps: undefined as undefined | null } },
      );

      const first = result.current;
      rerender({ deps: undefined });
      expect(result.current).toBe(first);

      rerender({ deps: null });
      expect(result.current).not.toBe(first);
    });

    it("handles dep array length change", () => {
      const { result, rerender } = renderHook(
        ({ a, b }) => useDeepMemo({ a, b }, b ? [a, b] : [a]),
        { initialProps: { a: 1, b: undefined as number | undefined } },
      );

      const first = result.current;
      rerender({ a: 1, b: undefined });
      expect(result.current).toBe(first);

      rerender({ a: 1, b: 2 });
      expect(result.current).not.toBe(first);
    });
  });
});
