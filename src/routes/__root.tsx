import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { hotkeysDevtoolsPlugin } from '@tanstack/react-hotkeys-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import appCss from '../styles.css?url'
import { useResolvedTheme } from '@/stores/theme'
import { getThemeServerFn } from '@/server/theme'
import { generateThemeScript } from '@/components/inline-scripts'
import { Providers } from '@/components/providers'
import { NotFound } from '@/components/not-found'
import { Footer } from '@/components/footer'
import { GlobalBackButton } from '@/components/global-back-button'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  loader: async () => {
    const theme = await getThemeServerFn()
    return { theme }
  },
  head: ({ loaderData }) => {
    const theme = loaderData?.theme ?? 'system'

    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'Assessment',
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
        { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
        { rel: 'apple-touch-icon', href: '/logo192.png' },
      ],
      scripts: [
        {
          type: 'text/javascript',
          children: generateThemeScript(theme),
        },
        {
          defer: true,
          src: 'https://umami.anshori.com/script.js',
          'data-website-id': '16105c97-a6e3-4f03-8283-9f8972cdfd04',
        },
      ],
    }
  },
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFound />,
})

interface RootDocumentProps {
  children: React.ReactNode
}

function RootDocument({ children }: RootDocumentProps) {
  const loaderData = Route.useLoaderData()
  const theme = loaderData?.theme ?? 'system'
  const resolvedTheme = useResolvedTheme()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body>
        <Providers theme={theme}>
          <div className="bg-background text-foreground flex min-h-dvh flex-col">
            <GlobalBackButton />

            <div className="flex-1">{children}</div>

            <Footer />
          </div>
        </Providers>

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
              defaultOpen: true,
            },
            formDevtoolsPlugin(),
            hotkeysDevtoolsPlugin(),
          ]}
        />

        <Toaster theme={resolvedTheme} richColors />

        <Scripts />
      </body>
    </html>
  )
}
