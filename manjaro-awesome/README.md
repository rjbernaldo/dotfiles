- spotify
```
pacman -S pamac
pamac build spotify
```

- alacritty
```
pacman -S alacritty
git clone https://github.com/mhartington/oceanic-next-shell.git ~/.config/oceanic-next-shell
```
then ln -s `/usr/bin/terminal`

- dmenu
```
sudo pacman -S dmenu
```

- conf files
```
.config/.synergy.conf
.config/pulse
.config/awesome (removed some collision keys)
.config/dmenu
```

- sound links
https://www.overclock.net/how-to-get-the-best-sound-with-and-properly-configure-pulseaudio/
https://www.reddit.com/r/linux/comments/akhwyr/tutorial_changing_pulseaudio_defaults_and_getting/


- authy
```
pamac build authy
```
then ln -s `/usr/bin/authy`

- configuration
```
ln -sf /home/rj/Source/personal/dotfiles/manjaro-awesome/README.md /home/rj/README.md
```
