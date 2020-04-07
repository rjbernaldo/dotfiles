# Dependencies

0) Read personal wiki at `personal-wiki.md`
```
CWD=`pwd`
ln -sf $CWD/wiki.md $HOME/wiki.md
```

1) Install Dependencies
- Update all packages
```
sudo pacman -Syyu
```

- Install Nextcloud (don't forget to ignore node_modules & .DS_Store)
```
pacman -S nextcloud-client
ln -sf $HOME/Nextcloud/Source $HOME/Source
ln -sf $HOME/Nextcloud/Documents $HOME/Documents
ln -sf $HOME/Nextcloud/Photos $HOME/Pictures
```

2) Install zsh
```
sudo pacman zsh
sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

4) Copy conf files
```
CWD=`pwd`
rm $HOME/.zshrc
ln -sf $CWD/.zshrc $HOME/.zshrc

rm -rf $HOME/.vim
rm -f $HOME/.vimrc

ln -sf $CWD/vim/.vim $HOME/.vim
ln -sf $CWD/vim/.vimrc $HOME/.vimrc

git clone https://github.com/mhartington/oceanic-next-shell.git ~/.config/oceanic-next-shell

rm -f $HOME/.synergy.conf
ln -sf $CWD/synergy.conf $HOME/.synergy.conf

rm -rf $HOME/.config
ln -sf $CWD/.config.manjaro $HOME/.config

rm -rf $HOME/.i3
ln -sf $CWD/.i3 $HOME/.i3
```

4) Install node
```
curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
curl -L https://git.io/n-install | zsh
source ~/.zshrc
```

5) vscode
```
sudo pacman -S code
```

6) mongodb
```
git clone https://aur.archlinux.org/mongodb-bin.git
cd mongodb-bin
makepkg -si
systemctl enable mongodb
systemctl start mongodb
cd ..
rm -rf mongodb-bin
```

7) style
- change font
```
sudo git clone https://github.com/kencrocken/FiraCodeiScript /usr/share/fonts/firacode
sudo cp /usr/share/fonts/firacode/* /usr/share/fonts/TTF
ln -sf $CWD/.Xresources $HOME/.Xresources
```
- change wallpaper
-
