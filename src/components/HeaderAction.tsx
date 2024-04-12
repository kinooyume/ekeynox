import { type Config, type ConfigLists, type Locale } from "./App.tsx";
import DarkModeToggle from "./ui/DarkModeToggle.tsx";
import KeyboardIcon from "./svgs/keyboardIcon.tsx";
import GlobeIcon from "./svgs/globe.tsx";
import TinySelect from "./ui/TinySelect.tsx";
import type { SetStoreFunction } from "solid-js/store";
import { css } from "solid-styled";

type HeaderActionProps = {
  config: Config;
  setConfig: SetStoreFunction<Config>;
  configLists: ConfigLists;
};

// css grid animation
//https://codepen.io/t_afif/pen/WNzxeOO

// https://codepen.io/t_afif/pen/WNzxeOO
//https://css-tricks.com/animating-css-grid-how-to-examples/
//
//Anime js
//
// https://devsnap.me/anime-js-examples
//
// https://github.com/alikinvv/stepper-iteration
// Svg Morphing
//
// Coo animation
// https://codepen.io/fitzsyke/pen/pKdYyE
//
// Card flip
// https://codepen.io/hellomp/pen/ZvrmdN
//
// BOOM effect
// https://codepen.io/alexzaworski/pen/mEZvrG
//
// Sliding rebound
// https://codepen.io/ershad989/pen/LYVbvmj

const HeaderAction = (props: HeaderActionProps) => {
  css`
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `;
  return (
    <div class="actions">
      <TinySelect
        list={props.configLists.kb}
        selected={props.config.kb}
        action={(s) => props.setConfig("kb", s)}
      >
        <KeyboardIcon />
      </TinySelect>
      <TinySelect
        list={props.configLists.locale}
        selected={props.config.locale}
        action={(s) => props.setConfig("locale", s)}
      >
        <GlobeIcon />
      </TinySelect>
      {/* <div class="toggle"> */}
      {/*   <ToggleDarkMode */}
      {/*     dark={props.config.dark} */}
      {/*     setDark={(dark) => props.setConfig("dark", dark)} */}
      {/*   /> */}
      {/* </div> */}
      <div class="toggle">
        <DarkModeToggle
          dark={props.config.dark}
          setDark={(dark) => props.setConfig("dark", dark)}
        />
      </div>
    </div>
  );
};

export default HeaderAction;
