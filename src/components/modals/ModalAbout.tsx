import rehypeExternalLinks from "rehype-external-links";
import { SolidMarkdown } from "solid-markdown";
import { css } from "solid-styled";

import { useI18n } from "~/settings/i18nProvider";
import Logo from "../svgs/logo";
import LinkedinBadge from "../ui/LinkedinBadge";

type ModalAboutProps = {};

const ModalAbout = (props: ModalAboutProps) => {
  const t = useI18n();

  css`
    .about-wrapper {
      display: flex;
    }

    .modal-about-content {
      padding: 24px;
      max-width: 300px;
    }

    @global {
      .modal-about-content {
        h2 {
          font-weight: 300;
          font-size: 32px;
          color: var(--text-secondary-color);
        }

        p {
          text-align: justify;
        }
      }
    }

    .project {
      border-right: 2px solid var(--border-color);
      padding-right: 48px;
    }

    .me {
      padding-left: 48px;
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
      <div class="modal-about-content project">
        <div class="logo animate">
          <Logo width="130px" />
        </div>
        <SolidMarkdown
          rehypePlugins={[
            [
              rehypeExternalLinks,
              {
                target: "_blank",
                rel: "noopener noreferrer",
              },
            ],
          ]}
          children={t("about.project")}
        />
      </div>
      <div class="modal-about-content me">
        <SolidMarkdown
          rehypePlugins={[
            [
              rehypeExternalLinks,
              { target: "_blank", rel: "noopener noreferrer" },
            ],
          ]}
          children={t("about.me")}
        />
        <LinkedinBadge
          href="https://www.linkedin.com/in/martin-kinoo/"
          text="martin-kinoo"
        />
      </div>
    </div>
  );
};

export default ModalAbout;
