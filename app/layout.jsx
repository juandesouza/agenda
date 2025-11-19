import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { PWARegister } from '@/components/PWARegister';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Agenda - Multilingual PWA Calendar',
  description: 'A modern full-stack calendar application with multilingual support',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Agenda',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <Providers>
          <PWARegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}

