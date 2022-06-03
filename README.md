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

VIM
- git clone https://github.com/mhartington/oceanic-next-shell.git ~/.config/oceanic-next-shell
cd /Users/rj/.vim/bundle
git clone git@github.com:dense-analysis/ale.git
git clone git@github.com:junegunn/fzf.vim.git
git clone git@github.com:preservim/nerdtree.git
git clone https://github.com/vim-airline/vim-airline.git
git clone git@github.com:christoomey/vim-tmux-navigator.git
git@github.com:edkolev/tmuxline.vim.git
git@github.com:ayu-theme/ayu-vim.git

Font
- https://github.com/kencrocken/FiraCodeiScript

macOS
- defaults write com.apple.finder AppleShowAllFiles YES
- defaults write -g ApplePressAndHoldEnabled -bool false

Link config files
- ./setup.sh

Mongodb
- sudo mkdir -p /data/db
- sudo chmod -R go+w /data/db
- brew install mongodb


Latest
https://stackoverflow.com/questions/61677951/why-n-throws-error-error-sudo-required-or-change-ownership-or-define-n-prefi
https://vicentereyes.org/setting-up-my-macos-development-environment-for-2022

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# Eh

Work
- npm i -g babel-eslint eslint
- npm i -g code-push-cli
- npm i -g node-gyp
- npm i -g pm2
- npm i -g nodemon
- brew install watchman

Misc CLI (https://remysharp.com/2018/08/23/cli-improved)
- brew install bat
- brew install fzf
- $(brew --prefix)/opt/fzf/install
- brew install tldr
- brew install ripgrep
- npm install -g n
