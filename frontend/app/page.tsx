'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { useStudentStore } from '@/hooks/useStudentStore';
import { LoginErrorCode, Student, TokensType } from '@/types/globalTypes';
import { useToast } from '@/components/ui/use-toast';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

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
        console.log(data);
        if ('code' in data) {
          toast({
            title: 'خطا!',
            description:
              data.code === '-1'
                ? 'کاربری با این نام وجود ندارد.'
                : 'رمز عبور اشتباه است.',
            variant: 'destructive',
          });
          return;
        }
        setCookie('access_token', data.access_token);
        setCookie('refresh_token', data.refresh_token);

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
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="flex flex-col justify-start items-center h-3/4 gap-6">
          <div className="flex justify-center items-center">
            <Image
              src="/logo.png"
              alt="Nooshirvani's logo"
              sizes="100vw"
              className="w-full h-auto"
              width={163}
              height={227}
            />
          </div>
          <h1 className="mt-6 sm:text-base md:text-2xl lg:text-3xl text-base text-center">
            سامانه ثبت درخواست دستیار آموزشی دانشگاه صنعتی نوشیروانی
          </h1>
          <Form {...form}>
            <form
              className="rounded px-8 pt-6 pb-8 mb-4 w-2/3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="text-gray-700">
                    <FormLabel className="text-xs md:text-base font-bold mb-2">
                      شماره دانشجویی
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="شماره دانشجویی خود را وارد کنید"
                        className="bg-transparent appearance-none border text-xs md:text-base border-gray-900 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...field}
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
                  <FormItem className="mt-4 text-gray-700">
                    <FormLabel className="font-bold mb-2 text-xs md:text-base">
                      رمزعبور
                    </FormLabel>
                    <FormControl>
                      <Input
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
              <div className="flex flex-col gap-3 mt-6 items-center justify-between">
                <Button
                  variant="default"
                  className="bg-blue-500 rounded-2xl w-1/2 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  ورود
                </Button>
                <Link
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  href="#"
                >
                  رمز عبور خود را فراموش کرده اید؟
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
