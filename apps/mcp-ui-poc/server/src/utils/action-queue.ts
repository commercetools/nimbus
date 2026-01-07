/**
 * Action Queue for handling UI-triggered MCP tool calls
 *
 * When a user clicks a button in Remote DOM UI, we need to:
 * 1. Capture the click event
 * 2. Queue an action for Claude to execute
 * 3. Return the queued action so Claude can see it
 * 4. Claude executes the MCP tool
 * 5. Result is displayed in UI
 */

export interface PendingAction {
  id: string;
  type: "mcp-tool-call";
  toolName: string;
  params: Record<string, unknown>;
  uri: string;
  timestamp: number;
}

// Callback type for action completion
type ActionCallback = (result: unknown, error?: unknown) => void;

// Queue of pending actions
const actionQueue: PendingAction[] = [];

// Callbacks for action completion
const actionCallbacks = new Map<string, ActionCallback>();

// Callback for broadcasting action notifications
let actionNotificationBroadcaster: ((action: PendingAction) => void) | null =
  null;

/**
 * Set the broadcaster for action notifications
 */
export function setActionBroadcaster(
  broadcaster: (action: PendingAction) => void
) {
  actionNotificationBroadcaster = broadcaster;
}

/**
 * Add an action to the queue and broadcast notification
 */
export function queueAction(
  action: Omit<PendingAction, "id" | "timestamp">,
  onComplete?: ActionCallback
) {
  const pendingAction: PendingAction = {
    ...action,
    id: `action-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    timestamp: Date.now(),
  };

  actionQueue.push(pendingAction);

  // Store callback if provided
  if (onComplete) {
    actionCallbacks.set(pendingAction.id, onComplete);
  }

  // Broadcast to clients via WebSocket
  if (actionNotificationBroadcaster) {
    actionNotificationBroadcaster(pendingAction);
  }

  return pendingAction;
}

/**
 * Get all pending actions
 */
export function getPendingActions(): PendingAction[] {
  return [...actionQueue];
}

/**
 * Clear a specific action after execution
 */
export function clearAction(actionId: string) {
  const index = actionQueue.findIndex((a) => a.id === actionId);
  if (index !== -1) {
    actionQueue.splice(index, 1);
  }
}

/**
 * Clear all actions
 */
export function clearAllActions() {
  actionQueue.length = 0;
  actionCallbacks.clear();
}

/**
 * Handle action response from client
 * Executes the registered callback if one exists
 */
export function handleActionResponse(
  actionId: string,
  result?: unknown,
  error?: unknown
) {
  const callback = actionCallbacks.get(actionId);
  if (callback) {
    try {
      callback(result, error);
    } catch (callbackError) {
      console.error(
        `❌ Error executing callback for ${actionId}:`,
        callbackError
      );
    }
    actionCallbacks.delete(actionId);
  }

  clearAction(actionId);
}
