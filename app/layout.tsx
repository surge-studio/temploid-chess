import { Inter as createInter } from 'next/font/google';
import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';

const inter = createInter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chess',
  description: 'Play Chess online.',
};

type LayoutProps = {
  readonly children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => (
  <html lang="en">
    <body className={inter.className}>{children}</body>
  </html>
);

export default Layout;
