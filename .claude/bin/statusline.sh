#!/bin/bash

# Claude Code Custom Status Line
# v3.5.0 - Conditional session cost display (only shown when history cleared)
# Shows: Model | Repo:Branch [commit] message | GitHub | git status | lines changed
#        Context bricks | percentage | duration | cost
#
# Uses new current_usage field (Claude Code 2.0.70+) for accurate context tracking.
# Cost shows: $X.XX when history not cleared, $X.XX ($Y.YY) when history cleared (/clear used).
# See: https://code.claude.com/docs/en/statusline#context-window-usage

# Read JSON from stdin
input=$(cat)

# Parse Claude data
model=$(echo "$input" | jq -r '.model.display_name // "Claude"' | sed 's/Claude //')
current_dir=$(echo "$input" | jq -r '.workspace.current_dir // env.PWD')
lines_added=$(echo "$input" | jq -r '.cost.total_lines_added // 0')
lines_removed=$(echo "$input" | jq -r '.cost.total_lines_removed // 0')

# Get git information (change to workspace directory)
cd "$current_dir" 2>/dev/null || cd "$HOME"

# Check if we're in a git repo
if git rev-parse --git-dir > /dev/null 2>&1; then
    repo_name=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" || echo "")
    branch=$(git branch --show-current 2>/dev/null || echo "detached")
    commit_short=$(git rev-parse --short HEAD 2>/dev/null || echo "")
    commit_msg=$(git log -1 --pretty=%s 2>/dev/null | cut -c1-40 || echo "")

    # Get GitHub repo (if remote exists)
    github_url=$(git config --get remote.origin.url 2>/dev/null)
    if [[ $github_url =~ github.com[:/](.+/.+)(\.git)?$ ]]; then
        github_repo="${BASH_REMATCH[1]%.git}"
    else
        github_repo=""
    fi

    # Git status indicators
    git_status=""
    if [[ -n $(git status --porcelain 2>/dev/null) ]]; then
        git_status="*"
    fi

    # Check ahead/behind remote
    upstream=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null)
    if [[ -n "$upstream" ]]; then
        ahead=$(git rev-list --count "$upstream"..HEAD 2>/dev/null || echo "0")
        behind=$(git rev-list --count HEAD.."$upstream" 2>/dev/null || echo "0")
        [[ "$ahead" -gt 0 ]] && git_status="${git_status}↑${ahead}"
        [[ "$behind" -gt 0 ]] && git_status="${git_status}↓${behind}"
    fi
else
    repo_name="no-repo"
    branch=""
    commit_short=""
    commit_msg=""
    github_repo=""
    git_status=""
fi

# Build Context Line: Model + Context bricks + session info
# Get session duration (convert ms to HHh MMm format)
duration_ms=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')
duration_hours=$((duration_ms / 3600000))
duration_min=$(((duration_ms % 3600000) / 60000))

# Get session cost (only show if > 0, for API users)
# Track cost relative to baseline (resets after /clear)
session_id=$(echo "$input" | jq -r '.session_id // "default"')
cost_state_file="/tmp/claude-cost-baseline-${session_id}"
total_cost_usd=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# Initialize baseline on first run or after /clear
if [[ ! -f "$cost_state_file" ]]; then
    # First run: baseline is current cost
    baseline_cost="$total_cost_usd"
    echo "$baseline_cost" > "$cost_state_file"
else
    # Read previous baseline
    baseline_cost=$(cat "$cost_state_file" 2>/dev/null || echo "0")

    # Detect if /clear was used (cost decreased or stayed same while we expected increase)
    if command -v bc &> /dev/null; then
        cost_decreased=$(echo "$total_cost_usd < $baseline_cost" | bc -l 2>/dev/null || echo "0")

        # If cost decreased, user ran /clear - reset baseline
        if [[ "$cost_decreased" -eq 1 ]]; then
            baseline_cost="$total_cost_usd"
            echo "$baseline_cost" > "$cost_state_file"
        fi
    fi
fi

# Calculate conversation cost (delta from baseline)
if command -v bc &> /dev/null; then
    cost_usd=$(echo "$total_cost_usd - $baseline_cost" | bc -l 2>/dev/null || echo "0")
else
    cost_usd="$total_cost_usd"
fi

# Get context window data using new current_usage field (Claude Code 2.0.70+)
total_tokens=$(echo "$input" | jq -r '.context_window.context_window_size // 200000')
current_usage=$(echo "$input" | jq -r '.context_window.current_usage // null')

if [[ "$current_usage" != "null" ]]; then
    # Use accurate current_usage data
    input_tokens=$(echo "$current_usage" | jq -r '.input_tokens // 0')
    cache_creation=$(echo "$current_usage" | jq -r '.cache_creation_input_tokens // 0')
    cache_read=$(echo "$current_usage" | jq -r '.cache_read_input_tokens // 0')

    # Calculate actual current context usage
    used_tokens=$((input_tokens + cache_creation + cache_read))
else
    # Fallback: no current_usage available yet (first message or older version)
    used_tokens=0
fi

# Calculate metrics
free_tokens=$((total_tokens - used_tokens))
if [[ $total_tokens -gt 0 ]]; then
    usage_pct=$(( (used_tokens * 100) / total_tokens ))
else
    usage_pct=0
fi

# Convert to 'k' format for display
used_k=$(( used_tokens / 1000 ))
total_k=$(( total_tokens / 1000 ))
free_k=$(( free_tokens / 1000 ))

# Generate brick visualization (30 bricks total)
total_bricks=32
if [[ $total_tokens -gt 0 ]]; then
    used_bricks=$(( (used_tokens * total_bricks) / total_tokens ))
else
    used_bricks=0
fi
free_bricks=$((total_bricks - used_bricks))

# Determine model badge colors based on model type
model_upper=$(echo "$model" | tr '[:lower:]' '[:upper:]')
if echo "$model" | grep -qi "haiku"; then
    # Haiku: Green background, white text
    model_badge="\033[48;2;0;170;0m\033[97m $model_upper \033[0m"
elif echo "$model" | grep -qi "sonnet"; then
    # Sonnet: Yellow background, black text
    model_badge="\033[48;2;255;170;0m\033[30m $model_upper \033[0m"
elif echo "$model" | grep -qi "opus"; then
    # Opus: Red background, white text
    model_badge="\033[48;2;204;0;0m\033[97m $model_upper \033[0m"
else
    # Default: Cyan text in brackets
    model_badge="\033[1;36m[$model_upper]\033[0m"
fi

# Build brick line with Model badge and single colour (cyan for used, dim white for free)
brick_line="${model_badge} | "

# Used bricks with gradient coloring based on position
# 0-70% = green, 70-80% = yellow, 80-100% = red
green_threshold=$(( (total_bricks * 70) / 100 ))  # ~22 bricks
yellow_threshold=$(( (total_bricks * 80) / 100 )) # ~26 bricks

for ((i=0; i<used_bricks; i++)); do
    if [[ $i -lt $green_threshold ]]; then
        brick_line+="\033[0;32m█\033[0m"  # Green
    elif [[ $i -lt $yellow_threshold ]]; then
        brick_line+="\033[0;33m█\033[0m"  # Yellow
    else
        brick_line+="\033[0;31m█\033[0m"  # Red
    fi
done

# Free bricks (dim light shade blocks)
for ((i=0; i<free_bricks; i++)); do
    brick_line+="\033[2;37m░\033[0m"
done

brick_line+=" | \033[1m${usage_pct}%\033[0m (${used_k}k/${total_k}k)"

# Add free space with color based on remaining percentage
# >30% free = Green, 20-30% free = Yellow, <20% free = Red
free_pct=$((100 - usage_pct))
if [[ $free_pct -gt 30 ]]; then
    free_color="\033[1;32m"  # Green - safe
elif [[ $free_pct -gt 20 ]]; then
    free_color="\033[1;33m"  # Yellow - caution
else
    free_color="\033[1;31m"  # Red - critical
fi
brick_line+=" | ${free_color}${free_k}k free\033[0m"

# Add duration (HHh MMm format)
brick_line+=" | ${duration_hours}h ${duration_min}m"

# Add cost with session total only if history was cleared (conversation_cost != session_cost)
if command -v bc &> /dev/null; then
    # Check if session cost is non-zero
    if (( $(echo "$total_cost_usd > 0" | bc -l 2>/dev/null || echo "0") )); then
        # Format both conversation cost and total session cost using bc for proper decimal handling
        conversation_cost=$(echo "scale=2; $cost_usd / 1" | bc -l 2>/dev/null || echo "0.00")
        session_cost=$(echo "scale=2; $total_cost_usd / 1" | bc -l 2>/dev/null || echo "0.00")

        # Ensure we have leading zero for values like .45 -> 0.45
        [[ "$conversation_cost" =~ ^\. ]] && conversation_cost="0${conversation_cost}"
        [[ "$session_cost" =~ ^\. ]] && session_cost="0${session_cost}"

        # Only show session cost in parentheses if history was cleared (costs differ)
        if [[ "$conversation_cost" != "$session_cost" ]]; then
            brick_line+=" | \033[0;33m💰 \$${conversation_cost} (\$${session_cost})\033[0m"
        else
            brick_line+=" | \033[0;33m💰 \$${conversation_cost}\033[0m"
        fi
    fi
else
    # Fallback without bc: simple string comparison
    if [[ "$total_cost_usd" != "0" && "$total_cost_usd" != "0.0" && "$total_cost_usd" != "0.00" && -n "$total_cost_usd" ]]; then
        # Only show session cost if different from conversation cost
        if [[ "$cost_usd" != "$total_cost_usd" ]]; then
            brick_line+=" | \033[0;33m💰 \$${cost_usd} (\$${total_cost_usd})\033[0m"
        else
            brick_line+=" | \033[0;33m💰 \$${cost_usd}\033[0m"
        fi
    fi
fi

# Output single line
echo -e "$brick_line"
