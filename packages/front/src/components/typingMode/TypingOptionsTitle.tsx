import { css } from "solid-styled";
import TypingOptionsRecap from "./TypingOptionsRecap";
import { typingModes } from "~/typingOptions/typingMode";
import { Translator, useI18n } from "~/contexts/i18nProvider";
import { TypingOptions } from "~/typingOptions/typingOptions";

type TypingOptionsTitleProps = {
  typingOptions: TypingOptions;
};

const TypingOptionsTitle = (props: TypingOptionsTitleProps) => {
  const t = useI18n();
  css`
    .picto {
      width: 130px;
    }
    .game-title {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 26px;
    }
    .title {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    h1 {
      font-size: 32px;
      font-weight: 200;
      margin: 0;
    }
  `;
  return (
    <div class="game-title">
      <div class="picto">
        {typingModes[props.typingOptions.modeSelected].smile()}
      </div>
      <div class="title">
        <h1>{`${t("typingMode")[props.typingOptions.modeSelected].subtitle}`}</h1>
        <TypingOptionsRecap typingOptions={props.typingOptions} />
      </div>
    </div>
  );
};

export default TypingOptionsTitle;
