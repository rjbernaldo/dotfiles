# My personal dotfiles

Brew
- /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

System
- brew install zsh
- sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
- brew install node
- brew install tmux
- brew install reattach-to-user-namespace

Dokku
- git clone git@github.com:dokku/dokku.git ~/.dokku
- cat ~/.ssh/NEW COMPUTER.pub | ssh root@dokku.me dokku ssh-keys:add COMPUTER_NAME (on main computer) 
```
remember to add digital ocean ip to /etc/hosts
```

Slate
- cd /Applications && curl http://www.ninjamonkeysoftware.com/slate/versions/slate-latest.tar.gz | tar -xz


NPM modules installed:
- npm i -g babel-eslint
- npm i -g eslint

macOS
- defaults write com.apple.finder AppleShowAllFiles YES
- defaults write -g ApplePressAndHoldEnabled -bool false

Font
- Download & install [Fira Code](https://github.com/tonsky/FiraCode)

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
