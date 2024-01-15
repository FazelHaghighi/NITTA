import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const vazirmatn = Vazirmatn({ subsets: ['arabic'] });

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
    <html dir="rtl" lang="fa">
      <body
        className={`${vazirmatn.className} bg-main-bg bg-no-repeat bg-cover`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
