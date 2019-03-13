# My personal dotfiles

Brew
- /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

System
- brew install zsh
- sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
- brew install node
- brew install tmux
- brew install reattach-to-user-namespace
- brew install neovim
- brew install vim (https://github.com/Yggdroot/indentLine/issues/59)

https://remysharp.com/2018/08/23/cli-improved
- brew install bat
- brew install fzf
- $(brew --prefix)/opt/fzf/install
- brew install tldr

Shell
- git clone https://github.com/mhartington/oceanic-next-shell.git ~/.config/oceanic-next-shell

NPM modules installed:
- npm i -g babel-eslint eslint

macOS
- defaults write com.apple.finder AppleShowAllFiles YES
- defaults write -g ApplePressAndHoldEnabled -bool false

Font
- https://github.com/kencrocken/FiraCodeiScript

Work
- npm i -g code-push-cli
- npm i -g node-gyp
- npm i -g pm2
- npm i -g nodemon
- brew install watchman
```
node -v v9.11.1
npm -v v5.6.0
```

Link config files
- ./setup.sh

Desktop
- https://github.com/the0neyouseek/MonitorControl
- http://mizage.com/divvy
- https://www.notion.so

Golang (http://sourabhbajaj.com/mac-setup/Go/README.html)
- brew install golang
- sudo mkdir -p $GOPATH $GOPATH/src $GOPATH/pkg $GOPATH/bin
