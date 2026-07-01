import { describe, expect, it } from "bun:test";
import { OpenRedaction } from "../src/detector";

describe("Industry-Specific Pattern Detection", () => {
  describe("Education patterns", () => {
    it("should detect student IDs", async () => {
      const shield = new OpenRedaction({ patterns: ["STUDENT_ID"] });
      const result = await shield.detect("Student ID: S1234567");
      expect(result.detections.some((d) => d.type === "STUDENT_ID")).toBe(true);
    });

    it("should detect exam registration numbers", async () => {
      const shield = new OpenRedaction({
        patterns: ["EXAM_REGISTRATION_NUMBER"],
      });
      const result = await shield.detect("Exam registration: EXAM-2024-5678");
      expect(
        result.detections.some((d) => d.type === "EXAM_REGISTRATION_NUMBER"),
      ).toBe(true);
    });
  });

  describe("Insurance patterns", () => {
    it("should detect claim IDs", async () => {
      const shield = new OpenRedaction({ patterns: ["CLAIM_ID"] });
      const result = await shield.detect("Claim ID: CLAIM-12345678");
      expect(result.detections.some((d) => d.type === "CLAIM_ID")).toBe(true);
    });

    it("should detect policy numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["POLICY_NUMBER"] });
      const result = await shield.detect("Policy number: POLICY-ABC123456");
      expect(result.detections.some((d) => d.type === "POLICY_NUMBER")).toBe(
        true,
      );
    });

    it("should detect policy holder IDs", async () => {
      const shield = new OpenRedaction({ patterns: ["POLICY_HOLDER_ID"] });
      const result = await shield.detect("Policy holder: PH-A12345678");
      expect(result.detections.some((d) => d.type === "POLICY_HOLDER_ID")).toBe(
        true,
      );
    });
  });

  describe("Retail patterns", () => {
    it("should detect order numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["ORDER_NUMBER"] });
      const result = await shield.detect("Order number: ORD-1234567890");
      expect(result.detections.some((d) => d.type === "ORDER_NUMBER")).toBe(
        true,
      );
    });

    it("should detect loyalty card numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["LOYALTY_CARD_NUMBER"] });
      const result = await shield.detect(
        "Loyalty card: LOYALTY-4521897630192837",
      );
      expect(
        result.detections.some((d) => d.type === "LOYALTY_CARD_NUMBER"),
      ).toBe(true);
    });

    it("should detect device ID tags", async () => {
      const shield = new OpenRedaction({ patterns: ["DEVICE_ID_TAG"] });
      const result = await shield.detect("Device ID: DEVID:1234567890ABCDEF");
      expect(result.detections.some((d) => d.type === "DEVICE_ID_TAG")).toBe(
        true,
      );
    });

    it("should detect gift card numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["GIFT_CARD_NUMBER"] });
      const result = await shield.detect("Gift card: GC-4521897630192837");
      expect(result.detections.some((d) => d.type === "GIFT_CARD_NUMBER")).toBe(
        true,
      );
    });
  });

  describe("Telecoms patterns", () => {
    it("should detect customer account numbers", async () => {
      const shield = new OpenRedaction({
        patterns: ["TELECOMS_ACCOUNT_NUMBER"],
      });
      const result = await shield.detect("Account number: ACC-123456789");
      expect(
        result.detections.some((d) => d.type === "TELECOMS_ACCOUNT_NUMBER"),
      ).toBe(true);
    });

    it("should detect meter serial numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["METER_SERIAL_NUMBER"] });
      const result = await shield.detect("Meter serial: MTR-1234567890");
      expect(
        result.detections.some((d) => d.type === "METER_SERIAL_NUMBER"),
      ).toBe(true);
    });

    it("should detect IMSI numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["IMSI_NUMBER"] });
      const result = await shield.detect("IMSI number: IMSI-123456789012345");
      expect(result.detections.some((d) => d.type === "IMSI_NUMBER")).toBe(
        true,
      );
    });

    it("should detect IMEI numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["IMEI_NUMBER"] });
      const result = await shield.detect("IMEI number: IMEI-123456789012345");
      expect(result.detections.some((d) => d.type === "IMEI_NUMBER")).toBe(
        true,
      );
    });

    it("should detect SIM card numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["SIM_CARD_NUMBER"] });
      const result = await shield.detect("SIM card: SIM-45218976301928376501");
      expect(result.detections.some((d) => d.type === "SIM_CARD_NUMBER")).toBe(
        true,
      );
    });
  });

  describe("Legal patterns", () => {
    it("should detect case numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["CASE_NUMBER"] });
      const result = await shield.detect("Case number: CASE-AB-2024-123456");
      expect(result.detections.some((d) => d.type === "CASE_NUMBER")).toBe(
        true,
      );
    });

    it("should detect contract references", async () => {
      const shield = new OpenRedaction({ patterns: ["CONTRACT_REFERENCE"] });
      const result = await shield.detect("Contract reference: CNTR-12345678");
      expect(
        result.detections.some((d) => d.type === "CONTRACT_REFERENCE"),
      ).toBe(true);
    });
  });

  describe("Manufacturing patterns", () => {
    it("should detect supplier IDs", async () => {
      const shield = new OpenRedaction({ patterns: ["SUPPLIER_ID"] });
      const result = await shield.detect("Supplier ID: SUPP-AB12345");
      expect(result.detections.some((d) => d.type === "SUPPLIER_ID")).toBe(
        true,
      );
    });

    it("should detect part numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["PART_NUMBER"] });
      const result = await shield.detect("Part number: PN-ABC12345");
      expect(result.detections.some((d) => d.type === "PART_NUMBER")).toBe(
        true,
      );
    });

    it("should detect purchase order numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["PURCHASE_ORDER_NUMBER"] });
      const result = await shield.detect("Purchase order: PO-ABC123456");
      expect(
        result.detections.some((d) => d.type === "PURCHASE_ORDER_NUMBER"),
      ).toBe(true);
    });

    it("should detect batch/lot numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["BATCH_LOT_NUMBER"] });
      const result = await shield.detect("Batch number: BATCH-2024001");
      expect(result.detections.some((d) => d.type === "BATCH_LOT_NUMBER")).toBe(
        true,
      );
    });
  });

  describe("Transportation patterns", () => {
    it("should detect VINs", async () => {
      const shield = new OpenRedaction({ patterns: ["VIN"] });
      const result = await shield.detect("VIN: VIN-1HGBH41JXMN109186");
      expect(result.detections.some((d) => d.type === "VIN")).toBe(true);
    });

    it("should detect license plates", async () => {
      const shield = new OpenRedaction({ patterns: ["LICENSE_PLATE"] });
      const result = await shield.detect("License plate: LICENSE-ABC123");
      expect(result.detections.some((d) => d.type === "LICENSE_PLATE")).toBe(
        true,
      );
    });

    it("should detect fleet vehicle IDs", async () => {
      const shield = new OpenRedaction({ patterns: ["FLEET_VEHICLE_ID"] });
      const result = await shield.detect("Fleet vehicle: FLEET-V12345");
      expect(result.detections.some((d) => d.type === "FLEET_VEHICLE_ID")).toBe(
        true,
      );
    });

    it("should detect driver IDs", async () => {
      const shield = new OpenRedaction({ patterns: ["DRIVER_ID"] });
      const result = await shield.detect("Driver ID: DRIVER-D12345");
      expect(result.detections.some((d) => d.type === "DRIVER_ID")).toBe(true);
    });
  });

  describe("Media patterns", () => {
    it("should detect interviewee IDs", async () => {
      const shield = new OpenRedaction({ patterns: ["INTERVIEWEE_ID"] });
      const result = await shield.detect("Interviewee ID: INTV-A12345");
      expect(result.detections.some((d) => d.type === "INTERVIEWEE_ID")).toBe(
        true,
      );
    });

    it("should detect source IDs", async () => {
      const shield = new OpenRedaction({ patterns: ["SOURCE_ID"] });
      const result = await shield.detect("Source ID: SOURCE-ABC123");
      expect(result.detections.some((d) => d.type === "SOURCE_ID")).toBe(true);
    });

    it("should detect manuscript IDs", async () => {
      const shield = new OpenRedaction({ patterns: ["MANUSCRIPT_ID"] });
      const result = await shield.detect("Manuscript ID: MS-2024001");
      expect(result.detections.some((d) => d.type === "MANUSCRIPT_ID")).toBe(
        true,
      );
    });
  });

  describe("Financial patterns (new)", () => {
    it("should detect UK bank account IBAN", async () => {
      const shield = new OpenRedaction({ patterns: ["UK_BANK_ACCOUNT_IBAN"] });
      const result = await shield.detect("Account: GB82WEST12345698765432");
      expect(
        result.detections.some((d) => d.type === "UK_BANK_ACCOUNT_IBAN"),
      ).toBe(true);
    });

    it("should detect UK sort code and account number", async () => {
      const shield = new OpenRedaction({ patterns: ["UK_SORT_CODE_ACCOUNT"] });
      const result = await shield.detect("Account: 12-34-56 12345678");
      expect(
        result.detections.some((d) => d.type === "UK_SORT_CODE_ACCOUNT"),
      ).toBe(true);
    });
  });

  describe("Network/IoT patterns (new)", () => {
    it("should detect IoT serial numbers", async () => {
      const shield = new OpenRedaction({ patterns: ["IOT_SERIAL_NUMBER"] });
      const result = await shield.detect("Device serial: SN:ABC123456789");
      expect(
        result.detections.some((d) => d.type === "IOT_SERIAL_NUMBER"),
      ).toBe(true);
    });

    it("should detect device UUIDs", async () => {
      const shield = new OpenRedaction({ patterns: ["DEVICE_UUID"] });
      const result = await shield.detect(
        "Device UUID: 550e8400-e29b-41d4-a716-446655440000",
      );
      expect(result.detections.some((d) => d.type === "DEVICE_UUID")).toBe(
        true,
      );
    });
  });

  describe("OpenAI API key (Issue #27)", () => {
    it("should detect sk-proj- project-scoped OpenAI API keys", async () => {
      const redactor = new OpenRedaction({ redactionMode: "placeholder" });
      const key =
        "sk-proj-" + "a1B2c3D4e5F6g7H8i9J0".repeat(7) + "abcdefghijklmnop";
      const result = await redactor.detect(
        `My OpenAI API key is ${key} and it should be secret`,
      );
      expect(result.detections.some((d) => d.type === "OPENAI_API_KEY")).toBe(
        true,
      );
      expect(result.detections.some((d) => d.type === "AWS_SECRET_KEY")).toBe(
        false,
      );
    });

    it("should detect legacy sk- OpenAI API keys (51 chars)", async () => {
      const redactor = new OpenRedaction({ redactionMode: "placeholder" });
      const key =
        "sk-" + "a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0u1V2w3X4Y5Z6"; // 48 chars after sk- = 51 total
      const result = await redactor.detect(`OPENAI_API_KEY=${key}`);
      expect(result.detections.some((d) => d.type === "OPENAI_API_KEY")).toBe(
        true,
      );
    });

    it("should redact OpenAI key and not misclassify as AWS_SECRET_KEY", async () => {
      const redactor = new OpenRedaction({ redactionMode: "placeholder" });
      const key =
        "sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMnOpQrStUvWxYz01";
      const result = await redactor.detect(
        `My OpenAI API key is ${key} and it should be secret`,
      );
      expect(result.detections.every((d) => d.type !== "AWS_SECRET_KEY")).toBe(
        true,
      );
      expect(result.detections.some((d) => d.type === "OPENAI_API_KEY")).toBe(
        true,
      );
      expect(result.redacted).toContain("[OPENAI_API_KEY_");
      expect(result.redacted).not.toMatch(/sk-proj-[A-Za-z0-9_-]{50,}/);
    });
  });

  describe("Integration: Multiple industry patterns", () => {
    it("should detect patterns from multiple industries in one text", async () => {
      const shield = new OpenRedaction({ debug: true });
      const text = `
        Student S1234567 ordered item ORD-1234567890.
        Claim ID: CLAIM-12345678 for vehicle VIN: VIN-1HGBH41JXMN109186.
        Customer account number ACC-123456789 for telecom service.
      `;
      const result = await shield.detect(text);

      // Debug: Log all detections
      if (result.detections.length > 0) {
        console.log(
          "[DEBUG] Industry patterns detected:",
          result.detections.map((d) => `${d.type}: '${d.value}'`),
        );
      } else {
        console.log("[DEBUG] No industry patterns detected");
      }

      const telecomDetected = result.detections.some(
        (d) => d.type === "TELECOMS_ACCOUNT_NUMBER",
      );
      console.log(
        `[DEBUG] TELECOMS_ACCOUNT_NUMBER detected: ${telecomDetected}`,
      );

      expect(result.detections.some((d) => d.type === "STUDENT_ID")).toBe(true);
      expect(result.detections.some((d) => d.type === "ORDER_NUMBER")).toBe(
        true,
      );
      expect(result.detections.some((d) => d.type === "CLAIM_ID")).toBe(true);
      expect(result.detections.some((d) => d.type === "VIN")).toBe(true);
      expect(
        result.detections.some((d) => d.type === "TELECOMS_ACCOUNT_NUMBER"),
      ).toBe(true);
    });
  });
});
