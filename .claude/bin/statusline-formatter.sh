#!/bin/bash

# Claude Code Statusline Formatter
# Formats token usage, context percentage, and session cost for display
# Input: JSON via stdin containing token and cost metrics
# Output: Formatted statusline string

set -euo pipefail

# Read JSON input from stdin
input=$(cat)

# Error handler for invalid JSON
trap 'echo "Error: Invalid statusline data" >&2; exit 1' ERR

# Function to format token counts with k/M notation
format_tokens() {
  local tokens=$1

  # Handle edge cases
  if [[ -z "$tokens" ]] || [[ "$tokens" == "null" ]]; then
    tokens=0
  fi

  # Convert string to number if needed
  tokens=${tokens%.*}  # Remove decimal portion if present
  tokens=$((tokens + 0))  # Force numeric interpretation

  # Format based on magnitude
  if (( tokens >= 1000000 )); then
    # Format as millions with 1 decimal place
    echo "$tokens" | awk '{printf "%.1fM", $1/1000000}'
  elif (( tokens >= 1000 )); then
    # Format as thousands with 1 decimal place
    echo "$tokens" | awk '{printf "%.1fk", $1/1000}'
  else
    # Display as integer for small values
    echo "$tokens"
  fi
}

# Function to format cost as USD
format_cost() {
  local cost=$1

  # Handle edge cases
  if [[ -z "$cost" ]] || [[ "$cost" == "null" ]]; then
    cost=0
  fi

  # Convert to number and format with 2 decimal places
  printf "%.2f" "$cost"
}

# Parse JSON with fallback values for missing fields
MODEL=$(echo "$input" | jq -r '.model.display_name // "Unknown"' 2>/dev/null || echo "Unknown")

TOTAL_INPUT=$(echo "$input" | jq -r '.context_window.total_input_tokens // 0' 2>/dev/null || echo "0")
TOTAL_OUTPUT=$(echo "$input" | jq -r '.context_window.total_output_tokens // 0' 2>/dev/null || echo "0")

# Get cache metrics - try cumulative first, fall back to per-request
# Try to find cumulative cache metrics in the context_window
CACHE_READ=$(echo "$input" | jq -r '.context_window.total_cache_read_input_tokens // .context_window.current_usage.cache_read_input_tokens // 0' 2>/dev/null || echo "0")
CACHE_CREATE=$(echo "$input" | jq -r '.context_window.total_cache_creation_input_tokens // .context_window.current_usage.cache_creation_input_tokens // 0' 2>/dev/null || echo "0")

# Convert to integers for arithmetic
CACHE_READ=${CACHE_READ%.*}
CACHE_READ=$((CACHE_READ + 0))
CACHE_CREATE=${CACHE_CREATE%.*}
CACHE_CREATE=$((CACHE_CREATE + 0))
TOTAL_CACHED=$((CACHE_READ + CACHE_CREATE))

# Get context window size
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size // 200000' 2>/dev/null || echo "200000")
CONTEXT_SIZE=${CONTEXT_SIZE%.*}
CONTEXT_SIZE=$((CONTEXT_SIZE + 0))

# Calculate context usage percentage using current_usage fields
# This represents the actual tokens in the context window after the last API call
TOTAL_INPUT=${TOTAL_INPUT%.*}
TOTAL_INPUT=$((TOTAL_INPUT + 0))
TOTAL_OUTPUT=${TOTAL_OUTPUT%.*}
TOTAL_OUTPUT=$((TOTAL_OUTPUT + 0))

# Get current_usage.input_tokens for accurate context calculation
CURRENT_INPUT=$(echo "$input" | jq -r '.context_window.current_usage.input_tokens // 0' 2>/dev/null || echo "0")
CURRENT_INPUT=${CURRENT_INPUT%.*}
CURRENT_INPUT=$((CURRENT_INPUT + 0))

# Context usage = current input + cached tokens (cache_read + cache_create)
CURRENT_USAGE=$((CURRENT_INPUT + TOTAL_CACHED))

# Separate cache metrics for display
CACHE_READ_FMT=$(format_tokens "$CACHE_READ")
CACHE_CREATE_FMT=$(format_tokens "$CACHE_CREATE")

# Calculate percentage, ensuring we don't divide by zero
if (( CONTEXT_SIZE > 0 )); then
  CONTEXT_PCT=$((CURRENT_USAGE * 100 / CONTEXT_SIZE))
else
  CONTEXT_PCT=0
fi

# Cap at 100% to avoid display issues
if (( CONTEXT_PCT > 100 )); then
  CONTEXT_PCT=100
fi

# Get cost
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0' 2>/dev/null || echo "0")

# Format token counts for display
INPUT_FMT=$(format_tokens "$TOTAL_INPUT")
OUTPUT_FMT=$(format_tokens "$TOTAL_OUTPUT")
COST_FMT=$(format_cost "$COST")

# Output the formatted statusline with unicode characters and pipe separators
printf "%s | → %s | ← %s | ↻ %s | ↓ %s | %d%% | 💰 \$%s" \
  "$MODEL" "$INPUT_FMT" "$OUTPUT_FMT" "$CACHE_READ_FMT" "$CACHE_CREATE_FMT" "$CONTEXT_PCT" "$COST_FMT"
