import path from "path";

/**
 * Validates that a file path doesn't escape from the base directory.
 * Prevents path traversal attacks by ensuring the resolved path
 * stays within the intended base directory.
 *
 * @param baseDir - The base directory that the path must remain within
 * @param pathSegments - Path segments to join and validate
 * @returns The validated absolute path
 * @throws Error if path traversal is detected
 *
 * @example
 * ```typescript
 * // Valid path
 * validateFilePath('/app/routes', 'component-button.json')
 * // Returns: '/app/routes/component-button.json'
 *
 * // Invalid path (traversal attempt)
 * validateFilePath('/app/routes', '../../../etc/passwd')
 * // Throws: Error('Invalid file path: ../../../etc/passwd (traversal detected)')
 * ```
 */
export function validateFilePath(
  baseDir: string,
  ...pathSegments: string[]
): string {
  // Join all path segments
  const joined = path.join(...pathSegments);

  // Normalize to resolve any '..' sequences
  const normalized = path.normalize(joined);

  // Resolve to absolute path relative to base directory
  const resolved = path.resolve(baseDir, normalized);

  // Get absolute base directory path
  const absoluteBase = path.resolve(baseDir);

  // Ensure the resolved path starts with the base directory
  if (
    !resolved.startsWith(absoluteBase + path.sep) &&
    resolved !== absoluteBase
  ) {
    throw new Error(
      `Invalid file path: attempted to access '${joined}' outside base directory '${baseDir}'`
    );
  }

  return resolved;
}
