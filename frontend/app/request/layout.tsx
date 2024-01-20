import Request from './page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ثبت درخواست',
  description: 'سامانه ثبت درخواست دستیارآموزشی دانشگاه صنعتی نوشیروانی بابل',
};

export default async function DashboardLayout() {
  return (
    <main>
      <Request />
    </main>
  );
}
