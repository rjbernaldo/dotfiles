### spotify
```
pacman -S pamac
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
then ln -s `/usr/bin/terminal`

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
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/bin/spotify /usr/bin/spotify
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/bin/authy /usr/bin/authy
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/bin/terminal /usr/bin/terminal
```

### helpful config
> https://www.overclock.net/how-to-get-the-best-sound-with-and-properly-configure-pulseaudio/
> https://www.reddit.com/r/linux/comments/akhwyr/tutorial_changing_pulseaudio_defaults_and_getting/
