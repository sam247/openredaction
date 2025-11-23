# Industry-Specific PII Pattern Examples

This document provides example text snippets demonstrating PII detection across various industries supported by OpenRedact.

## Education

```text
Student ID: S1234567
Exam registration number: EXAM-2024-5678
University ID: UNI-ABC123456
Transcript ID: TRANSCRIPT-2024001
Faculty ID: F1234567
```

## Insurance & Claims

```text
Claim ID: CLAIM-12345678
Policy number: POLICY-ABC123456
Policy holder ID: PH-A12345678
Quote reference: QTE-REF-2024001
Insurance certificate: CERT-INS-12345678
Adjuster ID: ADJ-123456
```

## Retail & E-Commerce

```text
Order number: ORD-1234567890
Loyalty card number: LOYALTY-1234567890123
Customer ID: CUST-ABC123456
Device ID tag: DEVID:1234567890ABCDEF
Gift card number: GC-1234567890123
RMA number: RMA-ABC123456
Tracking number: TRACKING-1Z999AA10123456
Invoice number: INV-2024001
```

## Telecommunications & Utilities

```text
Customer account number: ACC-123456789
Meter serial number: MTR-1234567890
IMSI number: IMSI-123456789012345
IMEI number: IMEI-123456789012345
SIM card number: SIM-12345678901234567890
Service request number: SR-ABC123456
Bill account number: BILL-12345678
Broadband service ID: BROADBAND-ABC1234567
Smart meter ID: SMART-METER-ABC1234567
```

## Legal & Professional Services

```text
Case number: CASE-AB-2024-123456
Contract reference code: CNTR-12345678
Matter number: MATTER-ABC123456
Bar number: BAR-123456
Settlement ID: SETTLEMENT-ABC123
Client ID: CLIENT-ABC123
```

## Manufacturing & Supply Chain

```text
Supplier ID: SUPP-AB12345
Part number: PN-ABC12345
Purchase order: PO-ABC123456
Work order: WO-123456
Batch number: BATCH-2024001
Serial number: SERIAL-ABC123456789
Vendor code: VEND-ABC123
Container number: ABCD1234567
Project code: PROJ-AB1234
```

## Finance & Banking

```text
UK Bank Account (IBAN): GB82WEST12345698765432
UK Sort Code + Account: 12-34-56 12345678
Transaction ID: TXN-ABC123456789
SWIFT/BIC: ABCDGB2L
Investment account: ISA-ABC123456
Wire transfer reference: WIRE-ABC123456789
Bitcoin address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

## Transportation & Automotive

```text
VIN: VIN-1HGBH41JXMN109186
License plate: LICENSE-ABC123
Fleet vehicle ID: FLEET-V12345
Booking number: BOOKING-ABC123
Driver ID: DRIVER-D12345
Trip ID: TRIP-ABC123456789
```

## Media & Publishing

```text
Interviewee ID: INTV-A12345
Source ID: SOURCE-ABC123
Manuscript ID: MS-2024001
Press pass ID: PRESS-ABC123
Contributor ID: CONTRIBUTOR-ABC123
Subscriber ID: SUBSCRIBER-ABC12345
```

## Human Resources

```text
Employee ID: EMP-123456
Payroll number: PAYROLL-ABC123
Salary: SALARY: £45,000
Performance review ID: REVIEW-2024001
Benefits plan number: BENEFITS-ABC12345
Retirement account: 401K-ABC12345678
```

## Device & IoT Logs

```text
MAC address: 00:1B:44:11:3A:B7
IoT serial number: SN:ABC123456789
Device UUID: 550e8400-e29b-41d4-a716-446655440000
```

## UK Public Sector

```text
National Insurance Number: NI: AB 12 34 56 C
NHS Number: NHS: 123 456 7890
```

## US Public Sector

```text
Social Security Number: SSN: 123-45-6789
```

---

## Usage Example

```javascript
import { OpenRedact } from 'openredact';

const shield = new OpenRedact();

// Education example
const educationText = "Student S1234567 submitted exam registration EXAM-2024-5678";
console.log(shield.detect(educationText).redacted);
// Output: "Student [STUDENT_ID_9619] submitted exam registration [EXAM_REG_9478]"

// Retail example
const retailText = "Order ORD-1234567890 shipped with tracking TRACKING-1Z999AA10123456";
console.log(shield.detect(retailText).redacted);
// Output: "Order [ORDER_9619] shipped with tracking [TRACKING_9478]"

// Finance example
const financeText = "Transfer to GB82WEST12345698765432 reference WIRE-ABC123456789";
console.log(shield.detect(financeText).redacted);
// Output: "Transfer to [UK_IBAN_9619] reference [WIRE_9478]"
```
