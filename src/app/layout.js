import './globals.css';
import ChatbotWidget from '@/components/ChatbotWidget';
import { Roboto, Montserrat } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});
export const metadata = {
  metadataBase: new URL('https://rajasthanwalls.in'),
  title: {
    default: 'Rajasthanwalls | Precast Boundary Wall & RCC Wall Manufacturer',
    template: '%s | Rajasthanwalls Infratech',
  },
  description:
    'Manufacturer of high-strength precast boundary walls, RCC compound walls, and interlocking paver blocks serving Alwar, Bhiwadi, Gurugram, and Delhi NCR.',
  keywords: [
    'Precast boundary wall manufacturer',
    'RCC compound wall',
    'Readymade boundary wall Alwar',
    'Precast walls Bhiwadi',
    'Interlocking paver blocks NCR',
  ],
  authors: [{ name: 'Rajasthanwalls Infratech Private Limited' }],
  creator: 'Rajasthanwalls Infratech',
  publisher: 'Rajasthanwalls Infratech',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Rajasthanwalls | Precast Boundary Wall Manufacturer',
    description: 'Custom precast concrete walls for land security & construction projects across Delhi NCR & Rajasthan.',
    url: 'https://rajasthanwalls.in',
    siteName: 'Rajasthanwalls Infratech',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${montserrat.variable}`}>
      <body className={'antialiased'}>
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}