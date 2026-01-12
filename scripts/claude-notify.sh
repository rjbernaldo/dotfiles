#!/bin/bash

# Read hook input from stdin
hook_input=$(cat)

# Extract transcript path
transcript_path=$(echo "$hook_input" | jq -r '.transcript_path')

# Get last assistant message with text content
if [[ -f "$transcript_path" ]]; then
  # Find last assistant message that contains text (not just tool_use)
  last_response=$(grep '"role":"assistant"' "$transcript_path" | grep '"type":"text"' | tail -1 | jq -r '.message.content[] | select(.type=="text") | .text' 2>/dev/null | head -1)

  # Get first sentence (up to first . ! or ?) max 100 chars
  first_sentence=$(echo "$last_response" | sed 's/[.!?].*/&/' | head -c 100)

  if [[ -n "$first_sentence" ]]; then
    terminal-notifier -message "$first_sentence" -title 'Claude' -activate com.mitchellh.ghostty
  else
    terminal-notifier -message 'Ready' -title 'Claude' -activate com.mitchellh.ghostty
  fi
else
  terminal-notifier -message 'Ready' -title 'Claude' -activate com.mitchellh.ghostty
fi
