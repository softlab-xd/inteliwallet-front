import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Poppins } from 'next/font/google' 
import { LanguageProvider } from '@/lib/i18n'
import { UserProvider } from '@/lib/context/user-context'
import { QueryProvider } from '@/components/providers'
import './globals.css'
import { DashboardView } from '@/components/dashboard-view'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans', 
})

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
      <body className={`${poppins.variable} ${poppins.className} antialiased`}>
        <QueryProvider>
          <LanguageProvider>
            <UserProvider>
              <DashboardView/>
              {children}
            </UserProvider>
          </LanguageProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}