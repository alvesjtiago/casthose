import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Casthose',
  description: 'Streaming casts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <footer className="text-center fixed bottom-0 py-4 px-2 w-full backdrop-opacity-10 bg-white/95 text-slate-500	text-xs">
          built by{' '}
          <a
            href="https://warpcast.com/alvesjtiago.eth"
            target="_blank"
            className="underline"
          >
            @alvesjtiago.eth
          </a>{' '}
          & powered by{' '}
          <a href="https://neynar.com/" target="_blank" className="underline">
            <img
              className="w-32 inline-block"
              src="/neynar-logo.png"
              alt="Neynar"
            />
          </a>
        </footer>
      </body>
    </html>
  )
}
