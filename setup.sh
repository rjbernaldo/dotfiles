#!/bin/bash

# - install and sync dropbox
# - enable key repeat

# install os deps
./install-deps.sh

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

# franz
rm -rf $HOME/Library/Application\ Support/Franz/recipes/dev
mkdir -p $HOME/Library/Application\ Support/Franz/recipes
ln -sf $CWD/Franz/recipes/dev $HOME/Library/Application\ Support/Franz/recipes

