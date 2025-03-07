import { Variable } from "astal";

class CakeState {
  public applicationLauncherOpen: Variable<boolean> = Variable(false);
  public musicPlayerOpen: Variable<boolean> = Variable(false);
  public powerMenuOpen: Variable<boolean> = Variable(false);

  public toggleApplicationLauncher() {
    this.applicationLauncherOpen.set(!this.applicationLauncherOpen.get());
  }

  public setApplicationLauncher(open: boolean) {
    this.applicationLauncherOpen.set(open);
  }

  public toggleMusicPlayer() {
    this.musicPlayerOpen.set(!this.musicPlayerOpen.get());
  }

  public setMusicPlayer(open: boolean) {
    this.musicPlayerOpen.set(open);
  }

  public togglePowerMenu() {
    this.powerMenuOpen.set(!this.powerMenuOpen.get());
  }

  public setPowerMenu(open: boolean) {
    this.powerMenuOpen.set(open);
  }
}

export default new CakeState();
