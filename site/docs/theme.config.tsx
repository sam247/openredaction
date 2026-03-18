import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Logo from './components/Logo'

const config: DocsThemeConfig = {
  logo: <Logo />,
  project: {
    link: 'https://github.com/sam247/openredaction',
  },
  chat: {
    link: 'https://openredaction.com/contact',
  },
  docsRepositoryBase: 'https://github.com/sam247/openredaction-site/tree/main/docs',
  footer: {
    component: () => <span>OpenRedaction Documentation © 2025</span>,
  },
}

export default config
