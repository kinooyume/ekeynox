import Sun from "~/svgs/sun.tsx";
import Moon from "~/svgs/moon.tsx";
import "./DarkModeToggle.css";
import { Match, Switch } from "solid-js";
import { Transition } from "solid-transition-group";
import { DarkModeSettings } from "../header/HeaderSettingsGlobal.tsx";

// v1: https://uiverse.io/JkHuger/old-falcon-20
// v2: https://uiverse.io/Galahhad/heavy-dog-14
//
const DarkModeToggle = (props: DarkModeSettings) => {
  return (
    <label for="theme" class="ui-switch">
      <input
        id="theme"
        class="theme__toggle"
        type="checkbox"
        role="switch"
        name="theme"
        value="dark"
        checked={props.value()}
        onClick={() => {
          props.set(!props.value());
        }}
      />
      <div class="circle">
        <Transition
          onEnter={(el, done) => {
            const a = el.animate(
              [
                { opacity: 0, transform: "translateX(-20px)" },
                { opacity: 1, transform: "translateX(0)" },
              ],
              {
                duration: 300,
              },
            );
            a.finished.then(done);
          }}
          onExit={(el, done) => {
            const a = el.animate(
              [
                {
                  opacity: 1,
                  transform: "translateX(-0)",
                  position: "absolute",
                },
                {
                  opacity: 0,
                  transform: "translateX(20px)",
                  position: "absolute",
                },
              ],
              {
                duration: 300,
              },
            );
            a.finished.then(done);
          }}
        >
          <Switch fallback={<Sun />}>
            <Match when={props.value()}>
              <Moon />
            </Match>
          </Switch>
        </Transition>
      </div>
    </label>
  );
};
export default DarkModeToggle;
