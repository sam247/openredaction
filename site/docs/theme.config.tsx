import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Logo from './components/Logo'

const config: DocsThemeConfig = {
  logo: <Logo />,
  project: {
    link: 'https://github.com/sam247/openredaction',
  },
  docsRepositoryBase: 'https://github.com/sam247/openredaction-site/tree/main/docs',
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
    component: () => <span>OpenRedaction Documentation © 2025</span>,
  },
}

export default config
