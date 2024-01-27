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
  Card,
  Avatar,
  Dialog,
  TextField,
  TextArea,
} from '@radix-ui/themes';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBoundStore } from '@/hooks/useBoundStore';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import dynamic from 'next/dynamic';
import { getCookie, setCookie } from 'cookies-next';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
const Header = dynamic(() => import('./header'));

function toArabicNumber(str: string) {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
}

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'وارد کردن عنوان الزامی است.',
    })
    .max(40),
  text: z.string().min(1, {
    message: 'وارد کردن متن نظر الزامی است.',
  }),
});

const avg = (nums: number[]) => {
  if (nums.length === 0) return 0;
  let sum = 0;
  nums.forEach((num) => {
    sum += num;
  });
  return sum / nums.length;
};

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

type Comment = {
  comment: {
    title: string;
    text: string;
  };
  rate: number;
  commenterName: string;
  votes: number;
};

type TA = {
  taName: string;
  teacherName: string;
  teacherDep: string;
  lessonName: string;
  comments: Comment[] | [{ nocomments: true }];
  voteNumbers: number | null;
};

export default function Rate() {
  const student = useBoundStore((state) => state.student);
  const updateStudent = useBoundStore((state) => state.updateStudent);
  const currDep = useBoundStore((state) => state.currDep);
  const theme = useBoundStore((state) => state.theme);
  const switchTheme = useBoundStore((state) => state.switchTheme);
  const setCurrDep = useBoundStore((state) => state.setCurrDep);
  const [rate, setRate] = useState(1);
  const [deps, setDeps] = useState<{ name: string; selected: boolean }[]>([]);
  const [lessons, setLessons] = useState<{ name: string }[]>([]);
  const [teacherAssistants, setTeacherAssistants] = useState<TA[]>([]);
  const [firstDep, setFirstDep] = useState(currDep === '' ? true : false);
  const [filters, setFilters] = useState<{ lessonName: string } | 'all'>('all');
  const firstUpdate = useRef(true);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      title: '',
    },
  });

  useEffect(() => {
    getUser().then((res) => {
      updateStudent(res.student);
    });
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    fetch('http://127.0.0.1:8000/getTAs')
      .then((res) => res.json())
      .then((res: TA[]) => {
        setTeacherAssistants([...res]);
        const newLessons: { name: string }[] = [];
        const newDeps: { name: string; selected: boolean }[] = [];
        for (const { lessonName, teacherDep } of res) {
          if (!newLessons.find((lesson) => lesson.name === lessonName)) {
            newLessons.push({ name: lessonName });
          }
          if (!newDeps.find((dep) => dep.name === teacherDep)) {
            newDeps.push({ name: teacherDep, selected: false });
          }
        }
        setLessons([...newLessons]);
        setDeps([...newDeps]);
      });

    setFilters('all');
  }, [currDep]);

  return (
    <>
      <Header
        currDep={currDep}
        setCurrDep={setCurrDep}
        deps={deps}
        firstDep={firstDep}
        setDeps={setDeps}
        setFirstDep={setFirstDep}
        user={student}
        switchTheme={switchTheme}
        theme={theme}
      />
      <Theme accentColor="red">
        <Flex direction="row">
          <Flex
            className="md:w-[27%] lg:w-[20%] xl:w-[12.5%]"
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
                          setFilters({ lessonName: lesson.name });
                        }}
                      >
                        {lesson.name}
                      </RadixLink>
                    ))}
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Flex>
          <Flex className="md:w-[43%] lg:w-[60%] xl:w-[75%]" justify="center">
            <Flex direction="column" className="w-[90%] sm:w-1/2 py-4">
              <Box className="w-full py-10 space-y-3">
                <Heading as="h1" size="7">
                  دستیاران آموزشی
                </Heading>
                <Text
                  className="text-[var(--gray-11)]"
                  size="3"
                  weight="medium"
                  as="p"
                >
                  می توانید در این قسمت دستیاران آموزشی را مشاهده و به آن ها
                  امتیاز دهید.
                </Text>
              </Box>
              <Flex direction="column" gap="9">
                {teacherAssistants.length > 0 &&
                  teacherAssistants
                    .filter(
                      (teacherAssistants) =>
                        filters === 'all' ||
                        teacherAssistants.lessonName === filters.lessonName
                    )
                    .map((teacherAssistant, index) => (
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
                                  <Heading
                                    weight="medium"
                                    as="h2"
                                    size={{
                                      initial: '3',
                                      sm: '5',
                                    }}
                                  >
                                    {teacherAssistant.taName}
                                  </Heading>
                                  <Kbd
                                    size={{
                                      initial: '1',
                                      sm: '3',
                                    }}
                                    style={{ fontFamily: '--font-vazirmatn' }}
                                  >
                                    {teacherAssistant.teacherName}
                                  </Kbd>
                                </Flex>
                                <Flex>
                                  <Badge size="1" color="green">
                                    <Text
                                      size={{
                                        initial: '1',
                                        sm: '3',
                                      }}
                                    >
                                      {teacherAssistant.lessonName}
                                    </Text>
                                  </Badge>
                                </Flex>
                                <Flex direction="row" align="center" gap="4">
                                  {!(
                                    'nocomments' in teacherAssistant.comments[0]
                                  ) && (
                                    <>
                                      <Text
                                        size={{
                                          initial: '2',
                                          sm: '3',
                                        }}
                                      >
                                        میانگین امتیاز
                                      </Text>
                                      <Progress
                                        className="w-1/3"
                                        value={
                                          avg(
                                            teacherAssistant.comments
                                              .filter(
                                                (c): c is Comment =>
                                                  !('nocomments' in c)
                                              )
                                              .map((c) => c.rate)
                                          ) * 20
                                        }
                                      />
                                    </>
                                  )}
                                  {'nocomments' in
                                    teacherAssistant.comments[0] && (
                                    <Text>امتیازی هنوز ثبت نشده است.</Text>
                                  )}
                                </Flex>
                              </Flex>

                              <Dialog.Root>
                                <Dialog.Trigger>
                                  <Button
                                    size={{
                                      initial: '1',
                                      sm: '2',
                                    }}
                                    color="blue"
                                    variant="ghost"
                                  >
                                    امتیاز دهید
                                  </Button>
                                </Dialog.Trigger>
                                <Dialog.Content>
                                  <Dialog.Title>ثبت امتیاز</Dialog.Title>
                                  <Dialog.Description>
                                    <Form {...form}>
                                      <form
                                        onSubmit={form.handleSubmit(
                                          async (
                                            values: z.infer<typeof formSchema>
                                          ) => {
                                            try {
                                              const data = await fetch(
                                                'http://127.0.0.1:8000/submitComment',
                                                {
                                                  method: 'post',
                                                  headers: {
                                                    'Content-Type':
                                                      'application/json',
                                                  },
                                                  body: JSON.stringify({
                                                    commenter_sn: student.id,
                                                    ta_name:
                                                      teacherAssistant.taName,
                                                    lesson_name:
                                                      teacherAssistant.lessonName,
                                                    teacher_name:
                                                      teacherAssistant.teacherName,
                                                    title: values.title,
                                                    text: values.text,
                                                    rate: rate,
                                                  }),
                                                }
                                              );
                                              const res = await data.json();
                                              if (res.code === '0') {
                                                toast({
                                                  title: 'موفق',
                                                  variant: 'default',
                                                  description:
                                                    'نظر شما با موفقیت ثبت شد',
                                                });
                                              } else if (res.code === '2') {
                                                toast({
                                                  title: 'خطا',
                                                  variant: 'destructive',
                                                  description:
                                                    'شما نمی توانید به خودتان نظر بدهید!',
                                                });
                                              } else if (res.code === '1') {
                                                toast({
                                                  title: 'خطا',
                                                  variant: 'destructive',
                                                  description:
                                                    'نظر دادن بیش از دوبار بر یک دستیار آموزشی امکان پذیر نمی باشد.',
                                                });
                                              }
                                            } catch (e) {
                                              console.log(e);
                                              toast({
                                                title: 'خطا',
                                                variant: 'destructive',
                                                description:
                                                  'مشکلی در ارسال درخواست پیش آمد. لطفا اتصال خود را بررسی و دوباره تلاش کنید.',
                                              });
                                            }
                                          }
                                        )}
                                      >
                                        <Flex direction="column" gap="3">
                                          <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  <Text
                                                    as="div"
                                                    size="2"
                                                    mb="1"
                                                    weight="bold"
                                                  >
                                                    توضیح خلاصه
                                                  </Text>
                                                </FormLabel>
                                                <FormControl>
                                                  <TextField.Input
                                                    color="blue"
                                                    {...field}
                                                    placeholder="عنوان"
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={form.control}
                                            name="text"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  <Text
                                                    as="div"
                                                    size="2"
                                                    mb="1"
                                                    weight="bold"
                                                  >
                                                    نظر شما
                                                  </Text>
                                                </FormLabel>
                                                <FormControl>
                                                  <TextArea
                                                    color="blue"
                                                    {...field}
                                                    placeholder="نظر کامل"
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />

                                          <FormItem>
                                            <FormLabel>
                                              <Text
                                                as="div"
                                                size="2"
                                                mb="1"
                                                weight="bold"
                                              >
                                                امتیاز
                                              </Text>
                                            </FormLabel>
                                            <FormControl>
                                              <Flex gap="5">
                                                {toArabicNumber('5')}
                                                <Slider
                                                  className="w-1/4"
                                                  defaultValue={[0]}
                                                  onValueChange={(value) => {
                                                    setRate(value[0]);
                                                  }}
                                                  max={5}
                                                  step={1}
                                                />
                                                {toArabicNumber('0')}
                                              </Flex>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        </Flex>

                                        <Flex gap="3" mt="4" justify="end">
                                          <Dialog.Close>
                                            <Button
                                              variant="surface"
                                              color="red"
                                            >
                                              لغو
                                            </Button>
                                          </Dialog.Close>
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
                            <Accordion
                              type="single"
                              collapsible
                              className="flex-[1/2] bg-[var(--blue-3)] px-4 justify-between"
                            >
                              <AccordionItem value="comments">
                                <AccordionTrigger className="text-base font-normal">
                                  مشاهده کامنت ها
                                </AccordionTrigger>
                                <AccordionContent>
                                  <Flex direction="column" gap="4">
                                    {teacherAssistant.comments
                                      .filter(
                                        (comment): comment is Comment =>
                                          !('nocomments' in comment)
                                      )
                                      .toSorted((a, b) => a.rate - b.rate)
                                      .map((comment, index) => (
                                        <Card key={index}>
                                          <Flex justify="between">
                                            <Flex
                                              className="w-[70%]"
                                              direction="column"
                                              gap="2"
                                            >
                                              <Flex gap="3" align="center">
                                                <Avatar
                                                  size="2"
                                                  fallback={comment.commenterName.charAt(
                                                    0
                                                  )}
                                                />
                                                <Text as="span">
                                                  {comment.commenterName}
                                                </Text>
                                              </Flex>
                                              <Flex align="center" gap="3">
                                                <Text weight="bold" as="span">
                                                  امتیاز :
                                                </Text>
                                                <Text weight="bold" as="span">
                                                  {toArabicNumber(
                                                    comment.rate.toString()
                                                  )}{' '}
                                                  از {toArabicNumber('5')}
                                                </Text>
                                              </Flex>
                                              <Flex align="center" gap="5">
                                                <Text weight="bold" as="span">
                                                  {comment.comment.title}
                                                </Text>
                                              </Flex>
                                              <Flex>
                                                <Text
                                                  style={{
                                                    wordWrap: 'break-word',
                                                    display: 'inline-block',
                                                    width: '100%',
                                                  }}
                                                  as="p"
                                                >
                                                  {comment.comment.text}
                                                </Text>
                                              </Flex>
                                            </Flex>
                                            <Flex
                                              className=""
                                              direction="column"
                                              align="stretch"
                                              justify="end"
                                            >
                                              <Text
                                                className="grow"
                                                align="left"
                                              >
                                                {toArabicNumber(
                                                  comment.votes.toString()
                                                )}{' '}
                                                رای
                                              </Text>
                                              <Button
                                                size="1"
                                                variant="outline"
                                                color="gray"
                                                onClick={() => {
                                                  fetch(
                                                    'http://127.0.0.1:8000/increaseVote',
                                                    {
                                                      method: 'post',
                                                      headers: {
                                                        'Content-Type':
                                                          'application/json',
                                                      },
                                                      body: JSON.stringify({
                                                        voter_student_number:
                                                          student.id,
                                                        commenter_name:
                                                          comment.commenterName,
                                                        ta_name:
                                                          teacherAssistant.taName,
                                                      }),
                                                    }
                                                  )
                                                    .then((res) => res.json())
                                                    .then((res) => {
                                                      if (res.code === '0') {
                                                        toast({
                                                          title: 'موفق',
                                                          description:
                                                            'رای شما ثبت شد',
                                                          variant: 'default',
                                                        });
                                                      } else if (
                                                        res.code === '1'
                                                      ) {
                                                        toast({
                                                          variant:
                                                            'destructive',
                                                          title: 'خطا',
                                                          description:
                                                            'شما قبلا به این نظر رای دادید',
                                                        });
                                                      } else if (
                                                        res.code === '-1'
                                                      ) {
                                                        toast({
                                                          variant:
                                                            'destructive',
                                                          title: 'خطا',
                                                          description:
                                                            'مشکلی از سمت سرور پیش آمده است. برای حل این مشکل با ارائه دهنده سرور تماس بگیرید.',
                                                        });
                                                      }
                                                    })
                                                    .catch((e) => {
                                                      console.log(e);
                                                      toast({
                                                        title: 'خطا',
                                                        description:
                                                          'مشکلی در ارسال درخواست پیش آمده. اتصال خود را بررسی و دوباره تلاش کنید',
                                                        variant: 'destructive',
                                                      });
                                                    });
                                                }}
                                              >
                                                مفید بود
                                              </Button>
                                            </Flex>
                                          </Flex>
                                        </Card>
                                      ))}
                                    {teacherAssistant.comments
                                      .filter(
                                        (c): c is { nocomments: true } =>
                                          'nocomments' in c
                                      )
                                      .map((_, index) => (
                                        <Text key={index}>
                                          هیچ کامنتی هنوز ثبت نشده است.
                                        </Text>
                                      ))}
                                  </Flex>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </Flex>
                        </Box>
                      </Flex>
                    ))}
                {teacherAssistants.length === 0 && (
                  <Heading>در حال حاضر درس قابل ارائه ایی وجود ندارد.</Heading>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            className="md:w-[27%] lg:w-[20%] xl:w-[12.5%] rounded-md sticky top-[60px]"
            display={{
              initial: 'none',
              sm: 'flex',
            }}
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
