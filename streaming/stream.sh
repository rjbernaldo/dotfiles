#!/bin/sh

tmux split-window -h
tmux send-keys 'cd /Users/rj/Dropbox/Source/personal/upgrades.to' 'C-m'
tmux send-keys 'vim src/App.js' 'C-m'
tmux resize-pane -L 67
tmux select-pane -t 1
tmux split-window -v
tmux send-keys 'clear' 'C-m'
tmux send-keys 'urtimer -s 1500'
tmux resize-pane -D 21
tmux select-pane -t 1
tmux split-window -v
tmux send-keys 'mongod' 'C-m'
tmux select-pane -t 1
tmux resize-pane -D 8
tmux select-pane -t 1
tmux split-window -v
tmux send-keys 'cd /Users/rj/Dropbox/Source/personal/serverless' 'C-m'
tmux send-keys 'clear' 'C-m'
tmux send-keys 'sls offline start --skipCacheInvalidation' 'C-m'
tmux select-pane -t 1
tmux send-keys 'cd /Users/rj/Dropbox/Source/personal/upgrades.to' 'C-m'
tmux send-keys 'clear' 'C-m'
tmux send-keys 'BROWSER=none npm start --assume-yes' 'C-m'
tmux select-pane -t 5
