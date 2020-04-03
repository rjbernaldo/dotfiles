# My personal dotfiles

Brew
- /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

System
- brew install zsh
- sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
- brew install tmux
- brew install reattach-to-user-namespace
- brew install vim (https://github.com/Yggdroot/indentLine/issues/59)

Node
- curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
- bash n lts

Misc CLI (https://remysharp.com/2018/08/23/cli-improved)
- brew install bat
- brew install fzf
- $(brew --prefix)/opt/fzf/install
- brew install tldr
- brew install ripgrep
- npm install -g n

VIM
- git clone https://github.com/mhartington/oceanic-next-shell.git ~/.config/oceanic-next-shell
Font
- https://github.com/kencrocken/FiraCodeiScript

macOS
- defaults write com.apple.finder AppleShowAllFiles YES
- defaults write -g ApplePressAndHoldEnabled -bool false

Desktop
- https://github.com/the0neyouseek/MonitorControl
- https://github.com/ianyh/Amethyst
- brew cask install ferdi
- nextcloud

Link config files
- ./setup.sh

Mongodb
- sudo mkdir -p /data/db
- sudo chmod -R go+w /data/db
- brew install mongodb

Work
- npm i -g babel-eslint eslint
- npm i -g code-push-cli
- npm i -g node-gyp
- npm i -g pm2
- npm i -g nodemon
- brew install watchman

