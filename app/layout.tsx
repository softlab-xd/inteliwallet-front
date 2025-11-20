import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
// 1. Importamos a fonte do Google
import { Poppins } from 'next/font/google' 
import { LanguageProvider } from '@/lib/i18n'
import { UserProvider } from '@/lib/context/user-context'
import { QueryProvider } from '@/components/providers'
import './globals.css'
import { DashboardView } from '@/components/dashboard-view'

// 2. Configuramos a Poppins com todos os pesos e definimos a variável CSS
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans', // Isso integra com o Tailwind se configurado
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
      {/* 3. Aplicamos a fonte no body usando a variável e a classe direta */}
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