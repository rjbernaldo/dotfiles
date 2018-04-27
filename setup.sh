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

# tmux
rm -f $HOME/.tmux.conf
ln -sf $CWD/.tmux.conf $HOME/.tmux.conf

# vscode
rm -f $HOME/Library/Application\ Support/Code/User/settings.json
ln -sf $CWD/settings.json $HOME/Library/Application\ Support/Code/User/settings.json

# slate
ln -sf $CWD/.slate.js $HOME/.slate.js
