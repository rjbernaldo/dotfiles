#!/bin/bash

CWD=`pwd`

# streaming
rm -f /usr/local/bin/stream.sh
ln $CWD/stream.sh /usr/local/bin/stream.sh

# vscode
rm -f $HOME/Library/Application\ Support/Code/User/settings.json
ln -sf $CWD/settings.json $HOME/Library/Application\ Support/Code/User/settings.json
rm -f $HOME/Library/Application\ Support/Code/User/keybindings.json
ln -sf $CWD/keybindings.json $HOME/Library/Application\ Support/Code/User/keybindings.json