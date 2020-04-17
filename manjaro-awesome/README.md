### video card https://wiki.manjaro.org/index.php/Configure_Graphics_Cards
```
sudo mhwd -a pci nonfree 0380
```

### zsh
```
sudo pacman zsh
sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

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

### node
```
rm -rf /usr/bin/node
rm -rf /usr/bin/npm
curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
curl -L https://git.io/n-install | bash
source ~/.zshrc
```

### vscode
```
sudo pacman -S code
ln -sf /home/rj/Source/personal/dotfiles/vscode/settings.json /home/rj/.config/Code\ -\ OSS/User/settings.json
ln -sf /home/rj/Source/personal/dotfiles/vscode/keybindings.json /home/rj/.config/Code\ -\ OSS/User/keybindings.json

curl https://github.com/kencrocken/FiraCodeiScript > fira.zip then put it in ~/.local/share/fonts
install ayu color theme
```

### vim
```
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/vim/.vimrc /home/rj/.vimrc
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/vim/.vim /home/rj/.vim
```


### pamac
```
pacman -S pamac
```

### spotify
```
pamac build spotify
```

### authy
```
pamac build authy
```

### alacritty
```
pacman -S alacritty
git clone https://github.com/mhartington/oceanic-next-shell.git ~/.config/oceanic-next-shell
```

### bat
```
pacman -S bat
```

### dmenu
```
sudo pacman -S dmenu
```

### configuration
```
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/README.md /home/rj/README.md
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/.zshrc /home/rj/.zshrc
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/.config/.synergy.conf /home/rj/.config/.synergy.conf
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/.config/dmenu /home/rj/.config/dmenu
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/.config/pulse /home/rj/.config/pulse
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/.config/awesome /home/rj/.config/awesome
sudo ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/bin/spotify /usr/bin/spotify
sudo ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/bin/authy /usr/bin/authy
sudo ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/bin/terminal /usr/bin/terminal
```

### helpful config
> - https://www.overclock.net/how-to-get-the-best-sound-with-and-properly-configure-pulseaudio
> - https://www.reddit.com/r/linux/comments/akhwyr/tutorial_changing_pulseaudio_defaults_and_getting
