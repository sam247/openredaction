# @openredaction/cli

Command-line tool for PII detection, redaction, and pattern testing. Detects PII
in text, scans for severity breakdowns, records feedback for adaptive learning,
and exports/imports learned patterns.

## Installation

```bash
npm install -g @openredaction/cli
```

Requires Node >= 20.

## Usage

```bash
# Detect and redact PII
openredaction detect "Email john@example.com or SSN 123-45-6789"

# Scan with severity breakdown
openredaction scan "Call 555-123-4567 for details"

# Use a compliance preset
openredaction detect "Patient SSN: 123-45-6789" --preset hipaa

# Output as JSON
openredaction detect "Email john@example.com" --json
```

## Commands

| Command                  | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `detect <text>`          | Detect and redact PII in text                    |
| `scan <text>`            | Scan for PII with severity breakdown             |
| `feedback <type> <text>` | Record false-positive or false-negative feedback |
| `stats`                  | Show learning statistics                         |
| `export`                 | Export learned patterns to stdout                |
| `import <file>`          | Import learned patterns from JSON file           |
| `init`                   | Create default config file                       |

## Options

| Option               | Description                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `--preset <name>`    | Compliance preset (gdpr, hipaa, ccpa, finance, education, healthcare, transport-logistics) |
| `--patterns <types>` | Comma-separated pattern types to use                                                       |
| `--no-names`         | Exclude name detection                                                                     |
| `--no-emails`        | Exclude email detection                                                                    |
| `--no-phones`        | Exclude phone detection                                                                    |
| `--no-addresses`     | Exclude address detection                                                                  |
| `--json`             | Output as JSON                                                                             |

## Pattern Testing

The package also installs `openredaction-test-pattern` for validating regex
patterns used in custom detectors:

```bash
openredaction-test-pattern validate "\b\d{3}-\d{2}-\d{4}\b"
```

## License

MIT
