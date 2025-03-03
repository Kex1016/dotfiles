<div align=center>

  <h1>my dotfiles</h1>

</div>

<br><br>

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Screenshot](#screenshot)
- [Software Used](#software-used)
- [Special Keybinds](#special-keybinds)
- [Special Scripts](#special-scripts)
- [Thank yous](#thank-yous)

## Introduction

Welcome to my dotfiles repository! This repository contains my personal dotfiles for Unix systems. I strive for efficiency, simplicity and some aesthetics if it's simple enough.

> [!NOTE]  
> This repo only exists because of the amazing [Speyll/dotfiles](https://github.com/Speyll/dotfiles). Thanks!

## Screenshot

![Screenshot](https://github.com/Kex1016/dotfiles/blob/main/extras/screenshot.png)

## Software Used

- `labwc` as window manager (compositor).
- `foot` Terminal emulator.
- `waybar` Status bar.
- `fuzzel` The application launcher menu.
- `pipewire` Audio server.
- `grim` For taking screenshots.
- `slurp` To select regions for screenshot capture.
- `wlsunset` For managing night mode settings.
- `wl-clipboard` For clipboard management.
- `cliphist` To access clipboard history.
- `swayimg` My image viewer.
- `fnott` Notification system.
- `mpv` Video player.
- `geany`, `nvim` & `nano` Text editor
- `noto-fonts-emoji`, `noto-fonts-ttf`, `noto-fonts-cjk`,`nerd-fonts-symbols-ttf`, `cascadia-mono` Fonts.
- `flavours` For setting base16 colors pretty much everywhere.

I will include an install script whenever I make it, for now these are more or less enough to get it working.

## Special Keybinds

- `Mod + Enter`: Open terminal (foot)
- `Mod + D`: Launch menu selector (fuzzel)
- `Mod + Q` or `Alt + F4`: Close focused window
- `Print Screen`: Take screenshot of selected area (slurp + grim)
- `Shift + Print Screen`: Take screenshot of selected output/monitor (slurp + grim)
- `Ctrl + Shift + Print Screen`: Take screenshot of entire workspace
- `Mod + Comma`: Access clipboard selector
- `Mod + Period`: Open emoji selector

## Special Scripts

I've crafted special script to simplify environment variable setup. This script streamline the process of launching your preferred wayland compositor with the right configurations.

- `start-comp`: Use this script to launch your compositor with configured environment variables, Example: `start-comp labwc`
- `fuzz-launcher`: If you want the same menu I use in my bar.

Additionally, there are other handy scripts available in `.local/bin`

## Thank yous

[`giuji/gruvbox-qt6ct`](https://github.com/giuji/gruvbox-qt6ct) for the qt5ct/qt6ct gruvbox color schemes, obviously.
[`marty-oehme/bemoji`](https://github.com/marty-oehme/bemoji), I love you

