import {
  PartialStudent,
  PartialTeacher,
  Student,
  Teacher,
} from '@/types/globalTypes';
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
  Blockquote,
  Card,
} from '@radix-ui/themes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBoundStore } from '@/hooks/useBoundStore';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowTopRightIcon,
  CheckIcon,
  Cross1Icon,
} from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import dynamic from 'next/dynamic';
const Header = dynamic(() => import('./teacher-header'));

function toArabicNumber(str: string) {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
}

type Lesson = {
  name: string;
  units: string;
};

type Request = {
  lessonName: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  lessonUnit: number;
  additionalNote: string;
  isCompleted: boolean;
  isAccepted: boolean;
  studentPreqsGrades: { lessonName: string; grade: number }[];
};

export default function TeacherDashboard({ teacher }: { teacher: Teacher }) {
  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);
  const currLesson = useBoundStore((state) => state.currLesson);
  const setCurrLesson = useBoundStore((state) => state.setCurrLesson);
  const [students, setStudents] = useState<PartialStudent[]>([]);
  const [lessons, setLessons] = useState<
    { lesson: Lesson; selected: boolean }[]
  >([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filters, setFilters] = useState<
    { studentName: string } | 'all' | 'completed' | 'not_completed'
  >('all');
  const { toast } = useToast();

  useEffect(() => {
    fetch(
      'http://127.0.0.1:8000/getLessonsByTeacher?' +
        new URLSearchParams({
          username: teacher.username,
        })
    )
      .then((res) => res.json())
      .then((res: any[]) => {
        const newLesson: { lesson: Lesson; selected: boolean }[] = [];
        res.forEach((lesson) => {
          newLesson.push({
            lesson: {
              units: lesson.credit_points,
              name: lesson.name,
            },
            selected: false,
          });
        });
        setLessons([...newLesson]);
      });
  }, [teacher]);

  useEffect(() => {
    fetch(
      'http://127.0.0.1:8000/getStudentsRequestingForTeacher?' +
        new URLSearchParams({ username: teacher.username })
    )
      .then((res) => res.json())
      .then((res) => {
        setRequests([...res]);
      });

    setFilters('all');
  }, [teacher]);

  useEffect(() => {
    const newStudents: PartialStudent[] = [];
    requests.forEach(({ studentName, lessonName }) => {
      if (
        !newStudents.find((student) => student.name === studentName) &&
        lessonName === currLesson.name
      ) {
        newStudents.push({
          name: studentName,
        });
      }
    });
    setStudents([...newStudents]);
    setFilters('all');
  }, [requests, currLesson]);

  return (
    <>
      <Header
        students={students}
        user={teacher}
        theme={theme}
        switchTheme={switchTheme}
        currLesson={currLesson}
        lessons={lessons}
        setCurrLesson={setCurrLesson}
        setLessons={setLessons}
      />
      <Theme accentColor="red">
        <Flex direction="row">
          <Flex
            className="md:w-[27%] lg:w-[20%] xl:w-[16%]"
            display={{
              initial: 'none',
              sm: 'flex',
            }}
          >
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
              <Flex direction="column" gap="4" className="pr-4">
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
                    {students.map((student, index) => (
                      <RadixLink
                        key={index}
                        color="gray"
                        size="3"
                        weight="light"
                        onClick={() => {
                          setFilters({ studentName: student.name });
                        }}
                      >
                        {student.name}
                      </RadixLink>
                    ))}
                  </Flex>
                </Box>
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
                      وضعیت بررسی
                    </RadixLink>
                  </Box>
                  {students.length > 0 && (
                    <Flex direction="column" gap="2" className="pr-4">
                      <RadixLink
                        color="gray"
                        size="3"
                        weight="light"
                        onClick={() => {
                          setFilters('completed');
                        }}
                      >
                        کامل شده
                      </RadixLink>
                      <RadixLink
                        color="gray"
                        size="3"
                        weight="light"
                        onClick={() => {
                          setFilters('not_completed');
                        }}
                      >
                        در انتظار بررسی
                      </RadixLink>
                    </Flex>
                  )}
                </Box>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            className="md:w-[43%] lg:w-[60%] xl:w-[68%]"
            justify="center"
            mx={{
              initial: 'auto',
            }}
          >
            <Flex direction="column" className="w-[90%] sm:w-1/2 py-4">
              <Box className="w-full py-10 space-y-3">
                {currLesson.name !== '' && (
                  <Heading
                    as="h1"
                    size={{
                      initial: '5',
                      sm: '7',
                    }}
                  >
                    متقاضیان دستیار آموزشی برای درس {currLesson.name}
                  </Heading>
                )}
                {currLesson.name === '' && (
                  <Heading as="h1" size="7">
                    ابتدا درسی را از لیست دروس انتخاب کنید
                  </Heading>
                )}
                <Text
                  className="text-[var(--gray-11)]"
                  size="3"
                  weight="medium"
                  as="p"
                >
                  بررسی و انتخاب دستیاران آموزشی برای این درس
                </Text>
              </Box>
              <Flex direction="column" gap="9">
                {requests.length > 0 &&
                  requests
                    .filter((request) => request.lessonName === currLesson.name)
                    .filter((request) => {
                      if (filters === 'all') return true;
                      if (filters === 'completed') return request.isCompleted;
                      if (filters === 'not_completed')
                        return !request.isCompleted;
                      if (filters.studentName)
                        return request.studentName === filters.studentName;
                    })
                    .map((request, index) => (
                      <Flex key={index} direction="column" gap="5">
                        <Box className="w-full rounded-md border">
                          <Flex direction="column">
                            <Flex
                              justify="between"
                              grow="1"
                              className="border-b px-4 py-2"
                              align="center"
                            >
                              <Flex
                                direction="column"
                                className="w-[70%]"
                                gap="3"
                              >
                                <Flex direction="row" className="pb-2" gap="3">
                                  <Heading weight="medium" as="h2" size="5">
                                    {request.studentName}
                                  </Heading>
                                </Flex>
                                <Flex>
                                  <Text as="span">شماره دانشجویی :</Text>
                                  <Flex
                                    className="pr-2"
                                    gap="2"
                                    direction="row"
                                  >
                                    <Badge size="2" color="green" key={index}>
                                      {toArabicNumber(request.studentId)}
                                    </Badge>
                                  </Flex>
                                </Flex>
                                <Flex>
                                  <Text as="span">ایمیل :</Text>
                                  <Flex
                                    className="pr-2"
                                    gap="2"
                                    direction="row"
                                  >
                                    <Badge size="2" color="blue" key={index}>
                                      {toArabicNumber(request.studentEmail)}
                                    </Badge>
                                  </Flex>
                                </Flex>
                                <Flex>
                                  <Text as="span">وضعیت</Text>
                                  <Flex className="pr-2" gap="2">
                                    <Badge
                                      size="1"
                                      color={`${
                                        (request.isAccepted && 'blue') ||
                                        (!request.isCompleted && 'orange') ||
                                        'red'
                                      }`}
                                    >
                                      {request.isCompleted &&
                                        request.isAccepted &&
                                        'تایید شده'}
                                      {request.isCompleted &&
                                        !request.isAccepted &&
                                        'رد شده'}
                                      {!request.isCompleted &&
                                        'در انتظار بررسی'}
                                    </Badge>
                                  </Flex>
                                </Flex>
                                {request.additionalNote &&
                                  request.additionalNote !== '' && (
                                    <Flex align="center">
                                      <Text as="span">توضیح اضافه</Text>
                                      <Flex className="pr-2" gap="2">
                                        <Card dir="rtl" className="min-w-[90%]">
                                          <Text as="p" size="2">
                                            {request.additionalNote}
                                          </Text>
                                        </Card>
                                      </Flex>
                                    </Flex>
                                  )}
                              </Flex>
                              {!request.isCompleted && (
                                <Flex direction="column" gap="2">
                                  <Button
                                    onClick={async () => {
                                      const res = await fetch(
                                        'http://127.0.0.1:8000/updateRequest',
                                        {
                                          method: 'post',
                                          headers: {
                                            'Content-Type': 'application/json',
                                          },
                                          body: JSON.stringify({
                                            student_number: request.studentId,
                                            teacher_username: teacher.username,
                                            lessonName: request.lessonName,
                                            is_accepted: false,
                                          }),
                                        }
                                      );

                                      const result = await res.json();

                                      if (result.code === '-1') {
                                        toast({
                                          variant: 'destructive',
                                          title: 'خطا',
                                          description:
                                            'مشکلی پیش آمده لطفا مجددا تلاش کنید',
                                        });
                                      } else {
                                        toast({
                                          variant: 'default',
                                          title: 'موفق',
                                          description:
                                            'درخواست با موفقیت رد شد',
                                        });

                                        fetch(
                                          'http://127.0.0.1:8000/getStudentsRequestingForTeacher?' +
                                            new URLSearchParams({
                                              username: teacher.username,
                                            })
                                        )
                                          .then((res) => res.json())
                                          .then((res) => {
                                            setRequests([...res]);
                                          });
                                      }
                                    }}
                                    className="hover:bg-transparent hover:cursor-pointer hover:underline hover:underline-offset-4 hover:decoration-[var(--red-5)]"
                                    variant="ghost"
                                  >
                                    <Cross1Icon className="" color="gray" />
                                    رد درخواست
                                  </Button>
                                  <Button
                                    className="hover:bg-transparent hover:cursor-pointer hover:underline hover:underline-offset-4 hover:decoration-[var(--green-5)]"
                                    variant="ghost"
                                    color="green"
                                    onClick={async () => {
                                      const res = await fetch(
                                        'http://127.0.0.1:8000/updateRequest',
                                        {
                                          method: 'post',
                                          headers: {
                                            'Content-Type': 'application/json',
                                          },
                                          body: JSON.stringify({
                                            student_number: request.studentId,
                                            teacher_username: teacher.username,
                                            lessonName: request.lessonName,
                                            is_accepted: true,
                                          }),
                                        }
                                      );

                                      const result = await res.json();

                                      if (result.code === '-1') {
                                        toast({
                                          variant: 'destructive',
                                          title: 'خطا',
                                          description:
                                            'مشکلی پیش آمده لطفا مجددا تلاش کنید',
                                        });
                                      } else {
                                        toast({
                                          variant: 'default',
                                          title: 'موفق',
                                          description:
                                            'درخواست با موفقیت تایید شد',
                                        });

                                        fetch(
                                          'http://127.0.0.1:8000/getStudentsRequestingForTeacher?' +
                                            new URLSearchParams({
                                              username: teacher.username,
                                            })
                                        )
                                          .then((res) => res.json())
                                          .then((res) => {
                                            setRequests([...res]);
                                          });
                                      }
                                    }}
                                  >
                                    <CheckIcon color="gray" />
                                    تایید درخواست
                                  </Button>
                                </Flex>
                              )}
                            </Flex>
                            <Flex
                              direction="column"
                              className="flex-[1/2] bg-[var(--red-3)] py-2 px-4"
                              justify="between"
                            >
                              {request.studentPreqsGrades.length > 0 &&
                                request.studentPreqsGrades.map(
                                  (preq, index) => (
                                    <Flex key={index} gap="3">
                                      <Text>نمره در درس {preq.lessonName}</Text>
                                      <Kbd>
                                        {toArabicNumber(preq.grade.toString())}
                                      </Kbd>
                                    </Flex>
                                  )
                                )}
                              {request.studentPreqsGrades.length === 0 && (
                                <Text>این درس پیش نیازی ندارد</Text>
                              )}
                            </Flex>
                          </Flex>
                        </Box>
                      </Flex>
                    ))}
                {requests.length > 0 &&
                  currLesson.name !== '' &&
                  requests
                    .filter((request) => request.lessonName === currLesson.name)
                    .filter((request) => {
                      if (filters === 'all') return true;
                      if (filters === 'completed') return request.isCompleted;
                      if (filters === 'not_completed')
                        return !request.isCompleted;
                      if (filters.studentName)
                        return request.studentName === filters.studentName;
                    }).length === 0 && (
                    <Heading>نتیجه ای با این فیلتر یافت نشد.</Heading>
                  )}
                {requests.length === 0 && (
                  <Heading>
                    در حال حاضر درخواستی برای این درس وجود ندارد.
                  </Heading>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            display={{
              initial: 'none',
              sm: 'flex',
            }}
            className="md:w-[27%] lg:w-[20%] xl:w-[16%] rounded-md sticky top-[60px]"
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
                    دروس
                  </Heading>
                </Box>
                {students.length === 0 && currLesson.name !== '' ? (
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
                    {lessons.map((lesson, index) => (
                      <Box
                        onClick={() => {
                          if (lesson.selected) {
                            return;
                          }
                          setLessons(
                            lessons.map((l) =>
                              l.lesson.name === lesson.lesson.name
                                ? { ...l, selected: true }
                                : { ...l, selected: false }
                            )
                          );
                          setCurrLesson(lesson.lesson);
                        }}
                        data-state={
                          (lesson.selected && 'selected') ||
                          (currLesson === lesson.lesson && 'selected')
                        }
                        className="rounded-full py-[6px] px-4 transition-colors hover:cursor-pointer hover:bg-[var(--red-5)] data-[state=selected]:bg-[var(--red-5)]"
                        key={index}
                      >
                        <Text size="3" weight="regular">
                          {lesson.lesson.name}
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
