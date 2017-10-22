#!/bin/bash

CWD=`pwd`

# zsh
ln -sf $CWD/.zshrc $HOME/.zshrc

# vim
npm i -g eslint babel-eslint
ln -sf $CWD/.vim $HOME/.vim
ln -sf $CWD/.vimrc $HOME/.vimrc
ln -sf $CWD/.eslintrc.json $HOME/.eslintrc

# tmux
ln -sf $CWD/.tmux.conf $HOME/.tmux.conf

# vscode
ln -sf $CWD/settings.json $HOME/Library/Application\ Support/Code/User/settings.json

# franz
ln -sf $CWD/Franz/Plugins $HOME/Library/Application\ Support/Franz

