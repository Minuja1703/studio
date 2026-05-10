import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MonoNote | Minimalist Thinking',
  description: 'A serene space for your thoughts, powered by intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]`}>
        {children}
      </body>
    </html>
  );
}