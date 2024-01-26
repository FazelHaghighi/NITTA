'use client';
import React, { useEffect, useState } from 'react';
import { useBoundStore } from '@/hooks/useBoundStore';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';
import dynamic from 'next/dynamic';
import {
  Button,
  Flex,
  Heading,
  Container,
  Box,
  Card,
  Badge,
  Text,
  Theme,
  Link as RadixLink,
  Kbd,
  Skeleton,
} from '@radix-ui/themes';
import { PartialTeacher } from '@/types/globalTypes';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
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

type LessonAndTeacher = {
  lessonName: string;
  teacherName: string;
  teacherEmail: string;
  is_completed: boolean;
  is_accepted: boolean;
};

export default function MyRequests() {
  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);
  const student = useBoundStore((state) => state.student);
  const updateStudent = useBoundStore((state) => state.updateStudent);
  const [filters, setFilters] = useState<{ teacherName: string } | 'all'>(
    'all'
  );
  const [lessons, setLessons] = useState<LessonAndTeacher[]>([]);
  const [teachers, setTeachers] = useState<PartialTeacher[]>([]);
  const [loaded, isLoaded] = useState(false);

  useEffect(() => {
    getUser().then((res) => {
      updateStudent(res.student);
    });
  }, []);

  useEffect(() => {
    fetch(
      'http://127.0.0.1:8000/getTeachersStudentRequestedFor?' +
        new URLSearchParams({ student_number: student.id })
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setTeachers(res);
      });

    fetch(
      'http://127.0.0.1:8000/getLessonsStudentRequestedFor?' +
        new URLSearchParams({ student_number: student.id })
    )
      .then((res) => res.json())
      .then((res) => {
        const newLessons: LessonAndTeacher[] = [];

        for (const lesson of res)
          newLessons.push({
            lessonName: lesson.lesson_name,
            teacherEmail: lesson.teacher_email,
            teacherName: lesson.teacher_name,
            is_accepted: lesson.is_accepted,
            is_completed: lesson.is_completed,
          });

        setLessons([...newLessons]);
      });

    isLoaded(true);
  }, [student]);

  return (
    <>
      <Header user={student} theme={theme} switchTheme={switchTheme} />
      <Theme accentColor="red">
        <Flex direction="row">
          <Flex className="md:w-[27%] lg:w-[20%] xl:w-[12.5%]">
            <Flex
              direction="column"
              className="w-full pt-4 px-5"
              align="start"
              gap="4"
            >
              <Box className="text-right w-full pt-10 pb-2">
                <Heading as="h4" size="5" weight="medium">
                  دسترسی سریع
                </Heading>
              </Box>
              <Box className="pr-4">
                <Box>
                  <Box className="pb-3">
                    <RadixLink
                      color="gray"
                      size="4"
                      weight="light"
                      onClick={() => {
                        setFilters('all');
                      }}
                    >
                      همه
                    </RadixLink>
                  </Box>
                  <Flex direction="column" gap="2" className="pr-4">
                    {teachers.map((teacher, index) => (
                      <RadixLink
                        key={index}
                        color="gray"
                        size="3"
                        weight="light"
                        onClick={() => {
                          setFilters({ teacherName: teacher.name });
                        }}
                      >
                        {teacher.name}
                      </RadixLink>
                    ))}
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Flex>
          <Flex className="md:w-[43%] lg:w-[60%] xl:w-[75%]" justify="center">
            <Flex direction="column" className="w-1/2 py-4">
              <Box className="w-full py-10 space-y-3">
                <Heading as="h1" size="7">
                  درخواست های شما
                </Heading>
                <Text
                  className="text-[var(--gray-11)]"
                  size="3"
                  weight="medium"
                  as="p"
                >
                  در این قسمت می توانید وضعیت درخواست هایتان را مشاهده کنید
                </Text>
              </Box>
              <Flex direction="column" gap="9">
                {!loaded &&
                  new Array(3).fill(0).map((_, index) => (
                    <Flex direction="column" gap="5" key={index}>
                      <Box className="w-full rounded-md border">
                        <Flex direction="column">
                          <Flex
                            justify="between"
                            grow="1"
                            className="border-b px-4 py-2"
                            align="center"
                          >
                            <Flex direction="column" gap="3">
                              <Flex direction="row" gap="3">
                                <Skeleton className="w-36 h-6" />
                              </Flex>
                              <Flex align="center" gap="2">
                                <Text as="span"> وضعیت :</Text>
                                <Skeleton className="w-12 h-4" />
                                <Flex
                                  className="pr-2"
                                  gap="2"
                                  direction="row"
                                ></Flex>
                              </Flex>
                            </Flex>
                            <Button
                              className="hover:bg-transparent hover:cursor-pointer hover:underline hover:underline-offset-4 hover:decoration-[var(--red-5)]"
                              variant="ghost"
                            >
                              <ArrowTopRightIcon color="gray" />
                              لغو درخواست
                            </Button>
                          </Flex>
                          <Flex
                            className={`flex-[1/2]
                            py-2 px-4`}
                            justify="between"
                          >
                            <Skeleton className="w-24 h-4" />
                            <Skeleton className="w-64 h-4" />
                          </Flex>
                        </Flex>
                      </Box>
                    </Flex>
                  ))}
                {lessons.length > 0 &&
                  lessons
                    .filter(
                      (lesson) =>
                        filters === 'all' ||
                        lesson.teacherName === filters.teacherName
                    )
                    .map((lesson, index) => (
                      <Flex key={index} direction="column" gap="5">
                        <Box className="w-full rounded-md border">
                          <Flex direction="column">
                            <Flex
                              justify="between"
                              grow="1"
                              className="border-b px-4 py-2"
                              align="center"
                            >
                              <Flex direction="column" gap="3">
                                <Flex direction="row" gap="3">
                                  <Heading weight="medium" as="h2" size="5">
                                    {lesson.lessonName}
                                  </Heading>
                                </Flex>
                                <Flex>
                                  <Text as="span"> وضعیت :</Text>
                                  <Flex
                                    className="pr-2"
                                    gap="2"
                                    direction="row"
                                  >
                                    {lesson.is_completed &&
                                      lesson.is_accepted && (
                                        <Badge size="1" color="green">
                                          تایید شده توسط استاد
                                        </Badge>
                                      )}
                                    {!lesson.is_completed && (
                                      <Badge size="1" color="orange">
                                        در حال بررسی
                                      </Badge>
                                    )}
                                    {lesson.is_completed &&
                                      !lesson.is_accepted && (
                                        <Badge size="1" color="red">
                                          درخواست رد شد
                                        </Badge>
                                      )}
                                  </Flex>
                                </Flex>
                              </Flex>
                              {!lesson.is_completed && (
                                <Button
                                  className="hover:bg-transparent hover:cursor-pointer hover:underline hover:underline-offset-4 hover:decoration-[var(--red-5)]"
                                  variant="ghost"
                                >
                                  <ArrowTopRightIcon color="gray" />
                                  لغو درخواست
                                </Button>
                              )}
                            </Flex>
                            <Flex
                              className={`flex-[1/2] ${
                                (lesson.is_completed &&
                                  lesson.is_accepted &&
                                  'bg-[var(--green-3)]') ||
                                (!lesson.is_completed &&
                                  'bg-[var(--orange-3)]') ||
                                (lesson.is_completed &&
                                  !lesson.is_accepted &&
                                  'bg-[var(--red-3)]')
                              } py-2 px-4`}
                              justify="between"
                            >
                              <Text>{lesson.teacherName}</Text>
                              <Text>{lesson.teacherEmail}</Text>
                            </Flex>
                          </Flex>
                        </Box>
                      </Flex>
                    ))}
                {lessons.length === 0 && loaded && (
                  <Heading>درخواستی برای نمایش وجود ندارد.</Heading>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Theme>
    </>
  );
}
