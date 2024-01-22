'use client';
import { PartialTeacher } from '@/types/globalTypes';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Kbd,
  Skeleton,
  Text,
  Theme,
  Link as RadixLink,
} from '@radix-ui/themes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBoundStore } from '@/hooks/useBoundStore';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import dynamic from 'next/dynamic';
import { getCookie, setCookie } from 'cookies-next';
const Header = dynamic(() => import('./header'));

function toArabicNumber(str: string) {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
}

export async function getUser() {
  const access_token = getCookie('access_token');
  const refresh_token = getCookie('refresh_token');
  try {
    const res = await fetch('http://127.0.0.1:8000/getUserById', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: access_token,
        refresh_token: refresh_token,
      }),
    });

    const user = await res.json();

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

async function getDeps() {
  try {
    const res = await fetch('http://127.0.0.1:8000/getDepartments');

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export type TA = {
  taName: string;
  teacherName: string;
  lessonName: string;
  comments: string[];
  voteNumbers: number;
  rate: number;
};

export default function Rate() {
  const student = useBoundStore((state) => state.student);
  const updateStudent = useBoundStore((state) => state.updateStudent);
  const currDep = useBoundStore((state) => state.currDep);
  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);
  const setCurrDep = useBoundStore((state) => state.setCurrDep);
  //   const setRequest = useBoundStore((state) => state.setRequest);
  const [deps, setDeps] = useState<{ name: string; selected: boolean }[]>([]);
  const [teachers, setTeachers] = useState<PartialTeacher[]>([]);
  const [teacherAssistants, setTeacherAssistants] = useState<TA[]>([]);
  const [firstDep, setFirstDep] = useState(currDep === '' ? true : false);
  const [filters, setFilters] = useState<{ teacherName: string } | 'all'>(
    'all'
  );
  const firstUpdate = useRef(true);

  useEffect(() => {
    const newDeps: { name: string; selected: boolean }[] = [];
    getDeps().then((res) => {
      res.departments.forEach((dep: string) => {
        newDeps.push({ name: dep, selected: false });
      });
      setDeps([...newDeps]);
    });
  }, []);

  useEffect(() => {
    getUser().then((res) => {
      updateStudent(res.student);
    });
  }, []);

  useEffect(() => {
    const newDeps: { name: string; selected: boolean }[] = [];
    getDeps().then((res) => {
      res.departments.forEach((dep: string) => {
        newDeps.push({ name: dep, selected: false });
      });
      setDeps([...newDeps]);
    });
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    fetch(
      'http://127.0.0.1:8000/getTeachersByDepartment?' +
        new URLSearchParams({ dep_name: currDep })
    )
      .then((res) => res.json())
      .then((res) => {
        setTeachers(res);
      });

    fetch('http://127.0.0.1:8000/getTAs')
      .then((res) => res.json())
      .then((res) => {
        const newLessons: LessonAndTeacher[] = [];
        for (const lesson of res) {
          newLessons.push({
            lessonName: lesson.lesson_name,
            teacherName: lesson.teacher_name,
            teacherEmail: lesson.teacher_email,
            lessonUnit: lesson.credit_points,
            lessonPrerequisite: lesson.preqs,
          });
        }
        setLessons([...newLessons]);
      });

    setFilters('all');
  }, [currDep]);

  return (
    <>
      <Header user={student} switchTheme={switchTheme} theme={theme} />
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
                  دروس قابل ارائه
                </Heading>
                <Text
                  className="text-[var(--gray-11)]"
                  size="3"
                  weight="medium"
                  as="p"
                >
                  انتخاب درس مورد نظر برای درخواست دستیار آموزشی
                </Text>
              </Box>
              <Flex direction="column" gap="9">
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
                                  <Kbd
                                    size="3"
                                    style={{ fontFamily: '--font-vazirmatn' }}
                                  >
                                    {toArabicNumber(
                                      lesson.lessonUnit.toString()
                                    )}{' '}
                                    واحد
                                  </Kbd>
                                </Flex>
                                <Flex>
                                  <Text as="span">پیش نیاز :</Text>
                                  <Flex
                                    className="pr-2"
                                    gap="2"
                                    direction="row"
                                  >
                                    {lesson.lessonPrerequisite.map(
                                      (prereq, index) => (
                                        <Badge
                                          size="1"
                                          color="orange"
                                          key={index}
                                        >
                                          {prereq}
                                        </Badge>
                                      )
                                    )}
                                    {lesson.lessonPrerequisite.length === 0 && (
                                      <Badge size="1" color="green">
                                        ندارد
                                      </Badge>
                                    )}
                                  </Flex>
                                </Flex>
                                <Flex>
                                  <Text as="span">هم نیاز :</Text>
                                  <Flex
                                    className="pr-2"
                                    gap="2"
                                    direction="row"
                                  >
                                    <Badge size="1" color="blue">
                                      ندارد
                                    </Badge>
                                  </Flex>
                                </Flex>
                              </Flex>
                              <Link
                                href="/request"
                                onClick={() => {
                                  setRequest(lesson, student);
                                }}
                              >
                                <Button
                                  className="hover:bg-transparent hover:cursor-pointer hover:underline hover:underline-offset-4 hover:decoration-[var(--red-5)]"
                                  variant="ghost"
                                >
                                  <ArrowTopRightIcon color="gray" />
                                  درخواست
                                </Button>
                              </Link>
                            </Flex>
                            <Flex
                              className="flex-[1/2] bg-[var(--red-3)] py-2 px-4"
                              justify="between"
                            >
                              <Text>{lesson.teacherName}</Text>
                              <Text>{lesson.teacherEmail}</Text>
                            </Flex>
                          </Flex>
                        </Box>
                      </Flex>
                    ))}
                {lessons.length === 0 && (
                  <Heading>در حال حاضر درس قابل ارائه ایی وجود ندارد.</Heading>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            className="md:w-[27%] lg:w-[20%] xl:w-[12.5%] rounded-md sticky top-[60px]"
            style={{
              height: 'calc(100vh - 60px)',
            }}
          >
            <ScrollArea className="w-full">
              <Flex
                direction="column"
                className="w-full pt-4 px-5"
                align="start"
                gap="4"
              >
                <Box className="text-right w-full">
                  <Heading as="h5" size="3">
                    گروه های آموزشی
                  </Heading>
                </Box>
                {deps.length === 0 ? (
                  new Array(20)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton
                        key={index}
                        className="w-full h-8 mb-4 rounded-md"
                      />
                    ))
                ) : (
                  <Flex dir="rtl" direction="column" className="w-full" gap="1">
                    {deps.map((dep, index) => (
                      <Box
                        onClick={() => {
                          if (firstDep) {
                            setFirstDep(false);
                          }
                          if (dep.selected) {
                            return;
                          }
                          setDeps(
                            deps.map((d) =>
                              d.name === dep.name
                                ? { ...d, selected: true }
                                : { ...d, selected: false }
                            )
                          );
                          setCurrDep(dep.name);
                        }}
                        data-state={
                          (dep.selected && 'selected') ||
                          (currDep === dep.name && 'selected') ||
                          (firstDep && index === 0 && 'selected')
                        }
                        className="rounded-full py-[6px] px-4 transition-colors hover:cursor-pointer hover:bg-[var(--red-5)] data-[state=selected]:bg-[var(--red-5)]"
                        key={index}
                      >
                        <Text size="3" weight="regular">
                          {dep.name}
                        </Text>
                      </Box>
                    ))}
                  </Flex>
                )}
              </Flex>
            </ScrollArea>
          </Flex>
        </Flex>
      </Theme>
    </>
  );
}
