import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { bind, exec, interval, Variable } from "astal";
import Tray from "gi://AstalTray";

const time = Variable("").poll(1000, "date +%H:%M");

type Window = {
  id: string;
  title: string;
  active?: boolean;
};

function iconReplacements(icon: string) {
  const replacements = {
    code: "visual-studio-code",
    zen: "zen-browser",
  };

  return replacements[icon as keyof typeof replacements] || icon;
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;
  const trayItems = Variable<Tray.TrayItem[]>([]);
  const trayItemsPrevious = Variable<Tray.TrayItem[]>([]);
  const windowList = Variable<Window[]>([]);
  const windowListPrevious = Variable<Window[]>([]);

  function checkSameWindowList(a: Window[], b: Window[]) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  interval(100, () => {
    const _t = Tray.get_default();
    const _ti = _t.get_items();

    // Only update the trayItems if the items have changed
    if (trayItemsPrevious.get().length !== _ti.length) {
      trayItems.set(_ti);
      trayItemsPrevious.set(_ti);
    }

    const activeWindows = exec("wlrctl window list state:active")
      .split("\n")
      .map((w) => {
        // Replace the FIRST ":" with a "||" to split the id and title
        const [id, title] = w.replace(":", "||").split("||");
        return { id, title: title.trim(), active: true };
      });

    const windows = exec("wlrctl window list")
      .split("\n")
      .map((w) => {
        const [id, title] = w.replace(":", "||").split("||");
        return {
          id,
          title: `${title.trim()}`,
          active: activeWindows.some(
            (aw) => `${aw.id}:${aw.title}` === `${id}:${title.trim()}`
          ),
        };
      });

    if (!checkSameWindowList(windows, windowListPrevious.get())) {
      print("Updating active windows");
      windowList.set(windows);
      windowListPrevious.set(windows);
    }
  });

  return (
    <window
      className="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={LEFT | RIGHT | BOTTOM}
      application={App}
      heightRequest={40}
    >
      <centerbox>
        <button
          className={"leftModule"}
          onClicked="astal -t AppLauncher"
          halign={Gtk.Align.START}
        >
          <icon icon={"view-grid"} />
        </button>
        <box className={"centerModule"} halign={Gtk.Align.CENTER}>
          <box className={"taskbar"}>
            {bind(windowList).as((windows) => {
              return windows.map((window, index) => {
                return (
                  <button
                    key={index}
                    onClicked={() => {
                      exec(`wlrctl window focus ${window.id}`);
                      updateActiveWindows();
                    }}
                    className={window.active ? "window active" : "window"}
                    hasTooltip
                    tooltipText={window.title}
                  >
                    <box halign={Gtk.Align.CENTER}>
                      <icon
                        icon={iconReplacements(window.id)}
                        className={"icon"}
                      />
                      {/* <label label={window.title} className={"title"} /> */}
                    </box>
                  </button>
                );
              });
            })}
          </box>
        </box>
        <box className={"rightModule"} halign={Gtk.Align.END}>
          <box className={"tray"}>
            {bind(trayItems).as((items) =>
              items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => item.secondary_activate(0, 0)}
                >
                  <icon icon={item.iconName} />
                </button>
              ))
            )}
          </box>
          <button onClicked="astal -t Calendar" halign={Gtk.Align.END}>
            <label label={time()} />
          </button>
        </box>
      </centerbox>
    </window>
  );
}
