### update system
```
sudo pacman -Syyu
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
```

### pamac
```
pacman -S pamac
pamac build spotify
sudo ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/bin/spotify /usr/bin/spotify
sudo ln -sf /home/rj/Source/personal/dotfiles/manjaro-i3/bin/authy /usr/bin/authy
pamac build authy
```

### bat
```
pacman -S bat
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
```
