'use client';
import React, { FormEventHandler, useEffect, useState } from 'react';
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
  TextField,
  Text,
  TextArea,
} from '@radix-ui/themes';
import Link from 'next/link';

import { Label } from '@radix-ui/react-label';
import { useToast } from '@/components/ui/use-toast';

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

export default function RequestPage() {
  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);
  const user = useBoundStore((state) => state.student);
  const updateStudent = useBoundStore((state) => state.updateStudent);
  const request = useBoundStore((state) => state.request);
  const [preqsGrades, setPreqsGrades] = useState<number[]>([]);
  const [errors, setErrors] = useState<boolean[]>(
    new Array(request.reqInfo.lessonPrerequisite.length).fill(false)
  );
  const [emptyErrors, setEmptyErrors] = useState<boolean[]>(
    new Array(request.reqInfo.lessonPrerequisite.length).fill(false)
  );
  const [additional_note, setAdditional_note] = useState('');
  const { toast } = useToast();

  const onSubmit: FormEventHandler<HTMLElement> = async (event) => {
    event.preventDefault();
    if (errors.includes(true) || emptyErrors.includes(true)) return;
    if (preqsGrades.length === 0) {
      setEmptyErrors([...emptyErrors.fill(true)]);
      return;
    }
    try {
      const res = await axios('http://127.0.0.1:8000/createRequest', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          student_number: request.student.id,
          teacher_email: request.reqInfo.teacherEmail,
          lesson_name: request.reqInfo.lessonName,
          preq_grades: preqsGrades.map((grade, index) => ({
            preqName: request.reqInfo.lessonPrerequisite[index],
            grade: grade,
          })),
          is_completed: false,
          additional_note: additional_note,
        },
      });

      const result = await res.data;

      if (result.code === '-1') {
        console.log('some error occured');
        return;
      } else if (result.code == '1') {
        toast({
          title: 'درخواست تکراری',
          description:
            'درخواست شما ثبت شده منتظر نتیجه آن توسط استاد مربوطه باشید',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'موفق',
          description: 'درخواست شما با موفقیت ثبت شد',
          variant: 'default',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser().then((res) => {
      updateStudent(res.student);
    });
  }, []);

  return (
    <>
      <Header theme={theme} switchTheme={switchTheme} user={user} />
      <Flex className="w-[75%] mx-auto">
        {request.student.id === '' && (
          <>
            <Flex
              direction="column"
              className="w-full h-[70vh]"
              align="center"
              justify="center"
              gap="5"
            >
              <Heading color="red">
                ابتدا درسی را برای ثبت درخواست انتخاب کنید.
              </Heading>
              <Link href="/dashboard">
                <Button>بازگشت به پنل کاربری</Button>
              </Link>
            </Flex>
          </>
        )}
        {request.student.id !== '' && (
          <>
            <Box
              className="mx-auto w-[50%]"
              style={{
                height: 'calc(100vh - 60px)',
              }}
            >
              <Flex
                className="max-w-screen-xl mx-auto"
                align="center"
                style={{
                  height: 'calc(100vh - 60px)',
                }}
              >
                <Container size="3">
                  <Card>
                    <Flex direction="column" p="6" align="center">
                      <Heading mt="6" size="6">
                        ثبت درخواست برای درس {request.reqInfo.lessonName}
                      </Heading>
                      <Flex className="w-full" justify="center" gap="7" mt="2">
                        <Heading size="3">
                          استاد {request.reqInfo.teacherName}
                        </Heading>
                        <Text>{request.reqInfo.teacherEmail}</Text>
                      </Flex>
                      <Flex
                        direction="column"
                        gap="3"
                        mt="6"
                        className="w-full justify-start"
                      >
                        <form onSubmit={onSubmit}>
                          <Flex
                            direction="column"
                            className="w-[60%] mx-auto"
                            gap="4"
                          >
                            {request.reqInfo.lessonPrerequisite.map(
                              (preq, index) => (
                                <Flex direction="column" gap="2" key={index}>
                                  <Label
                                    style={{
                                      color:
                                        errors.includes(true) ||
                                        emptyErrors.includes(true)
                                          ? 'var(--red-a11)'
                                          : '',
                                    }}
                                  >
                                    نمره شما در درس {preq}:
                                  </Label>
                                  <TextField.Input
                                    onChange={(e) => {
                                      if (e.target.value === '') {
                                        const newErrors = [...emptyErrors];
                                        newErrors[index] = true;
                                        setEmptyErrors([...newErrors]);
                                        return;
                                      }
                                      if (
                                        e.target.value !== '' &&
                                        emptyErrors[index]
                                      ) {
                                        const newErrors = [...emptyErrors];
                                        newErrors[index] = false;
                                        setEmptyErrors([...newErrors]);
                                      }
                                      const grades = [...preqsGrades];
                                      const parsedNumber = parseInt(
                                        e.target.value
                                      );
                                      if (
                                        errors[index] &&
                                        !Number.isNaN(parsedNumber)
                                      ) {
                                        const newErrors = [...errors];
                                        newErrors[index] = false;
                                        setErrors([...newErrors]);
                                      }
                                      if (Number.isNaN(parsedNumber)) {
                                        const newErrors = [...errors];
                                        newErrors[index] = true;
                                        setErrors([...newErrors]);
                                        return;
                                      }
                                      grades[index] = parsedNumber;
                                      setPreqsGrades([...grades]);
                                    }}
                                    placeholder="نمره خود را وارد کنید"
                                    className="bg-transparent text-xs md:text-base appearance-none border border-gray-900 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  />
                                  {(errors[index] && (
                                    <Text as="span" size="2" color="red">
                                      لطفا یک عدد وارد کنید
                                    </Text>
                                  )) ||
                                    (emptyErrors[index] && (
                                      <Text as="span" size="2" color="red">
                                        فیلد نمره نباید خالی باشد
                                      </Text>
                                    ))}
                                </Flex>
                              )
                            )}
                            <Flex direction="column" gap="2">
                              <Label>توصیحات اضافه برای استاد:</Label>
                              <TextArea
                                onChange={(e) => {
                                  setAdditional_note(e.target.value);
                                }}
                                placeholder="توضیحات خود را وارد کنید"
                              />
                            </Flex>
                          </Flex>
                          <Flex gap="3" className="mt-6" justify="center">
                            <Button
                              variant="surface"
                              className="w-1/6 py-2 px-4"
                              type="submit"
                            >
                              ثبت
                            </Button>
                          </Flex>
                        </form>
                      </Flex>
                    </Flex>
                  </Card>
                </Container>
              </Flex>
            </Box>
          </>
        )}
      </Flex>
    </>
  );
}
