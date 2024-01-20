import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import '@radix-ui/themes/styles.css';
import './theme-config.css';
import WrapperRootLatout from './wrapper-layout';

const vazirmatn = localFont({
  src: '../font/Vazirmatn-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-vazirmatn',
});

export const metadata: Metadata = {
  title: 'سامانه ثبت درخواست دستیارآموزشی دانشگاه صنعتی نوشیروانی بابل',
  description: 'سامانه ثبت درخواست دستیارآموزشی دانشگاه صنعتی نوشیروانی بابل',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="rtl" lang="fa" className={vazirmatn.variable}>
      <body>
        <WrapperRootLatout>{children}</WrapperRootLatout>
        <Toaster />
      </body>
    </html>
  );
}
