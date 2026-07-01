/**
 * MVP React integration tests for @openredaction/react hooks (jsdom + RTL).
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  useAutoRedact,
  useBatchDetector,
  useFormFieldValidator,
  useOpenRedaction,
  usePIIDetector,
} from "../src/index";

/** Deterministic hook tests: skip FP filter + context scoring. Use non–test-domain emails (see EMAIL validator in personal patterns). */
const demoOptions = {
  enableFalsePositiveFilter: false,
  enableContextAnalysis: false,
} as const;

describe("React hooks integration", () => {
  describe("useOpenRedaction", () => {
    it("detect updates result and redacts a normal-domain email", async () => {
      const { result } = renderHook(() => useOpenRedaction(demoOptions));

      await act(async () => {
        await result.current.detect("Reach me at jane@acmecorp.io today.");
      });

      expect(result.current.result?.redacted).toBeDefined();
      expect(result.current.result!.redacted).not.toContain("jane@acmecorp.io");
      expect(result.current.hasPII).toBe(true);
      expect(result.current.isDetecting).toBe(false);
    });

    it("clear resets result", async () => {
      const { result } = renderHook(() => useOpenRedaction(demoOptions));

      await act(async () => {
        await result.current.detect("x@y.com");
      });
      expect(result.current.result).not.toBeNull();

      act(() => {
        result.current.clear();
      });
      expect(result.current.result).toBeNull();
      expect(result.current.hasPII).toBe(false);
    });
  });

  describe("usePIIDetector", () => {
    it("debounces detection until interval elapses", async () => {
      const { result, rerender } = renderHook(
        ({ text }: { text: string }) =>
          usePIIDetector(text, { ...demoOptions, debounce: 80 }),
        { initialProps: { text: "" } },
      );

      rerender({ text: "Contact: notify@acmecorp.io" });
      expect(result.current.result).toBeNull();

      await waitFor(
        () => {
          expect(result.current.result).not.toBeNull();
          expect(result.current.result!.redacted).not.toContain(
            "notify@acmecorp.io",
          );
        },
        { timeout: 4000 },
      );
    });
  });

  describe("useFormFieldValidator", () => {
    it("returns false and sets error when failOnPII and email present", async () => {
      const { result } = renderHook(() =>
        useFormFieldValidator({
          ...demoOptions,
          failOnPII: true,
          types: ["EMAIL"],
        }),
      );

      let ok: boolean;
      await act(async () => {
        ok = await result.current.validate("admin@acmecorp.io");
      });

      expect(ok!).toBe(false);
      expect(result.current.error).toContain("EMAIL");
      expect(result.current.hasPII).toBe(true);
    });

    it("returns true when input empty", async () => {
      const { result } = renderHook(() =>
        useFormFieldValidator({ ...demoOptions, failOnPII: true }),
      );

      let ok: boolean;
      await act(async () => {
        ok = await result.current.validate("");
      });
      expect(ok!).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe("useBatchDetector", () => {
    it("processAll aggregates results per document", async () => {
      const { result } = renderHook(() => useBatchDetector(demoOptions));

      await act(async () => {
        await result.current.processAll(["a@b.com", "plain text"]);
      });

      expect(result.current.results).toHaveLength(2);
      expect(result.current.totalDetections).toBeGreaterThanOrEqual(1);
      expect(result.current.isProcessing).toBe(false);
    });
  });

  describe("useAutoRedact", () => {
    it("debounced detect populates redactedText", async () => {
      const { result } = renderHook(() =>
        useAutoRedact({ ...demoOptions, debounce: 80 }),
      );

      act(() => {
        result.current.setText("hello@world.com");
      });

      await waitFor(
        () => {
          expect(result.current.redactedText).not.toContain("hello@world.com");
          expect(result.current.hasPII).toBe(true);
        },
        { timeout: 4000 },
      );
    });
  });

  describe("hook stability", () => {
    it("useOpenRedaction does not recreate the detector when a new but deeply-equal options object is passed", () => {
      const { result, rerender } = renderHook(
        ({ opts }) => useOpenRedaction(opts),
        { initialProps: { opts: { ...demoOptions } } },
      );

      const firstDetector = result.current.detector;
      // Pass a new object reference with identical values — should return the same detector
      rerender({ opts: { ...demoOptions } });
      expect(result.current.detector).toBe(firstDetector);
    });

    it("useOpenRedaction recreates the detector when options values genuinely change", () => {
      const { result, rerender } = renderHook(
        ({ opts }) => useOpenRedaction(opts),
        { initialProps: { opts: { ...demoOptions } } },
      );

      const firstDetector = result.current.detector;
      rerender({ opts: { ...demoOptions, enableCache: true } });
      expect(result.current.detector).not.toBe(firstDetector);
    });

    it("useOpenRedaction works without options", async () => {
      const { result } = renderHook(() => useOpenRedaction(demoOptions));

      await act(async () => {
        await result.current.detect("t@t.com");
      });
      expect(result.current.count).toBeGreaterThanOrEqual(1);
    });
  });
});
