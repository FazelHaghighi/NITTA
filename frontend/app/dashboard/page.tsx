'use client';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useBoundStore } from '@/hooks/useBoundStore';
import { getCookie, setCookie } from 'cookies-next';
import axios, { AxiosError } from 'axios';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Button, Card, Theme } from '@radix-ui/themes';
import { Student, Teacher } from '@/types/globalTypes';
import Header from './header';

function StudentComponent({ student }: { student: Student }) {
  return (
    <>
      <p>شماره دانشجویی : {student?.id}</p>
      <p>نام : {student?.name}</p>
      <p>نام کاربری : {student?.username}</p>
      <p>ایمیل : {student?.email}</p>
    </>
  );
}

const Dashboard = ({ user }: { user: Student | Teacher }) => {
  // const student = useBoundStore((state) => state.student);
  const updateStudent = useBoundStore((state) => state.updateStudent);
  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {}, []);

  return (
    <>
      <Header user={user} theme={theme} switchTheme={switchTheme} />
    </>
  );
};

export default Dashboard;
