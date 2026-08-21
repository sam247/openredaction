import type { DocsThemeConfig } from "nextra-theme-docs";
import { useConfig } from "nextra-theme-docs";
import Logo from "./components/Logo";

const config: DocsThemeConfig = {
  logo: <Logo />,
  project: {
    link: "https://github.com/sam247/openredaction",
  },
  docsRepositoryBase:
    "https://github.com/sam247/openredaction-site/tree/main/docs",
  // Override default head that appends "– Nextra" (visible in SERPs, hurts CTR).
  head: function useHead() {
    const { frontMatter, title: pageTitle } = useConfig();
    const title = `${pageTitle} | OpenRedaction`;
    const { description, canonical, image } = frontMatter;

    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {description ? (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
          </>
        ) : null}
        {canonical ? <link rel="canonical" href={canonical} /> : null}
        {image ? <meta name="og:image" content={image} /> : null}
      </>
    );
  },
  navbar: {
    extraContent: (
      <a
        href="https://openredaction.com"
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        ← Back to OpenRedaction
      </a>
    ),
  },
  footer: {
    component: () => (
      <span>OpenRedaction Documentation © {new Date().getFullYear()}</span>
    ),
  },
};

export default config;
