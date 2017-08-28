DISABLE_UPDATE_PROMPT="true"

# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

# Automatically start tmux
# if [ "$TMUX" = "" ]; then tmux; fi

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
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
plugins=(git ruby node)

source $ZSH/oh-my-zsh.sh

# User configuration

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
export PATH="$(ruby -rubygems -e 'puts Gem.user_dir')/bin:$PATH"
export PATH="${HOME}/.npm-global/bin:$PATH"
export PATH="~/bin:$PATH"
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
alias work='cd ~/Dropbox/Source/work && pwd'
alias personal='cd ~/Dropbox/Source/personal && pwd'
alias opensource='cd ~/Dropbox/Source/opensource && pwd'
alias sandbox='cd ~/Dropbox/Source/sandbox && pwd'
alias design='cd ~/Dropbox/Source/design && pwd'

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

alias psfind="ps -ef | grep"

if [[ ! $TERM =~ screen ]]; then
    tmux attach || tmux
fi
