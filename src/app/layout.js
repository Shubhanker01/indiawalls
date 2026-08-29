import './globals.css';

export const metadata = {
  metadataBase: new URL('https://indiawalls.in'),
  title: {
    default: 'Indiawalls | Precast Boundary Wall & RCC Wall Manufacturer',
    template: '%s | Indiawalls Infratech',
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
  authors: [{ name: 'Indiawalls Infratech Private Limited' }],
  creator: 'Indiawalls Infratech',
  publisher: 'Indiawalls Infratech',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Indiawalls | Precast Boundary Wall Manufacturer',
    description: 'Custom precast concrete walls for land security & construction projects across Delhi NCR & Rajasthan.',
    url: 'https://indiawalls.in',
    siteName: 'Indiawalls Infratech',
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}