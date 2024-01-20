import { PartialTeacher, Student, Teacher } from '@/types/globalTypes';
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

function toArabicNumber(str: string) {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
}

async function getDeps() {
  try {
    const res = await fetch('http://127.0.0.1:8000/getDepartments', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

type Lesson = {
  lessonName: string;
};

type Request = {
  lessonName: string;
  studentName: string;
  studentEmail: string;
  lessonUnit: number;
  studentPreqsGrades: { lessonName: string; grade: number }[];
};

export default function TeacherDashboard({ teacher }: { teacher: Teacher }) {
  const currStudent = useBoundStore((state) => state.currStudent);
  const setCurrStudent = useBoundStore((state) => state.setCurrStudent);
  const [students, setStudents] = useState<
    { student: Student; selected: boolean }[]
  >([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [firstStudent, setFirstStudent] = useState(
    currStudent.id === '' ? true : false
  );
  const [filters, setFilters] = useState<{ lessonName: string } | 'all'>('all');
  const firstUpdate = useRef(true);

  useEffect(() => {
    const newStudents: { student: Student; selected: boolean }[] = [];
    getDeps().then((res) => {
      res.students.forEach((student: Student) => {
        newStudents.push({
          student: {
            email: student.email,
            id: student.id,
            name: student.name,
            username: student.username,
          },
          selected: false,
        });
      });
    });
    setStudents(newStudents);
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    fetch('http://127.0.0.1:8000/getLessonsByTeacher', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: teacher.username }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLessons(res);
      });

    fetch('http://127.0.0.1:8000/getAllLessonsAndTeacherByDepartment', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_number: currStudent.id }),
    })
      .then((res) => res.json())
      .then((res) => {
        const newRequests: Request[] = [];
        for (const request of res) {
          newRequests.push({
            lessonName: request.lesson_name,
            studentEmail: request.student_email,
            studentName: request.student_name,
            lessonUnit: request.credit_points,
            studentPreqsGrades: request.preqs_grades,
          });
        }
        setRequests([...newRequests]);
      });

    setFilters('all');
  }, [currStudent, teacher]);

  return (
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
                  {lessons.map((lesson, index) => (
                    <RadixLink
                      key={index}
                      color="gray"
                      size="3"
                      weight="light"
                      onClick={() => {
                        setFilters({ lessonName: lesson.lessonName });
                      }}
                    >
                      {lesson.lessonName}
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
              {requests.length > 0 &&
                requests
                  .filter(
                    (request) =>
                      filters === 'all' ||
                      request.lessonName === filters.lessonName
                  )
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
                            <Flex direction="column" gap="3">
                              <Flex direction="row" gap="3">
                                <Heading weight="medium" as="h2" size="5">
                                  {request.lessonName}
                                </Heading>
                                <Kbd
                                  size="3"
                                  style={{ fontFamily: '--font-vazirmatn' }}
                                >
                                  {toArabicNumber(
                                    request.lessonUnit.toString()
                                  )}{' '}
                                  واحد
                                </Kbd>
                              </Flex>
                              <Flex>
                                <Text as="span">پیش نیاز :</Text>
                                <Flex className="pr-2" gap="2" direction="row">
                                  {request.studentPreqsGrades.map(
                                    (prereq, index) => (
                                      <Badge
                                        size="1"
                                        color="orange"
                                        key={index}
                                      >
                                        {prereq.lessonName}
                                        {prereq.grade}
                                      </Badge>
                                    )
                                  )}
                                  {request.studentPreqsGrades.length === 0 && (
                                    <Badge size="1" color="green">
                                      ندارد
                                    </Badge>
                                  )}
                                </Flex>
                              </Flex>
                              <Flex>
                                <Text as="span">هم نیاز :</Text>
                                <Flex className="pr-2" gap="2" direction="row">
                                  <Badge size="1" color="blue">
                                    ندارد
                                  </Badge>
                                </Flex>
                              </Flex>
                            </Flex>
                            <Link href="/request">
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
                            <Text>{request.studentName}</Text>
                            <Text>{request.studentEmail}</Text>
                          </Flex>
                        </Flex>
                      </Box>
                    </Flex>
                  ))}
              {requests.length === 0 && (
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
              {students.length === 0 ? (
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
                  {students.map((student, index) => (
                    <Box
                      onClick={() => {
                        if (firstStudent) {
                          setFirstStudent(false);
                        }
                        if (student.selected) {
                          return;
                        }
                        setStudents(
                          students.map((s) =>
                            s.student.id === student.student.id
                              ? { ...s, selected: true }
                              : { ...s, selected: false }
                          )
                        );
                        setCurrStudent(student.student);
                      }}
                      data-state={
                        (student.selected && 'selected') ||
                        (currStudent === student.student && 'selected') ||
                        (firstStudent && index === 0 && 'selected')
                      }
                      className="rounded-full py-[6px] px-4 transition-colors hover:cursor-pointer hover:bg-[var(--red-5)] data-[state=selected]:bg-[var(--red-5)]"
                      key={index}
                    >
                      <Text size="3" weight="regular">
                        {student.student.name}
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
  );
}
