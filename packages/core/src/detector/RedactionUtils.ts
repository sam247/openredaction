export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function restoreRedacted(
  redactedText: string,
  redactionMap: Record<string, string>,
): string {
  let restored = redactedText;

  for (const [placeholder, value] of Object.entries(redactionMap)) {
    restored = restored.replace(
      new RegExp(escapeRegex(placeholder), "g"),
      value,
    );
  }

  return restored;
}
