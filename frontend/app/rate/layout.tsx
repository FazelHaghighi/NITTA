import Rate from './page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ثبت امتیاز',
  description: 'سامانه ثبت درخواست دستیارآموزشی دانشگاه صنعتی نوشیروانی بابل',
};

export default async function DashboardLayout() {
  return (
    <>
      <Rate />
    </>
  );
}
