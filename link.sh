#!/bin/bash

CWD=`pwd`

ln -sf $CWD/.zshrc $HOME/.zshrc
ln -sf $CWD/.tmux.conf $HOME/.tmux.conf
ln -sf $CWD/.vim $HOME/.vim
ln -sf $CWD/.vimrc $HOME/.vimrc
ln -sf $CWD/settings.json $HOME/Library/Application\ Support/Code/User/settings.json
ln -sf $CWD/Franz/Plugins $HOME/Library/Application\ Support/Franz
ln -sf $CWD/.eslintrc $HOME/.eslintrc
