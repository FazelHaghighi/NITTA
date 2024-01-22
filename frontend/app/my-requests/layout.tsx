import MyRequest from './page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'درخواست های من',
  description: 'سامانه ثبت درخواست دستیارآموزشی دانشگاه صنعتی نوشیروانی بابل',
};

export default async function DashboardLayout() {
  return (
    <>
      <MyRequest />
    </>
  );
}
