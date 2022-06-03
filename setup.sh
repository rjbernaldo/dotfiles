#!/bin/bash

# - install and sync dropbox
# - generate ssh key and add to github
# - enable key repeat

CWD=`pwd`

# zsh
rm $HOME/.zshrc
ln -sf $CWD/.zshrc $HOME/.zshrc

# vim
rm -rf $HOME/.vim
rm -f $HOME/.vimrc

ln -sf $CWD/vim/.vim $HOME/.vim
ln -sf $CWD/vim/.vimrc $HOME/.vimrc

# tmux
rm -f $HOME/.tmux.conf
ln -sf $CWD/.tmux.conf $HOME/.tmux.conf

# hyper.is
rm -f $HOME/.hyper.js
ln -sf $CWD/.hyper.js $HOME/.hyper.js

# global npm
# rm -f $HOME/.eslintrc
# ln -sf $CWD/npm/.eslintrc.json $HOME/.eslintrc
