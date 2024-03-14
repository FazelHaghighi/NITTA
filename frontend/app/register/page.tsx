'use client';
import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import {
  LoginErrorCode,
  RegisterErrorCode,
  TokensType,
} from '@/types/globalTypes';
import { useToast } from '@/components/ui/use-toast';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  Container,
  Flex,
  Heading,
  TextField,
  Dialog,
  Button,
  Text,
} from '@radix-ui/themes';
import { useBoundStore } from '@/hooks/useBoundStore';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const dialogSchema = z.object({
  code: z.string({ required_error: 'لطفا کد را وارد کنید' }),
});

function isEmpty(obj: any) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: 'وارد کردن نام کاربری الزامی است.',
    })
    .max(20, {
      message: 'حداکثر تعداد کاراکتر مجاز ۲۰ عدد می باشد',
    }),
  password: z.string().min(1, {
    message: 'وارد کردن رمزعبور الزامی است.',
  }),
  email: z.string().email({ message: 'لطفا یک ایمیل معتبر وارد کنید' }).min(1, {
    message: 'وارد کردن ایمیل الزامی است',
  }),
  phone_number: z
    .string({
      required_error: 'وارد کردن شماره تلفن الزامی است',
    })
    .min(11, {
      message: 'شماره تلفن باید ۱۱ رقمی باشد',
    })
    .max(11, {
      message: 'شماره تلفن باید ۱۱ رقمی باشد',
    }),
  name: z.string().min(1, {
    message: 'وارد کردن نام و نام خانوادگی الزامی است',
  }),
  studentId: z
    .string({
      required_error: 'وارد کردن شماره دانشجویی الزامی است',
    })
    .min(11, {
      message: 'شماره دانشجویی باید ۱۱ یا ۱۲ رفم باشد',
    })
    .max(12, {
      message: 'شماره دانشجویی باید ۱۱ یا ۱۲ رقم باشد',
    }),
});

export default function Register() {
  const [trigger, setTrigger] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      name: '',
      password: '',
      studentId: '',
    },
  });
  const dialogForm = useForm<z.infer<typeof dialogSchema>>({
    resolver: zodResolver(dialogSchema),
    defaultValues: {
      code: '',
    },
  });
  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);

  const handleSignup = async (values: z.infer<typeof formSchema>) => {
    // axios
    //   .post<TokensType>(
    //     'http://127.0.0.1:8000/register',
    //     {
    //       username: values.username,
    //       email: values.email,
    //       name: values.name,
    //       student_number: values.studentId,
    //       phone_number: values.phone_number,
    //       password: values.password,
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   )
    //   .then(({ data }: { data: TokensType | RegisterErrorCode }) => {
    //     if ('code' in data) {
    //       toast({
    //         title: 'خطا!',
    //         description: 'نام کاربری از قبل وجود دارد',
    //         variant: 'destructive',
    //       });
    //       return;
    //     }
    //     setCookie('access_token', data.access_token);
    //     setCookie('refresh_token', data.refresh_token);
    //     router.push('/dashboard');
    //   })
    //   .catch((error: AxiosError) => {
    //     if (error.response) {
    //       toast({
    //         title: 'خطا!',
    //         description: 'مشکلی از سمت سرور پیش آمده است مجددا تلاش کنید.',
    //         variant: 'destructive',
    //       });
    //       console.log(error.response.data);
    //     } else if (error.request) {
    //       toast({
    //         title: 'خطا!',
    //         description: 'پاسخی از سمت سرور دریافت نشد.',
    //         variant: 'destructive',
    //       });
    //       console.log(error);
    //     } else {
    //       toast({
    //         title: 'خطا!',
    //         description: 'خطای ناشناخته ای پیش آمده.',
    //         variant: 'destructive',
    //       });
    //       console.log('Error', error.message);
    //     }
    //   });
  };

  const isTouched = () => {
    const fields: [
      'email',
      'password',
      'phone_number',
      'name',
      'username',
      'studentId'
    ] = ['email', 'password', 'phone_number', 'name', 'username', 'studentId'];
    for (const field of fields) {
      if (form.getFieldState(field).isTouched) return true;
    }
    return false;
  };

  return (
    <>
      <Box className="h-screen bg-gradient-to-br from-sky-900">
        <Flex
          className="w-full px-12 h-[60px]"
          justify="between"
          align="center"
          dir="ltr"
        >
          <Button
            color="gray"
            variant="ghost"
            onClick={() => {
              switchTheme();
              localStorage.setItem(
                'theme',
                theme === 'dark' ? 'light' : 'dark'
              );
            }}
          >
            {theme === 'dark' ? (
              <MoonIcon width={16} height={16} />
            ) : (
              <SunIcon color="white" width={16} height={16} />
            )}
          </Button>
        </Flex>

        <Flex
          className="w-full mx-auto"
          align="center"
          style={{
            height: 'calc(100vh - 60px)',
          }}
        >
          <Container size="3" shrink="1" className="px-10">
            <Card>
              <Flex direction="column" p="6" align="center">
                <Heading
                  mt="6"
                  size={{
                    initial: '3',
                    sm: '5',
                    md: '7',
                  }}
                  align="center"
                >
                  ثبت نام
                </Heading>
                <Flex
                  direction="column"
                  gap="3"
                  mt="6"
                  className="w-full justify-start"
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignup)}>
                      <Flex
                        direction="column"
                        gap="3"
                        className="w-[90%] sm:w-1/2 mx-auto"
                      >
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs md:text-base font-bold mb-2">
                                نام کاربری
                              </FormLabel>
                              <FormControl>
                                <TextField.Input
                                  size="2"
                                  {...field}
                                  placeholder="نام کاربری خود را وارد کنید"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs md:text-base font-bold mb-2">
                                نام و نام خانوادگی
                              </FormLabel>
                              <FormControl>
                                <TextField.Input
                                  size="2"
                                  {...field}
                                  placeholder="نام و نام خانوادگی خود را وارد کنید"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs md:text-base font-bold mb-2">
                                ایمیل
                              </FormLabel>
                              <FormControl>
                                <TextField.Input
                                  size="2"
                                  {...field}
                                  placeholder="ایمیل خود را وارد کنید"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs md:text-base font-bold mb-2">
                                شماره تلفن
                              </FormLabel>
                              <FormControl>
                                <TextField.Input
                                  size="2"
                                  {...field}
                                  placeholder="شماره تلفن خود را وارد کنید"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs md:text-base font-bold mb-2">
                                شماره دانشجویی
                              </FormLabel>
                              <FormControl>
                                <TextField.Input
                                  size="2"
                                  {...field}
                                  placeholder="شماره دانشجویی خود را وارد کنید"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="">
                              <FormLabel className="font-bold mb-2 text-xs md:text-base">
                                رمزعبور
                              </FormLabel>
                              <FormControl>
                                <TextField.Input
                                  type="password"
                                  placeholder="رمز عبور خود را وارد کنید"
                                  className="bg-transparent text-xs md:text-base appearance-none border border-gray-900 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                      <Flex gap="3" className="mt-6" justify="center">
                        <Link href="/" className="w-1/3 sm:w-1/6">
                          <Button
                            variant="surface"
                            type="submit"
                            className="w-full"
                          >
                            ورود
                          </Button>
                        </Link>
                        <Dialog.Root open={trigger}>
                          <Button
                            variant="soft"
                            className="w-1/3 sm:w-1/6 py-2 px-4"
                            type="submit"
                            onClick={() => {
                              console.log(
                                isTouched(),
                                form.getFieldState('email'),
                                isEmpty(form.control._formState.errors)
                              );
                              if (
                                isTouched() &&
                                isEmpty(form.control._formState.errors)
                              ) {
                                setTrigger(true);
                              } else {
                                setTrigger(false);
                              }
                            }}
                          >
                            ثبت نام
                          </Button>
                          <Dialog.Content>
                            <Dialog.Title>احراز هویت</Dialog.Title>
                            <Dialog.Description>
                              <Form {...dialogForm}>
                                <form
                                  onSubmit={dialogForm.handleSubmit(
                                    async (
                                      values: z.infer<typeof dialogSchema>
                                    ) => {}
                                  )}
                                >
                                  <Flex direction="column" gap="3">
                                    <FormField
                                      control={dialogForm.control}
                                      name="code"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            <Text
                                              as="div"
                                              size="2"
                                              mb="1"
                                              weight="bold"
                                            >
                                              کد پیامک شده را وارد نمایید:
                                            </Text>
                                          </FormLabel>
                                          <FormControl>
                                            <TextField.Input
                                              color="blue"
                                              {...field}
                                              placeholder="کد ۶ رقمی"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </Flex>

                                  <Flex gap="3" mt="4" justify="end">
                                    <Button
                                      variant="surface"
                                      color="red"
                                      onClick={() => {
                                        setTrigger(false);
                                      }}
                                    >
                                      لغو
                                    </Button>
                                    <Button
                                      type="submit"
                                      variant="soft"
                                      color="blue"
                                    >
                                      ثبت
                                    </Button>
                                  </Flex>
                                </form>
                              </Form>
                            </Dialog.Description>
                          </Dialog.Content>
                        </Dialog.Root>
                      </Flex>
                    </form>
                  </Form>
                </Flex>
              </Flex>
            </Card>
          </Container>
        </Flex>
      </Box>
    </>
  );
}
