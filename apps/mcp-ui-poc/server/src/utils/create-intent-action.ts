/**
 * Standard intent structure for MCP-UI components.
 *
 * Intents are user actions that bubble up from embedded components.
 * The description field is a human-readable message that Claude can
 * interpret directly, removing the need for client-side interpretation.
 */
export interface Intent {
  /** Intent type identifier (e.g., "view_details", "add_to_cart", "checkout") */
  type: string;

  /**
   * Human-readable description of what the user wants to do.
   * This is what Claude will see and interpret.
   * Should be written as if the user is speaking to Claude.
   */
  description: string;

  /**
   * Structured payload with intent-specific data.
   * Claude can use this for tool calls or context.
   */
  payload: Record<string, unknown>;
}

/**
 * Creates a standardized intent action object that can be emitted
 * from UI components via the MCP-UI action channel.
 *
 * The intent action follows the format:
 * {
 *   type: "intent",
 *   intent: { type, description, payload }
 * }
 *
 * @param intent - The intent configuration
 * @returns JSON string representation of the intent action
 */
export function createIntentAction(intent: Intent): string {
  const action = {
    type: "intent",
    intent,
  };
  return JSON.stringify(action);
}
