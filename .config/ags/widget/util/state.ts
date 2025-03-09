import { readFile, Variable, writeFile } from "astal";
import Apps from "gi://AstalApps";

class CakeState {
  public applicationLauncherOpen: Variable<boolean> = Variable(false);
  public musicPlayerOpen: Variable<boolean> = Variable(false);
  public powerMenuOpen: Variable<boolean> = Variable(false);

  public appFrequency: Variable<{ [key: string]: number }> = Variable({});

  constructor() {
    try {
      this.appFrequency.set(JSON.parse(readFile("./appFrequency.json")));
    } catch (e) {
      console.error(e);
      writeFile("./appFrequency.json", "{}");
    }
  }

  private sortAppsByFreq() {
    return Object.entries(this.appFrequency.get())
      .sort((a, b) => b[1] - a[1])
      .map((a) => a[0]);
  }

  public sortFromAppList(apps: Apps.Application[]) {
    const sortedApps = this.sortAppsByFreq();
    const sortedAppList = [];

    for (const app of sortedApps) {
      const appObj = apps.find((a) => a.executable === app);
      if (appObj) {
        sortedAppList.push(appObj);
      }
    }

    return [
      ...sortedAppList,
      ...apps.filter((a) => !sortedApps.includes(a.executable)),
    ];
  }

  public appOpened(exe: string) {
    const appFrequency = this.appFrequency.get();
    appFrequency[exe] = (appFrequency[exe] || 0) + 1;
    this.appFrequency.set(appFrequency);

    writeFile("./appFrequency.json", JSON.stringify(this.appFrequency.get()));
  }

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
