/**
 * Security utilities for validating and sanitizing inputs/outputs
 * Implements MCP specification security requirements
 *
 * Approach:
 * - URL validation: Uses validator.js (battle-tested, 6M+ weekly downloads)
 * - Text sanitization: Simple custom code (textContent is inherently safe)
 * - Object validation: Handled by Zod schemas
 */

import validator from "validator";

// ============================================================
// URL VALIDATION (using validator.js)
// ============================================================

/**
 * Validates URL is safe for use in image src attributes
 * Uses validator.js to prevent javascript:, data:, and other dangerous protocols
 *
 * @param url - URL to validate
 * @returns true if URL is safe, false otherwise
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return false;
  }

  // Use validator.js for comprehensive URL validation
  // Allow http, https, and protocol-relative URLs (//)
  return validator.isURL(trimmed, {
    protocols: ["http", "https"],
    require_protocol: false, // Allow relative URLs and protocol-relative
    allow_protocol_relative_urls: true,
    require_valid_protocol: true,
  });
}

/**
 * Validates and sanitizes a URL for image usage
 * Throws error if URL is invalid
 *
 * @param url - URL to validate
 * @param fieldName - Name of the field (for error messages)
 * @returns Validated URL
 * @throws Error if URL is invalid or uses dangerous protocol
 */
export function validateImageUrl(url: string, fieldName = "url"): string {
  if (!isValidImageUrl(url)) {
    throw new Error(
      `Invalid ${fieldName}: Must be a valid HTTP/HTTPS URL or relative path. Dangerous protocols (javascript:, data:, file:) are not allowed.`
    );
  }
  return url.trim();
}

// ============================================================
// TEXT SANITIZATION (simple custom code)
// ============================================================

/**
 * Sanitizes text content to prevent issues
 * NOTE: We use textContent (not innerHTML), so XSS is already prevented by the DOM.
 * This function just enforces length limits and removes problematic characters.
 *
 * @param text - Text to sanitize
 * @param maxLength - Maximum allowed length (default: 10000)
 * @returns Sanitized text
 */
export function sanitizeTextContent(text: string, maxLength = 10000): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  // Trim and enforce length limit to prevent DoS
  let sanitized = text.trim().slice(0, maxLength);

  // Replace null bytes (can cause truncation issues in some contexts)
  sanitized = sanitized.replace(/\0/g, "");

  return sanitized;
}

/**
 * Validates and sanitizes a required text field
 * Throws error if text is empty after sanitization
 *
 * @param text - Text to validate
 * @param fieldName - Name of the field (for error messages)
 * @param maxLength - Maximum allowed length
 * @returns Sanitized text
 * @throws Error if text is empty or invalid
 */
export function validateRequiredText(
  text: string,
  fieldName = "text",
  maxLength = 10000
): string {
  const sanitized = sanitizeTextContent(text, maxLength);

  if (sanitized.length === 0) {
    throw new Error(`${fieldName} is required and cannot be empty`);
  }

  return sanitized;
}

/**
 * Validates and sanitizes optional text field
 * Returns undefined if text is empty
 *
 * @param text - Text to validate
 * @param maxLength - Maximum allowed length
 * @returns Sanitized text or undefined
 */
export function validateOptionalText(
  text: string | undefined,
  maxLength = 10000
): string | undefined {
  if (!text || typeof text !== "string") {
    return undefined;
  }

  const sanitized = sanitizeTextContent(text, maxLength);
  return sanitized.length > 0 ? sanitized : undefined;
}
