DISABLE_UPDATE_PROMPT="true"

LC_CTYPE=en_US.UTF-8
LC_ALL=en_US.UTF-8

# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

# Automatically start tmux
# if [ "$TMUX" = "" ]; then tmux; fi

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
#BASE16_SHELL="$HOME/.config/oceanic-next-shell/oceanic-next.dark.sh"
#[[ -s $BASE16_SHELL ]] && source $BASE16_SHELL
TERM=xterm-256color

ZSH_THEME="nicoulaj"

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
#   DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
export UPDATE_ZSH_DAYS=1

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(
	git
	ruby
	node
	archlinux
	history-substring-search
	colored-man-pages
	zsh-autosuggestions
	zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh

# User configuration

export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH
# export PATH="$(ruby -rubygems -e 'puts Gem.user_dir')/bin:$PATH"
export PATH=$HOME/.npm-global/bin:$PATH
export PATH=$HOME/Library/Android/sdk/platform-tools:$PATH
# export PATH=$HOME/Library/Android/sdk/tools:$PATH
# export PATH="~/bin:$PATH"
#
export ANDROID_HOME=$HOME/Library/Android/sdk
alias emulator='$ANDROID_HOME/tools/emulator'

# export MANPATH="/usr/local/man:$MANPATH"
# export PATH=/usr/local/bin/android
# export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
# export PATH=/usr/local/bin:$PATH
# export PATH="/usr/local/Cellar/android-sdk/24.0.2/platform-tools:/usr/local/Cellar/android-sdk/24.0.2/tools:$PATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/dsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
# alias sourcefolder=cd ~/home/rj/Source

# virtualenv
# export WORKON_HOME=~/virtualenvs
# source /usr/local/bin/virtualenvwrapper.sh
alias future_commit='git commit --date "$(date -v +8H)"'
alias work='cd ~/Source/work && pwd'
alias personal='cd ~/Source/personal && pwd'
alias opensource='cd ~/Source/opensource && pwd'
alias sandbox='cd ~/Source/sandbox && pwd'
alias design='cd ~/Source/design && pwd'

alias dokku='bash $HOME/.dokku/contrib/dokku_client.sh'

alias cat='bat'

export DOKKU_HOST=174.138.63.37

alias gs='git status'
alias ga='git add'
alias gc='git clone'
alias gm='git commit'
alias gd='git diff'
alias gdd='git diff --word-diff'
alias gll='git log'
alias gl='git log --oneline --no-merges'
alias ggraph='git log --graph --all --decorate --stat --date=iso'
alias gpom='git push origin master'
alias gphm='git push heroku master'
alias gpdm='git push dokku master'
alias gsync='git fetch upstream && git checkout master && git merge upstream/master && git push origin master'
# alias cp-staging='code-push release-react blueshyft/BlueshyftPOS ios --deploymentName Staging --mandatory --targetBinaryVersion 2.5.1'
# alias cp-preflight='code-push promote blueshyft/BlueshyftPOS Staging Preflight --mandatory --targetBinaryVersion 2.5.1'
# alias cp-production='code-push promote blueshyft/BlueshyftPOS Preflight Production --mandatory --targetBinaryVersion 2.5.1'
# alias cp-staging2='code-push release-react blueshyft/BlueshyftPOS ios --deploymentName Staging --mandatory --targetBinaryVersion 2.5.2'
# alias cp-preflight2='code-push promote blueshyft/BlueshyftPOS Staging Preflight --mandatory --targetBinaryVersion 2.5.2'
# alias cp-production2='code-push promote blueshyft/BlueshyftPOS Preflight Production --mandatory --targetBinaryVersion 2.5.2'
# alias cp-rollback-pre='code-push rollback blueshyft/BlueshyftPOS Preflight'
# alias cp-rollback-prod='code-push rollback blueshyft/BlueshyftPOS Production'
alias cp-staging='code-push release-react blueshyft/BlueshyftPOS ios --deploymentName Staging --mandatory --targetBinaryVersion ">= 3.0.0 < 3.1.0"'
alias cp-preflight='code-push promote blueshyft/BlueshyftPOS Staging Preflight --mandatory --targetBinaryVersion ">= 3.0.0 < 3.1.0"'
alias cp-production='code-push promote blueshyft/BlueshyftPOS Preflight Production --mandatory --targetBinaryVersion ">= 3.0.0 < 3.1.0" && npm run bundle && npm run bugsnag:sourcemap'
alias cp-releases='code-push deployment ls blueshyft/BlueshyftPOS'
# alias cp-staging='code-push release-react blueshyft/BlueshyftPOS ios --deploymentName Staging --mandatory --targetBinaryVersion ">=2.5.2 <3.0.0"'
# alias cp-preflight='code-push promote blueshyft/BlueshyftPOS Staging Preflight --mandatory --targetBinaryVersion ">=2.5.2 <3.0.0"'
# alias cp-production='code-push promote blueshyft/BlueshyftPOS Preflight Production --mandatory --targetBinaryVersion ">=2.5.2 <3.0.0"'
# cd() {
#   chdir $1 && tmux rename-window ${PWD##*/}
# }

alias psfind="ps -ef | grep"
alias history-top="history | awk '{CMD[$2]++;count++;}END { for (a in CMD)print CMD[a] " " CMD[a]/count*100 "% " a;}' | grep -v "./" | column -c3 -s " " -t | sort -nr | nl | head -n10"

# if [[ ! $TERM =~ screen ]]; then
#     tmux
# fi
# if [[ ! $TERM =~ screen ]]; then
#     tmux attach || tmux
# fi

export PATH="$HOME/.bin:$PATH"
export PATH="/usr/local/opt/mongodb@3.4/bin:$PATH"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
export PATH="/usr/local/opt/node@8/bin:$PATH"

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

# GOLANG
#export GOPATH=$HOME/go-workspace # don't forget to change your path correctly!
export GOPATH=$HOME/Source/personal/go
export GOROOT=/usr/local/opt/go/libexec
export PATH=$PATH:$GOPATH/bin
export PATH=$PATH:$GOROOT/bin

# tabtab source for serverless package
# uninstall by removing these lines or running `tabtab uninstall serverless`
[[ -f /usr/local/lib/node_modules/serverless/node_modules/tabtab/.completions/serverless.zsh ]] && . /usr/local/lib/node_modules/serverless/node_modules/tabtab/.completions/serverless.zsh
# tabtab source for sls package
# uninstall by removing these lines or running `tabtab uninstall sls`
[[ -f /usr/local/lib/node_modules/serverless/node_modules/tabtab/.completions/sls.zsh ]] && . /usr/local/lib/node_modules/serverless/node_modules/tabtab/.completions/sls.zsh
# tabtab source for slss package
# uninstall by removing these lines or running `tabtab uninstall slss`
[[ -f /usr/local/lib/node_modules/serverless/node_modules/tabtab/.completions/slss.zsh ]] && . /usr/local/lib/node_modules/serverless/node_modules/tabtab/.completions/slss.zsh
export PATH="/usr/local/opt/gettext/bin:$PATH"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
export FZF_DEFAULT_COMMAND='rg --files --no-ignore --hidden --follow -g "!{.git,node_modules}/*" 2> /dev/null'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export PATH="/usr/local/opt/qt/bin:$PATH"
export PATH="/usr/local/opt/qt/bin:$PATH"
# export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_231`
export PATH="/Users/rj/.emacs.d/bin:$PATH"

# ----- vimode -----
export EDITOR="/usr/local/bin/vim -u NONE"
# bindkey '^?' backward-delete-char
# bindkey '^V' edit-command-line

# export ATHAME_VIMBED_LOCATION=$HOME/.vim/bundle/vimbed/plugin export ATHAME_ENABLED=1
export ATHAME_VIMBED_LOCATION=$HOME/.vim/bundle/vimbed/plugin export ATHAME_ENABLED=1
unset zle_bracketed_paste
alias mcom="wine /Users/rj/Library/Application\ Support/com.AxiTrader.MT4_155144006010282/drive_c/winebottler/metaeditor.exe /compile:Optimal.mq4"
export TERMINAL='alacritty'
