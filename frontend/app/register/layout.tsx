import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ثبت نام',
  description: 'سامانه ثبت درخواست دستیارآموزشی دانشگاه صنعتی نوشیروانی بابل',
};
export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
