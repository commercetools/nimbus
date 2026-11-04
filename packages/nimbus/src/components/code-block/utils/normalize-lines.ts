/**
 * Splits code into lines on `\r\n`, `\n` and `\r`. One trailing line break
 * does not produce an extra empty line, so `"a\nb\n"` gives `["a", "b"]`.
 * Empty code gives no lines.
 */
export const normalizeLines = (code: string): string[] => {
  if (code === "") return [];
  const lines = code.split(/\r\n|\r|\n/);
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  return lines;
};
