import '#/styles/globals.css';
import { AddressBar } from '#/ui/address-bar';
import Byline from '#/ui/byline';
import { GlobalNav } from '#/ui/global-nav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Guardian Angel',
    template: '%s | Guardian Angel',
  },
  metadataBase: new URL('https://app-router.vercel.app'),
  description:
    'AI-powered driving safety assistant that helps keep you alert and focused on the road.',
  openGraph: {
    title: 'Guardian Angel - Your AI Driving Assistant',
    description:
      'AI-powered driving safety assistant that helps keep you alert and focused on the road.',
    images: [`/api/og?title=Guardian Angel`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="{theme}">
      <body className="overflow-y-scroll bg-gray-100 bg-[url('/grid.svg')] dark:bg-gray-1100">
        <GlobalNav />

        <div className="w-full">
          <div className="mx-auto max-w-7xl space-y-8 px-4 pt-20 lg:px-8 lg:py-8">
            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-white p-4 dark:bg-black lg:p-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
