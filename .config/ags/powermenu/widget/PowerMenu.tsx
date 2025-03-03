import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { bind, interval, timeout, Variable } from "astal";

const time = Variable("").poll(1000, "date");

function hide() {
  App.quit();
}

function clicked(
  button: string,
  buttonsClicked: Variable<string[]>,
  executeAction: () => void
) {
  console.log("Clicked", button);

  // If the button is already clicked, do the action
  if (buttonsClicked.get().includes(button)) {
    executeAction();
  }
  // Add the button to the list of clicked buttons
  buttonsClicked.set([...buttonsClicked.get(), button]);
  // Remove the button from the list of clicked buttons after 1.5 seconds
  const t = timeout(1500, () => {
    buttonsClicked.set(buttonsClicked.get().filter((b) => b !== button));
  });
  t.connect("now", () => {
    // pass
  });
}

export default function PowerMenu(gdkmonitor: Gdk.Monitor) {
  const { LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;
  const time = Variable<number>(Date.now());
  const buttonsClicked = Variable<string[]>([]);

  const setTime = interval(1000, () => time.set(Date.now()));
  setTime.connect("now", () => {
    // pass
  });

  const shown = Variable(false);

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
          shown.set(false);
          setTimeout(() => {
            hide();
          }, 300);
        }
      }}
      onShow={(_self) => {
        shown.set(true);
      }}
    >
      {/* START: outer centerbox */}
      <centerbox
        orientation={Gtk.Orientation.HORIZONTAL}
        className={bind(shown).as((v) => (v ? "outer shown" : "outer hidden"))}
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
                    console.log("power");
                    hide();
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
                    console.log("reboot");
                    hide();
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
                    console.log("suspend");
                    hide();
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
                    console.log("Lock");
                    hide();
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
