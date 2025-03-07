import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { bind, Variable } from "astal";
import Apps from "gi://AstalApps";
import CakeState from "./util/state";

const MAX_ITEMS = 8;

function AppButton({ app }: { app: Apps.Application }) {
  return (
    <button
      className={"AppButton"}
      onClicked={() => {
        CakeState.applicationLauncherOpen.set(false);
        app.launch();
      }}
    >
      <box>
        <icon icon={app.iconName} />
        <box valign={Gtk.Align.CENTER} vertical>
          <label className={"name"} truncate xalign={0} label={app.name} />
          {app.description && (
            <label
              className={"description"}
              wrap
              xalign={0}
              label={app.description}
            />
          )}
        </box>
      </box>
    </button>
  );
}

export default function AppLauncher(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, LEFT } = Astal.WindowAnchor;
  const apps = new Apps.Apps();
  const width = Variable<number>(1000);

  function getThis() {
    return App.get_window("applauncher");
  }

  CakeState.applicationLauncherOpen.subscribe((open) => {
    const window = getThis();
    if (!window) return;

    if (open) {
      window.show();
    } else {
      setTimeout(() => window.hide(), 300);
    }
  });

  const search = Variable<string>("");
  const list = search((s) => apps.fuzzy_query(s).slice(0, MAX_ITEMS));
  const onEnter = () => {
    apps.fuzzy_query(search.get())?.[0].launch();
    CakeState.applicationLauncherOpen.set(false);
  };

  return (
    <window
      className="AppLauncher"
      name="applauncher"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={BOTTOM | LEFT}
      keymode={Astal.Keymode.ON_DEMAND}
      application={App}
      onRealize={() => {
        const window = getThis();
        if (!window) return;

        window.hide();
      }}
      onShow={(self) => {
        search.set("");
        width.set(self.get_current_monitor().workarea.width);
      }}
      onKeyPressEvent={(self, event: Gdk.Event) => {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
          CakeState.applicationLauncherOpen.set(false);
        }
      }}
    >
      <box>
        <box hexpand={false} vertical>
          <box
            widthRequest={500}
            className={bind(CakeState.applicationLauncherOpen).as((v) =>
              v ? "AppLauncherContents shown" : "AppLauncherContents hidden"
            )}
            vertical
          >
            <entry
              className={"search"}
              placeholderText={"Search"}
              text={search()}
              onActivate={onEnter}
              onChanged={(self) => search.set(self.text)}
            />
            <box className={"list"} spacing={6} vertical>
              {list.as((l) => l.map((app) => <AppButton app={app} />))}
            </box>
            <box
              halign={Gtk.Align.CENTER}
              className={"not-found"}
              visible={list.as((l) => l.length === 0)}
            >
              <icon icon={"system-search-symbolic"} />
              <label label={"No results found"} />
            </box>
          </box>
        </box>
      </box>
    </window>
  );
}
