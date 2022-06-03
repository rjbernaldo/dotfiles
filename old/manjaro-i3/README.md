### update system
```
sudo pacman -Syyu
```

### snmp
```
sudo pacman -S net-snmp
mkdir -p ~/.config/snmp
```
```
crontab -e
```
```
* * * * * snmpwalk -v 2c 192.168.1.113 -c public 'LM-SENSORS-MIB::lmTempSensorsValue.1' | grep -oE '[^ ]+$' > /home/rj/.config/snmp/cpu && killall -SIGUSR1 i3status
* * * * * snmpwalk -v 2c 192.168.1.113 -c public 'LM-SENSORS-MIB::lmTempSensorsValue.33' | grep -oE '[^ ]+$' > /home/rj/.config/snmp/mb && killall -SIGUSR1 i3status
```

### tmux
```
sudo pacman -S tmux
ln -sf /home/rj/Source/personal/dotfiles/.tmux.conf /home/rj/.tmux.conf
```

### unraid (not sure if the below will work)
```
echo "ein    /home/ein    9p  trans=virtio,version=9p2000.L,_netdev,rw 0 0" > /etc/fstab
```

### copy .ssh folder
```
chmod 700 ~/.ssh
chmod 600 ~/.ssh/*
```

### shotwell
```
sudo pacman -S shotwell
# then import photos from share
```

### zsh
```
sudo pacman zsh
sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

### node
```
rm -rf /usr/bin/node
rm -rf /usr/bin/npm
rm -rf /home/rj/n
curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
curl -L https://git.io/n-install | bash
source ~/.zshrc
```

### vscode
```
sudo pacman -S code
ln -sf /home/rj/Source/personal/dotfiles/vscode/settings.json /home/rj/.config/Code\ -\ OSS/User/settings.json
ln -sf /home/rj/Source/personal/dotfiles/vscode/keybindings.json /home/rj/.config/Code\ -\ OSS/User/keybindings.json

curl https://github.com/kencrocken/FiraCodeiScript
mkdir -p ~/.local/share/fonts
# then put it in ~/.local/share/fonts
# install ayu color theme
# install vimium

# install sf pro font?
# https://securitronlinux.com/debian-testing/install-mac-osx-fonts-on-linux-easily/
# change font on ~/.Xresources & ~/.i3/config
```

### pamac
```
pacman -S pamac
pamac build spotify
pamac build ferdi
pamac build google-chrome
pamac build authy
sudo ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/bin/authy /usr/bin/authy
```

### mongodb
```
sudo mkdir -p /data/db
sudo chmod -R go+w /data/db
pamac build mongodb-bin # https://wiki.archlinux.org/index.php/MongoDB#Installation
pamac build mongodb-tools-bin # for mongodump/mongorestore
sudo ln -sf /usr/bin/mongodump /usr/local/bin/mongodump
sudo ln -sf /usr/bin/mongorestoer /usr/local/bin/mongorestore
ulimit -n 65536 && mongo
```

### bat
```
pacman -S bat
```

### fix audio!
```
install_pulse # built in script for manjaro i3
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/.config/pulse /home/rj/.config/pulse
```

### alacritty
```
pacman -S alacritty
ln -sf /home/rj/.alacritty.yml /home/rj/Source/personal/dotfiles/manjaro-i3/.alacritty.yml
sudo ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/bin/terminal /usr/bin/terminal
```

### configuration
```
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/README.md /home/rj/README.md
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/.zshrc /home/rj/.zshrc
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/.config/.synergy.conf /home/rj/.config/.synergy.conf
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/.Xresources /home/rj/.Xresources
ln -sf /home/rj/Source/personal/dotfiles/.i3 /home/rj/.i3
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/vim/.vimrc /home/rj/.vimrc
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/vim/.vim /home/rj/.vim
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/.profile /home/rj/.profile
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/.config/dunst /home/rj/.config/dunst

mv ~/.ssh ~/.ssh.old
mv ~/Desktop ~/Desktop.old
mv ~/Downloads ~/Downloads.old
mv ~/Pictures ~/Pictures.old
ln -sf /home/ein/software/manjaro/i3/.ssh /home/rj/.ssh
ln -sf /home/ein/software/manjaro/i3/Desktop /home/rj/Desktop
ln -sf /home/ein/software/manjaro/i3/Downloads /home/rj/Downloads
ln -sf /home/ein/software/manjaro/i3/Pictures /home/rj/Pictures
ln -sf /home/ein/software/manjaro/i3/Documents /home/rj/Documents
```

### nvim
```
# install fzf?
sudo pacman -S ripgrep
pacman -S neovim
ln -s /home/rj/.vim /home/rj/.config/nvim
ln -s /home/rj/.vimrc /home/rj/.config/nvim/init.vim
cd /home/rj/.vim/bundle
git clone git@github.com:dense-analysis/ale.git
git clone git@github.com:rjbernaldo/dotfiles.git
git clone git@github.com:junegunn/fzf.vim.git
git clone git@github.com:preservim/nerdtree.git
git clone https://github.com/vim-airline/vim-airline.git
git clone git@github.com:christoomey/vim-tmux-navigator.git
git clone https://github.com/neoclide/coc.nvim.git
cd /home/rj/.vim/bundle/coc.nvim && npm i
```

``` time synchronisation
https://forum.manjaro.org/t/enable-time-synchronisation-by-default/99589/3
```

```
git clone vim bundles...
ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/.Xmodmap /home/rj/.Xmodmap
```


