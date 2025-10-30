import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n'
import { UserProvider } from '@/lib/context/user-context'
import { QueryProvider } from '@/components/providers'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
