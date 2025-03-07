import { App, Gtk } from "astal/gtk3";
import style from "./styles/main.scss";
import PowerMenu from "./widget/PowerMenu";
import Bar from "./widget/Bar";
import AppLauncher from "./widget/AppLauncher";

function toggleWindow(window: Gtk.Window) {
  if (window.is_visible()) {
    window.hide();
  } else {
    window.show();
  }
}

App.start({
  css: style,
  requestHandler(request: string, res: (response: any) => void) {
    switch (request) {
      case "powermenu":
        const powermenu = App.get_window("powermenu");
        if (powermenu) {
          toggleWindow(powermenu);
        }
        res("powermenu toggled");
        break;
      case "musicplayer":
        const musicplayer = App.get_window("musicplayer");
        if (musicplayer) {
          toggleWindow(musicplayer);
        }
        res("musicplayer toggled");
        break;
      case "applauncher":
        const applauncher = App.get_window("applauncher");
        if (applauncher) {
          toggleWindow(applauncher);
        }
        res("applauncher toggled");
        break;
      default:
        res(null);
    }
  },
  main() {
    const monitors = App.get_monitors();

    const mainMonitor = {
      width: 1920,
      height: 1080,
    };

    const monitor = monitors.find((m) => {
      const { height, width } = m.get_geometry();
      return height === mainMonitor.height && width === mainMonitor.width;
    });

    PowerMenu(monitor || monitors[0]);
    AppLauncher(monitor || monitors[0]);
    monitors.map((m) => {
      Bar(m);
    });
  },
});
