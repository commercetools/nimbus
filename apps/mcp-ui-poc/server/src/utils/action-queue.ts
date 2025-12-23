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

// Queue of pending actions
const actionQueue: PendingAction[] = [];

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
export function queueAction(action: Omit<PendingAction, "id" | "timestamp">) {
  const pendingAction: PendingAction = {
    ...action,
    id: `action-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    timestamp: Date.now(),
  };

  actionQueue.push(pendingAction);
  console.log(`📥 Queued action: ${action.toolName}`, pendingAction);

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
    console.log(`✅ Cleared action: ${actionId}`);
  }
}

/**
 * Clear all actions
 */
export function clearAllActions() {
  const count = actionQueue.length;
  actionQueue.length = 0;
  console.log(`✅ Cleared ${count} actions`);
}
