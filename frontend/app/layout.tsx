import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import '@radix-ui/themes/styles.css';
import './theme-config.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
