'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useBoundStore } from '@/hooks/useBoundStore';
import { getCookie, setCookie } from 'cookies-next';
import axios, { AxiosError } from 'axios';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Button, Card, Theme } from '@radix-ui/themes';
import { Student } from '@/types/globalTypes';
import Header from './header';

function StudentComponent({ student }: { student: Student | undefined }) {
  return (
    <>
      <p>شماره دانشجویی : {student?.id}</p>
      <p>نام : {student?.name}</p>
      <p>نام کاربری : {student?.username}</p>
      <p>ایمیل : {student?.email}</p>
    </>
  );
}

const Dashboard = () => {
  const student = useBoundStore((state) => state.student);
  const updateStudent = useBoundStore((state) => state.updateStudent);
  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (student.id === -1)
      axios
        .post(
          'http://127.0.0.1:8000/getStudentById',
          {
            access_token: getCookie('access_token'),
            refresh_token: getCookie('refresh_token'),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then(({ data }) => {
          if (data.code === '1' || data.code === '2') {
            console.log('some error occured');
            return;
          }
          if (data.new_access_token) {
            setCookie('access_token', data.new_access_token);
          }
          updateStudent(data.student);
          setLoaded(true);
        })
        .catch((error: AxiosError) => {
          console.log(error);
        });
  }, []);

  return (
    <Theme appearance={theme} accentColor="blue" grayColor="slate">
      <Header student={student} theme={theme} switchTheme={switchTheme} />
    </Theme>
  );
};

export default Dashboard;
