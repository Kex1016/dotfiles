<div align=center>

  <h1>my dotfiles</h1>

</div>

<br><br>

## Table of Contents
- [Introduction](#introduction)
- [Screenshot](#screenshot)
- [Software Used](#software-used)
- [Special Scripts](#special-scripts)

## Introduction

Welcome to my dotfiles repository! This repository contains my personal dotfiles for Unix systems. I strive for efficiency, simplicity and some aesthetics if it's simple enough.

> [!NOTE]  
> This repo only exists because of the amazing [Speyll/dotfiles](https://github.com/Speyll/dotfiles). Thanks!

## Screenshot

Once I make one I will put it here.

## Software Used

  - `labwc` as window manager (compositor).
  - `foot` Terminal emulator.
  - `waybar` Status bar.
  - `fuzzel` The application launcher menu.
  - `pipewire` Audio server.
  - `grim` For taking screenshots.
  - `slurp` To select regions for screenshot capture.
  - `brightnessctl` Tool to control screen brightness.
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
- `Mod + Shift + Q` or `Alt + F4`: Close focused window
- `Print Screen`: Take screenshot of selected area (slurp + grim)
- `Mod + Comma`: Access clipboard selector
- `Mod + Period`: Open emoji selector

## Special Scripts

I've crafted special script to simplify environment variable setup. This script streamline the process of launching your preferred wayland compositor with the right configurations.

- `start-comp`: Use this script to launch your compositor with configured environment variables, Example: `start-comp labwc`
- `fuzz-launcher`: If you want the same menu I use in my bar.

Additionally, there are other handy scripts available in `.local/bin`
