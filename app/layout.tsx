import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n'
import { UserProvider } from '@/lib/context/user-context'
import { QueryProvider } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'InteliWallet',
  description: 'Planilha financeira gamificada !'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <QueryProvider>
          <LanguageProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </LanguageProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
