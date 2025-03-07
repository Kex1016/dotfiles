import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { bind, exec, interval, timeout, Variable } from "astal";
import CakeState from "./util/state";

const time = Variable("").poll(1000, "date");

function clicked(
  button: string,
  buttonsClicked: Variable<string[]>,
  executeAction: () => void
) {
  // If the button is already clicked, do the action
  if (buttonsClicked.get().includes(button)) {
    executeAction();
    CakeState.setPowerMenu(false);
  }
  // Add the button to the list of clicked buttons
  buttonsClicked.set([...buttonsClicked.get(), button]);
  // Remove the button from the list of clicked buttons after 1.5 seconds
  timeout(1500, () => {
    buttonsClicked.set(buttonsClicked.get().filter((b) => b !== button));
  });
}

export default function PowerMenu(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM } = Astal.WindowAnchor;
  const time = Variable<number>(Date.now());
  const buttonsClicked = Variable<string[]>([]);

  function getThis() {
    return App.get_window("powermenu");
  }

  // Set time
  interval(1000, () => time.set(Date.now()));

  CakeState.powerMenuOpen.subscribe((open) => {
    const window = getThis();
    if (!window) return;

    if (open) {
      window.show();
    } else {
      setTimeout(() => window.hide(), 300);
    }
  });

  return (
    <window
      className="PowerMenu"
      name="powermenu"
      gdkmonitor={gdkmonitor.display.get_primary_monitor() || gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={BOTTOM}
      application={App}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressEvent={function (_self, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
          CakeState.setPowerMenu(false);
        }
      }}
      onRealize={(_self) => {
        const window = getThis();
        if (!window) return;
        window.hide();
      }}
    >
      {/* START: outer centerbox */}
      <centerbox
        orientation={Gtk.Orientation.HORIZONTAL}
        className={bind(CakeState.powerMenuOpen).as((v) =>
          v ? "outer shown" : "outer hidden"
        )}
      >
        <box />
        {/* START: .content */}
        <centerbox orientation={Gtk.Orientation.VERTICAL} className="content">
          <label
            className="time"
            label={bind(time).as((v) => {
              const date = new Date(v);
              return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
              });
            })}
          />
          <centerbox orientation={Gtk.Orientation.HORIZONTAL}>
            <box />

            <box className="buttons" orientation={Gtk.Orientation.VERTICAL}>
              {/* power */}
              <button
                className={bind(buttonsClicked).as((v) =>
                  v.includes("power") ? " clicked" : ""
                )}
                label=" Shutdown"
                valign={Gtk.Align.CENTER}
                expand={false}
                onClicked={() => {
                  clicked("power", buttonsClicked, () => {
                    exec("systemctl poweroff");
                  });
                }}
              />
              {/* reboot */}
              <button
                className={bind(buttonsClicked).as((v) =>
                  v.includes("reboot") ? " clicked" : ""
                )}
                label=" Reboot"
                valign={Gtk.Align.CENTER}
                expand={false}
                onClicked={() => {
                  clicked("reboot", buttonsClicked, () => {
                    exec("systemctl reboot");
                  });
                }}
              />
              {/* suspend */}
              <button
                className={bind(buttonsClicked).as((v) =>
                  v.includes("suspend") ? " clicked" : ""
                )}
                label=" Hibernate"
                valign={Gtk.Align.CENTER}
                expand={false}
                onClicked={() => {
                  clicked("suspend", buttonsClicked, () => {
                    exec("systemctl suspend");
                  });
                }}
              />
              {/* lock */}
              <button
                className={bind(buttonsClicked).as((v) =>
                  v.includes("lock") ? " clicked" : ""
                )}
                label=" Lock"
                valign={Gtk.Align.BASELINE}
                expand={false}
                onClicked={() => {
                  clicked("lock", buttonsClicked, () => {
                    exec("hyprlock");
                  });
                }}
              />
            </box>

            <box />
          </centerbox>
        </centerbox>
        {/* END: .content */}
        <box />
      </centerbox>
      {/* END: outer centerbox */}
    </window>
  );
}
