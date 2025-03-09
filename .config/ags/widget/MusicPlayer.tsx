import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import CakeState from "./util/state";
import Mpris from "gi://AstalMpris";
import {
  bind,
  Binding,
  exec,
  interval,
  readFile,
  Variable,
  writeFile,
} from "astal";

function PlayerIcon({
  player,
  active,
  onSwitch,
}: {
  player: Mpris.Player;
  active: Binding<boolean>;
  onSwitch: () => void;
}) {
  return (
    <button
      className={active.as((a) => (a ? "PlayerButton active" : "PlayerButton"))}
      onClick={onSwitch}
    >
      <icon icon={player.get_entry()} />
    </button>
  );
}

export default function MusicPlayer(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, LEFT } = Astal.WindowAnchor;
  const mpris = Mpris.get_default();
  const playerIndex = Variable<number>(0);

  function getThis() {
    return App.get_window("musicplayer");
  }

  CakeState.musicPlayerOpen.subscribe((open) => {
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
      className="MusicPlayer"
      name="musicplayer"
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
      onKeyPressEvent={function (_self, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
          CakeState.setMusicPlayer(false);
        }
      }}
    >
      <centerbox className={"wrapper"} vertical>
        <box
          vertical
          className={CakeState.musicPlayerOpen().as((open) => {
            return open ? "content shown" : "content hidden";
          })}
        >
          {bind(mpris, "players").as((players) => {
            if (players.length === 0) {
              return <label label="No players found" className={"noPlayers"} />;
            }

            return (
              <box>
                {bind(playerIndex).as((i) => {
                  let player = players[i];
                  if (!player) {
                    player = players[0];
                    playerIndex.set(0);
                  }

                  return (
                    <box className={"active"} vertical>
                      <box className={"albumart"}>
                        <button
                          css={bind(player, "coverArt").as(
                            (c) => `background-image: url('${c}');`
                          )}
                          heightRequest={200}
                          widthRequest={200}
                          onClick={() => player.raise()}
                        />
                      </box>
                      <box className={"details"} vertical>
                        <label
                          label={bind(player, "metadata").as(
                            () => `${player.artist} - ${player.title}`
                          )}
                          className={"title"}
                        />
                        <label
                          label={bind(player, "metadata").as(
                            () => `${player.album}`
                          )}
                          className={"album"}
                        />
                      </box>
                      <box className={"controls"} halign={Gtk.Align.CENTER}>
                        <button
                          onClick={() => player.previous()}
                          className={"prev"}
                          visible={bind(player, "canGoPrevious").as((v) => v)}
                        >
                          <icon icon="media-skip-backward-symbolic" />
                        </button>
                        <button
                          onClick={() => player.play_pause()}
                          className={"play"}
                        >
                          <icon
                            icon={bind(player, "playbackStatus").as((s) =>
                              s === Mpris.PlaybackStatus.PLAYING
                                ? "media-playback-pause-symbolic"
                                : "media-playback-start-symbolic"
                            )}
                          />
                        </button>
                        <button
                          onClick={() => player.next()}
                          className={"next"}
                          visible={bind(player, "canGoNext").as((v) => v)}
                        >
                          <icon icon="media-skip-forward-symbolic" />
                        </button>
                      </box>
                    </box>
                  );
                })}
              </box>
            );
          })}
          <box className={"players"} halign={Gtk.Align.CENTER}>
            {bind(mpris, "players").as((players) =>
              players.map((p) => {
                return (
                  <PlayerIcon
                    player={p}
                    active={bind(playerIndex).as((i) => players[i] === p)}
                    onSwitch={() => {
                      print("switching to", p);
                      print("index", players.indexOf(p));
                      print(JSON.stringify(players));
                      playerIndex.set(players.indexOf(p));
                    }}
                  />
                );
              })
            )}
          </box>
        </box>

        <eventbox
          className={"exit"}
          onClick={() => CakeState.setMusicPlayer(false)}
          heightRequest={44}
        />
      </centerbox>
    </window>
  );
}
