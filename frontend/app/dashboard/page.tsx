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
import TeacherDashboard from './teacher-dashboard';
import StudentDashboard from './student-dashboard.';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./header'));

export async function getUser() {
  const access_token = getCookie('access_token');
  const refresh_token = getCookie('refresh_token');
  try {
    const res = await axios('http://127.0.0.1:8000/getUserById', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
    });

    const user = await res.data;

    console.log(user);

    if (user.code === '1' || user.code === '2') {
      console.log('some error occured');
      return;
    }
    if (user.new_access_token) {
      setCookie('access_token', user.new_access_token);
      if ('student' in user) return user.student;
      else return user.teacher;
    }

    return user;
  } catch (error) {
    console.log(error);
  }
}

let isStudent = 0;

const Dashboard = () => {
  const student = useBoundStore((state) => state.student);
  const teacher = useBoundStore((state) => state.teacher);
  const updateStudent = useBoundStore((state) => state.updateStudent);
  const updateTeacher = useBoundStore((state) => state.updateTeacher);

  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);

  useEffect(() => {
    getUser().then((res) => {
      if ('teacher' in res) {
        updateTeacher(res.teacher);
        isStudent = 1;
      } else if ('student' in res) {
        updateStudent(res.student);
        isStudent = -1;
      }
    });
  }, []);

  return (
    <>
      <Header
        user={isStudent === 1 ? teacher : student}
        theme={theme}
        switchTheme={switchTheme}
      />
      {isStudent === 1 ? (
        <TeacherDashboard teacher={teacher} />
      ) : (
        <StudentDashboard student={student} />
      )}
    </>
  );
};

export default Dashboard;
