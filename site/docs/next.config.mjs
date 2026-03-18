import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

export default withNextra({
  // Serve docs under /docs on the main site
  basePath: '/docs',
  // Export a fully static version we can host from the main app's public folder
  output: 'export',
  images: {
    unoptimized: true,
  },
})

