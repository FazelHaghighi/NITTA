'use client';
import React from 'react';
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
import { LoginErrorCode, TokensType } from '@/types/globalTypes';
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
  Button,
} from '@radix-ui/themes';
import { useBoundStore } from '@/hooks/useBoundStore';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: 'وارد کردن نام کاربری الزامی است.',
    })
    .max(20),
  password: z.string().min(1, {
    message: 'وارد کردن رمزعبور الزامی است.',
  }),
});

const Login: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    axios
      .post<TokensType>(
        'http://127.0.0.1:8000/login',
        {
          username: values.username,
          password: values.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(({ data }: { data: TokensType | LoginErrorCode }) => {
        if ('code' in data) {
          toast({
            title: 'خطا!',
            description:
              data.code === '-1'
                ? 'کاربری با این نام وجود ندارد.'
                : data.code === '-3'
                ? 'مشکلی از سمت سرور پیش آمده است مجددا تلاش کنید.'
                : 'رمز عبور اشتباه است.',
            variant: 'destructive',
          });
          return;
        }
        setCookie('access_token', data.access_token);
        setCookie('refresh_token', data.refresh_token);

        if (data.admin) {
          router.push('/admin');
          return;
        }

        router.push('/dashboard');
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          toast({
            title: 'خطا!',
            description: 'مشکلی از سمت سرور پیش آمده است مجددا تلاش کنید.',
            variant: 'destructive',
          });
          console.log(error);
        } else if (error.request) {
          toast({
            title: 'خطا!',
            description: 'پاسخی از سمت سرور دریافت نشد.',
            variant: 'destructive',
          });
          console.log(error);
        } else {
          toast({
            title: 'خطا!',
            description: 'خطای ناشناخته ای پیش آمده.',
            variant: 'destructive',
          });
          console.log('Error', error.message);
        }
      });
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
            <Card className="w-full">
              <Flex direction="column" p="6" align="center">
                <Box className="h-1/2">
                  <Image
                    src="/logo.png"
                    alt="Nooshirvani's logo"
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                    width={163}
                    height={227}
                  />
                </Box>
                <Heading
                  mt="6"
                  size={{
                    initial: '3',
                    sm: '5',
                    md: '7',
                  }}
                  align="center"
                >
                  سامانه ثبت درخواست دستیار آموزشی دانشگاه صنعتی نوشیروانی
                </Heading>
                <Flex
                  direction="column"
                  gap="3"
                  mt="6"
                  className="w-full justify-start"
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <Flex
                        direction="column"
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
                          name="password"
                          render={({ field }) => (
                            <FormItem className="mt-4">
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
                        <Button
                          variant="surface"
                          className="w-1/3 sm:w-1/6 py-2 px-4"
                          type="submit"
                        >
                          ورود
                        </Button>
                        <Link href="/register" className="w-1/3 sm:w-1/6">
                          <Button
                            className="w-full"
                            variant="soft"
                            type="submit"
                          >
                            ثبت نام
                          </Button>
                        </Link>
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
};

export default Login;
