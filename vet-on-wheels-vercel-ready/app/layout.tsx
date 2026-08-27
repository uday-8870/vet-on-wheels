import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vet on Wheels — Calm care at your door',
  description: 'Book, manage and track trusted mobile veterinary care across Hyderabad.',
  openGraph: {
    title: 'Vet on Wheels',
    description: 'Calm care. Right at your door.',
    images: ['https://vet-on-wheels-hyd-prototype.udayadithyareddysing.chatgpt.site/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vet on Wheels',
    description: 'Calm care. Right at your door.',
    images: ['https://vet-on-wheels-hyd-prototype.udayadithyareddysing.chatgpt.site/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
