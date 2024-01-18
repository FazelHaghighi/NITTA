import Dashboard from './page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پنل کاربری',
  description: 'سامانه ثبت درخواست دستیارآموزشی دانشگاه صنعتی نوشیروانی بابل',
};

export default async function DashboardLayout() {
  return (
    <main>
      <Dashboard></Dashboard>
    </main>
  );
}
