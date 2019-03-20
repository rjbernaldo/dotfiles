#!/bin/bash

# - install and sync dropbox
# - generate ssh key and add to github
# - enable key repeat

CWD=`pwd`

# zsh
rm $HOME/.zshrc
ln -sf $CWD/.zshrc $HOME/.zshrc

# vim
# npm i -g eslint babel-eslint

rm -rf $HOME/.vim
rm -f $HOME/.vimrc
rm -f $HOME/.eslintrc

ln -sf $CWD/.vim $HOME/.vim
ln -sf $CWD/.vimrc $HOME/.vimrc
ln -sf $CWD/.eslintrc.json $HOME/.eslintrc
rm /usr/local/bin/stream.sh
ln $CWD/stream.sh /usr/local/bin/stream.sh

# tmux
rm -f $HOME/.tmux.conf
ln -sf $CWD/.tmux.conf $HOME/.tmux.conf

# vscode
rm -f $HOME/Library/Application\ Support/Code/User/settings.json
ln -sf $CWD/settings.json $HOME/Library/Application\ Support/Code/User/settings.json
rm -f $HOME/Library/Application\ Support/Code/User/keybindings.json
ln -sf $CWD/keybindings.json $HOME/Library/Application\ Support/Code/User/keybindings.json

# alacritty
mkdir -p $HOME/.config/alacritty
ln -sf $CWD/alacritty.yml $HOME/.config/alacritty/alacritty.yml
