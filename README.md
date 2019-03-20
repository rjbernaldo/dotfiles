# My personal dotfiles

Brew
- /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

System
- brew install zsh
- sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
- brew install node
- brew install tmux
- brew install reattach-to-user-namespace
- brew install vim (https://github.com/Yggdroot/indentLine/issues/59)
- brew cask install alacritty

Golang (http://sourabhbajaj.com/mac-setup/Go/README.html)
- brew install golang
- sudo mkdir -p $GOPATH $GOPATH/src $GOPATH/pkg $GOPATH/bin

Misc CLI (https://remysharp.com/2018/08/23/cli-improved)
- brew install bat
- brew install fzf
- $(brew --prefix)/opt/fzf/install
- brew install tldr
- brew install ripgrep

VIM
- git clone https://github.com/mhartington/oceanic-next-shell.git ~/.config/oceanic-next-shell
Font
- https://github.com/kencrocken/FiraCodeiScript


macOS
- defaults write com.apple.finder AppleShowAllFiles YES
- defaults write -g ApplePressAndHoldEnabled -bool false

Desktop
- https://github.com/the0neyouseek/MonitorControl
- http://mizage.com/divvy
- https://www.notion.so

Link config files
- ./setup.sh

Work
- npm i -g babel-eslint eslint
- npm i -g code-push-cli
- npm i -g node-gyp
- npm i -g pm2
- npm i -g nodemon
- brew install watchman

