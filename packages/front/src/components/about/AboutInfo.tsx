import rehypeExternalLinks from "rehype-external-links";
import { SolidMarkdown } from "solid-markdown";
import { css } from "solid-styled";

import Logo from "../svgs/logo";
import LinkedinBadge from "../ui/LinkedinBadge";
import Morphing from "../ui/Morphing";
import { useI18n } from "~/contexts/i18nProvider";

type ModalAboutProps = {
  next: () => void;
};

const AboutInfo = (props: ModalAboutProps) => {
  const t = useI18n();

  css`
    .modal-about-project {
      display: none;
    }

    .modal-about-me {
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      padding-top: 64px;
      padding-bottom: 32px;
    }

    .about-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 32px;
      padding-right: 64px;
      margin: 0 auto;
    }

    .modal-about-content {
    }

    @global {
      .modal-about-content {
        h2 {
          font-size: 28px;
          font-weight: 300;
          margin-top: 0;
          margin-bottom: 64px;
          color: var(--text-secondary-color);
        }

        p {
          padding-left: 32px;
          padding-right: 32px;
          text-align: justify;
        }
      }
    }

    .logo {
      height: 80px;
      margin: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  return (
    <div class="about-wrapper">
      <div class="modal-about-content modal-about-me">
        <SolidMarkdown
          rehypePlugins={[
            [
              rehypeExternalLinks,
              { target: "_blank", rel: "noopener noreferrer" },
            ],
          ]}
          children={t("about.me")}
        />
      </div>
      <div class="actions">
        <LinkedinBadge
          href="https://www.linkedin.com/in/martin-kinoo/"
          text="martin-kinoo"
        />
        <button class="primary" onClick={props.next}>
          Me contacter
        </button>
      </div>
    </div>
  );
};

export default AboutInfo;
