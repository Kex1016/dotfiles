import { App } from "astal/gtk3";
import style from "./style.scss";
import PowerMenu from "./widget/PowerMenu";

App.start({
  css: style,
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
  },
});
