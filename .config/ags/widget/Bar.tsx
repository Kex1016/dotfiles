import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { bind, exec, GLib, interval, Variable } from "astal";
import Tray from "gi://AstalTray";
import Mpris from "gi://AstalMpris";
import CakeState from "./util/state";

const time = Variable("").poll(1000, "date +%H:%M");

type Window = {
  id: string;
  title: string;
  active?: boolean;
};

function checkSameWindowList(a: Window[], b: Window[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function iconReplacements(icon: string) {
  const replacements = {
    code: "visual-studio-code",
    zen: "zen-browser",
    Navigator: "zen-browser",
  };

  return replacements[icon as keyof typeof replacements] || icon;
}

function AppLauncherButton() {
  const appLauncherOpened = CakeState.applicationLauncherOpen;

  function toggleAppLauncher() {
    let appLauncherWindow;
    try {
      appLauncherWindow = App.get_window("applauncher");
    } catch (e) {
      // pass
    }

    if (appLauncherWindow) {
      if (appLauncherWindow.is_visible()) {
        appLauncherWindow.hide();
        CakeState.setApplicationLauncher(false);
      } else {
        appLauncherWindow.show();
        CakeState.setApplicationLauncher(true);
      }
    }
  }

  return (
    <button
      className={bind(appLauncherOpened).as((v) =>
        v ? "appLauncher active" : "appLauncher"
      )}
      onClicked={toggleAppLauncher}
      halign={Gtk.Align.START}
    >
      <icon icon={GLib.get_os_info("LOGO") || "view-grid-symbolic"} />
    </button>
  );
}

function MusicPlayer() {
  const mpris = Mpris.get_default();

  function toggleMusicPlayer() {
    let musicPlayerWindow;
    try {
      musicPlayerWindow = App.get_window("musicplayer");
    } catch (e) {
      // pass
    }

    if (musicPlayerWindow) {
      if (musicPlayerWindow.is_visible()) {
        musicPlayerWindow.hide();
        CakeState.setMusicPlayer(false);
      } else {
        musicPlayerWindow.show();
        CakeState.setMusicPlayer(true);
      }
    }
  }

  return (
    <button
      className={"musicPlayer"}
      onClicked={toggleMusicPlayer}
      halign={Gtk.Align.START}
      hasTooltip
      tooltipText={"Music Player(s)"}
      visible={bind(mpris, "players").as((players) => players.length > 0)}
    >
      <icon icon={"media-playback-start-symbolic"} />
    </button>
  );
}

function Taskbar() {
  const windowList = Variable<Window[]>([]);
  const windowListPrevious = Variable<Window[]>([]);

  interval(100, () => {
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
      windowList.set(windows);
      windowListPrevious.set(windows);
    }
  });

  return (
    <box className={"taskbar"}>
      {bind(windowList).as((windows) => {
        return windows.map((window, index) => {
          return (
            <button
              key={index}
              onClicked={() => {
                exec(
                  `wlrctl window focus app_id:${window.id} title:"${window.title}"`
                );
              }}
              className={window.active ? "window active" : "window"}
              hasTooltip
              tooltipText={window.title}
            >
              <box halign={Gtk.Align.CENTER}>
                <icon icon={iconReplacements(window.id)} className={"icon"} />
              </box>
            </button>
          );
        });
      })}
    </box>
  );
}

function SysTray() {
  const tray = Tray.get_default();

  return (
    <box className={"tray"}>
      {bind(tray, "items").as((items) =>
        items.map((item, index) => (
          <menubutton
            key={index}
            className={"trayItem"}
            tooltipMarkup={bind(item, "tooltipMarkup")}
            usePopover={false}
            actionGroup={bind(item, "actionGroup").as((ag) => ["dbusmenu", ag])}
            menuModel={bind(item, "menuModel")}
          >
            <icon gicon={bind(item, "gicon")} />
          </menubutton>
        ))
      )}
    </box>
  );
}

function Audio() {
  const volume = Variable(0).poll(100, () => {
    const volOutput = exec("pactl get-sink-volume @DEFAULT_SINK@");
    const vol = parseInt(volOutput.match(/(\d+)%/)?.[1] || "0", 10);
    return vol;
  });

  return (
    <button
      className={"audio"}
      onClicked="pavucontrol"
      halign={Gtk.Align.START}
      hasTooltip
      tooltipText={"Volume Control"}
      onScroll={(self, event) => {
        if (event.delta_y > 0) {
          exec("pactl set-sink-volume @DEFAULT_SINK@ -5%");
        } else {
          exec("pactl set-sink-volume @DEFAULT_SINK@ +5%");
        }
      }}
    >
      <box>
        {bind(volume).as((v) => {
          if (v > 0 && v <= 33) {
            return <icon icon="audio-volume-low-symbolic" />;
          } else if (v > 33 && v <= 66) {
            return <icon icon="audio-volume-medium-symbolic" />;
          } else if (v > 66) {
            return <icon icon="audio-volume-high-symbolic" />;
          } else {
            return <icon icon="audio-volume-muted-symbolic" />;
          }
        })}
        <label label={bind(volume).as((v) => `${v}%`)} />
      </box>
    </button>
  );
}

function Clock() {
  return (
    <button
      className={"clock"}
      onClicked="astal -t calendar"
      halign={Gtk.Align.END}
    >
      <label label={time()} />
    </button>
  );
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;
  const classList = Variable<string[]>(["contents"]);

  CakeState.applicationLauncherOpen.subscribe((open) => {
    if (open) {
      classList.set([...classList.get(), "appLauncherOpen"]);
    } else {
      classList.set(classList.get().filter((c) => c !== "appLauncherOpen"));
    }
  });

  CakeState.musicPlayerOpen.subscribe((open) => {
    if (open) {
      classList.set([...classList.get(), "musicPlayerOpen"]);
    } else {
      classList.set(classList.get().filter((c) => c !== "musicPlayerOpen"));
    }
  });

  return (
    <window
      className={"Bar"}
      name="bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={LEFT | RIGHT | BOTTOM}
      application={App}
      heightRequest={40}
    >
      <centerbox className={bind(classList).as((c) => c.join(" "))}>
        <box className={"leftModule"} halign={Gtk.Align.START}>
          <AppLauncherButton />
          <MusicPlayer />
        </box>
        <box className={"centerModule"} halign={Gtk.Align.CENTER}>
          <Taskbar />
        </box>
        <box className={"rightModule"} halign={Gtk.Align.END}>
          <SysTray />
          <Audio />
          <Clock />
        </box>
      </centerbox>
    </window>
  );
}
