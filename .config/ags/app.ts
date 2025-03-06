import { App } from "astal/gtk3";
import style from "./styles/main.scss";
import PowerMenu from "./widget/PowerMenu";
import Bar from "./widget/Bar";

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
    monitors.map((m) => {
      Bar(m);
    });
  },
});
