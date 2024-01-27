'use client';
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  IconButton,
  Text,
  TextField,
} from '@radix-ui/themes';
import { SunIcon, MoonIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Student, Teacher, ThemeType } from '@/types/globalTypes';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { useBoundStore } from '@/hooks/useBoundStore';
import { useState } from 'react';

function toArabicNumber(str: string) {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
}

function DeesktopHeader({
  theme,
  switchTheme,
}: {
  theme: ThemeType;
  switchTheme: () => void;
}) {
  const router = useRouter();

  return (
    <Flex
      className="w-full border-b px-12 h-[60px]"
      justify="between"
      align="center"
      dir="ltr"
    >
      <Flex gap="6" className="pt-1" align="center">
        <Button
          color="gray"
          variant="ghost"
          onClick={() => {
            switchTheme();
            localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
          }}
        >
          {theme === 'dark' ? (
            <MoonIcon width={16} height={16} />
          ) : (
            <SunIcon width={16} height={16} />
          )}
        </Button>

        <Button
          onClick={() => {
            deleteCookie('access_token');
            deleteCookie('refresh_token');

            router.push('/');
          }}
          variant="ghost"
          color="red"
          className={`${
            theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
          } hover:cursor-pointer`}
        >
          خروج
        </Button>
      </Flex>
      <Flex align="center" gap="6">
        <Flex direction="column" align="center" gap="1">
          <Text size="3">پنل ادمین</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

function Header({
  theme,
  switchTheme,
}: {
  theme: ThemeType;
  switchTheme: () => void;
}) {
  return (
    <>
      <Box
        style={{
          backgroundColor: theme === 'dark' ? '#111113' : 'white',
        }}
        className="sticky top-0 z-50"
      >
        <DeesktopHeader theme={theme} switchTheme={switchTheme} />
      </Box>
    </>
  );
}

export default function Admin() {
  const [teacherName, setTeacherName] = useState('');
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherDepId, setTeacherDepId] = useState('');

  const [studentName, setStudentName] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentId, setStudentId] = useState('');

  const [assistantId, setAssistantId] = useState('');
  const [assistantCourseId, setAssistantCourseId] = useState('');
  const [assistantTeacherId, setAssistantTeacherId] = useState('');

  const [courseName, setCourseName] = useState('');
  const [courseUnit, setCourseUnit] = useState('');

  const [depName, setDepName] = useState('');

  const { toast } = useToast();

  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);
  return (
    <>
      <Header theme={theme} switchTheme={switchTheme} />
      <Flex className="w-2/3 py-6 mx-auto">
        <Card className="w-full">
          <Flex className="w-full gap-4 space-y-4" wrap="wrap">
            <Flex direction="column" className="w-1/3 space-y-4 mt-4">
              <Flex>
                <Text>اضافه کردن استاد</Text>
              </Flex>
              <Flex direction="column" className="w-full gap-3">
                <TextField.Input
                  placeholder="نام"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                />
                <TextField.Input
                  value={teacherUsername}
                  onChange={(e) => setTeacherUsername(e.target.value)}
                  placeholder="نام کاربری"
                />
                <TextField.Input
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  placeholder="ایمیل"
                />
                <TextField.Input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="پسوورد"
                />
                <TextField.Input
                  value={teacherDepId}
                  onChange={(e) => setTeacherDepId(e.target.value)}
                  placeholder="آیدی گروه آموزشی"
                />
                <Button
                  onClick={() => {
                    fetch('http://127.0.0.1:8000/teachers/', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: teacherName,
                        username: teacherUsername,
                        mail: teacherEmail,
                        password: teacherPassword,
                        dep_id: teacherDepId,
                      }),
                    }).then((res) => {
                      if (res.status === 200) {
                        setTeacherName('');
                        setTeacherUsername('');
                        setTeacherEmail('');
                        setTeacherPassword('');
                        setTeacherDepId('');
                        toast({
                          variant: 'default',
                          title: 'اضافه کردن استاد',
                          description: 'استاد با موفقیت اضافه شد',
                        });
                      } else {
                        toast({
                          variant: 'destructive',
                          title: 'اضافه کردن استاد',
                          description: 'خطا در اضافه کردن استاد',
                        });
                      }
                    });
                  }}
                  className="w-1/2 self-center"
                >
                  اضافه کردن استاد
                </Button>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              className="space-y-4"
              style={{
                width: 'calc(33.33333% - 16px)',
              }}
            >
              <Flex>
                <Text>اضافه کردن دانشجو</Text>
              </Flex>
              <Flex direction="column" className="w-full gap-3">
                <TextField.Input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="نام"
                />
                <TextField.Input
                  value={studentUsername}
                  onChange={(e) => setStudentUsername(e.target.value)}
                  placeholder="نام کاربری"
                />
                <TextField.Input
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="ایمیل"
                />
                <TextField.Input
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="پسوورد"
                />
                <TextField.Input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="شماره دانشجویی"
                />
                <Button
                  onClick={() => {
                    fetch('http://127.0.0.1:8000/students/', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: studentName,
                        username: studentUsername,
                        email: studentEmail,
                        password: studentPassword,
                        student_number: studentId,
                      }),
                    }).then((res) => {
                      if (res.status === 200) {
                        setStudentName('');
                        setStudentUsername('');
                        setStudentEmail('');
                        setStudentPassword('');
                        setStudentId('');
                        toast({
                          variant: 'default',
                          title: 'اضافه کردن دانشجو',
                          description: 'دانشجو با موفقیت اضافه شد',
                        });
                      } else {
                        toast({
                          variant: 'destructive',
                          title: 'اضافه کردن دانشجو',
                          description: 'خطا در اضافه کردن دانشجو',
                        });
                      }
                    });
                  }}
                  className="w-1/2 self-center"
                >
                  اضافه کردن دانشجو
                </Button>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              className="space-y-4"
              style={{
                width: 'calc(33.33333% - 16px)',
              }}
            >
              <Flex>
                <Text>اضافه کردن دستیار آموزشی</Text>
              </Flex>
              <Flex direction="column" className="w-full gap-3">
                <TextField.Input
                  value={assistantId}
                  onChange={(e) => setAssistantId(e.target.value)}
                  placeholder="آیدی دستیار آموزشی"
                />
                <TextField.Input
                  value={assistantCourseId}
                  onChange={(e) => setAssistantCourseId(e.target.value)}
                  placeholder="آیدی درس"
                />
                <TextField.Input
                  value={assistantTeacherId}
                  onChange={(e) => setAssistantTeacherId(e.target.value)}
                  placeholder="آیدی استاد"
                />
                <Button
                  onClick={() => {
                    fetch('http://127.0.0.1:8000/tas/', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        student_id: assistantId,
                        lesson_id: assistantCourseId,
                        teacher_id: assistantTeacherId,
                      }),
                    }).then((res) => {
                      if (res.status === 200) {
                        setAssistantId('');
                        setAssistantCourseId('');
                        setAssistantTeacherId('');
                        toast({
                          variant: 'default',
                          title: 'اضافه کردن دستیار آموزشی',
                          description: 'دستیار آموزشی با موفقیت اضافه شد',
                        });
                      } else {
                        toast({
                          variant: 'destructive',
                          title: 'اضافه کردن دستیار آموزشی',
                          description: 'خطا در اضافه کردن دستیار آموزشی',
                        });
                      }
                    });
                  }}
                  className="w-1/2 self-center"
                >
                  اضافه کردن دستیار آموزشی
                </Button>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              className="space-y-4"
              style={{
                width: 'calc(33.33333% - 16px)',
              }}
            >
              <Flex>
                <Text>اضافه کردن درس</Text>
              </Flex>
              <Flex direction="column" className="w-full gap-3">
                <TextField.Input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="نام درس"
                />
                <TextField.Input
                  value={courseUnit}
                  onChange={(e) => setCourseUnit(e.target.value)}
                  placeholder="تعداد واحد درس"
                />
                <Button
                  onClick={() => {
                    fetch('http://127.0.0.1:8000/lessons/', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: courseName,
                        credit_points: Number(courseUnit),
                      }),
                    }).then((res) => {
                      if (res.status === 200) {
                        setCourseName('');
                        setCourseUnit('');
                        toast({
                          variant: 'default',
                          title: 'اضافه کردن درس',
                          description: 'درس با موفقیت اضافه شد',
                        });
                      } else {
                        console.log(res);
                        toast({
                          variant: 'destructive',
                          title: 'اضافه کردن درس',
                          description: 'خطا در اضافه کردن درس',
                        });
                      }
                    });
                  }}
                  className="w-1/2 self-center"
                >
                  اضافه کردن درس
                </Button>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              className="space-y-4"
              style={{
                width: 'calc(33.33333% - 16px)',
              }}
            >
              <Flex>
                <Text>اضافه کردن گروه آموزشی</Text>
              </Flex>
              <Flex direction="column" className="w-full gap-3">
                <TextField.Input
                  value={depName}
                  onChange={(e) => setDepName(e.target.value)}
                  placeholder="نام گروه آموزشی"
                />
                <Button
                  onClick={() => {
                    fetch('http://127.0.0.1:8000/departments/', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: depName,
                      }),
                    }).then((res) => {
                      if (res.status === 200) {
                        setDepName('');
                        toast({
                          variant: 'default',
                          title: 'اضافه کردن گروه آموزشی',
                          description: 'گروه آموزشی با موفقیت اضافه شد',
                        });
                      } else {
                        console.log(res);
                        toast({
                          variant: 'destructive',
                          title: 'اضافه کردن گروه آموزشی',
                          description: 'خطا در اضافه کردن گروه آموزشی',
                        });
                      }
                    });
                  }}
                  className="w-1/2 self-center"
                >
                  اضافه کردن گروه آموزشی
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </>
  );
}
