# My personal dotfiles for linux

## hyper
sudo apt-get install gdebi
wget https://hyper-updates.now.sh/download/linux_deb
gdebi linux_deb

## i3 (https://github.com/addy-dclxvi/i3-starterpack)
sudo apt-get install i3
sudo apt-get install i3-wm dunst i3lock i3status suckless-tools 

## zsh
sudo apt-get update
sudo apt install git-core zsh

## vim
sudo add-apt-repository ppa:jonathonf/vim
sudo apt update
sudo apt install vim

## tmux
sudo apt install -y automake
sudo apt install -y build-essential
sudo apt install -y pkg-config
sudo apt install -y libevent-dev
sudo apt install -y libncurses5-dev
rm -fr /tmp/tmux
git clone https://github.com/tmux/tmux.git /tmp/tmux
cd /tmp/tmux
git checkout master
sh autogen.sh
./configure && make
sudo make install
cd -
rm -fr /tmp/tmux

## steam
sudo apt-get install gdebi
wget http://repo.steampowered.com/steam/archive/precise/steam_latest.deb
sudo gdebi steam_latest.deb

## chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo gdebi google-chrome-stable_current_amd64.deb 

## nodejs
sudo apt-get update
sudo apt-get install build-essential libssl-dev
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh

# TODO: keyboard/trackpad configuration
## swap escape & caps
## natural scrolling for trackpad only
.Xresources

## volume keys (https://askubuntu.com/questions/794403/media-keys-on-macbook-pro-and-i3)
## brightness keys (https://cialu.net/brightness-control-not-work-i3wm/)
wget https://github.com/haikarainen/light/releases/download/v1.2/light-1.2.tar.gz
tar xf light-1.2.tar.gz
cd light-1.2/
./configure && make
sudo make install

## super+s, super+v, super+t, super+w