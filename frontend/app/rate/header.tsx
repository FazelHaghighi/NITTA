'use client';
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  Heading,
} from '@radix-ui/themes';
import {
  SunIcon,
  MoonIcon,
  HamburgerMenuIcon,
  ArrowTopRightIcon,
} from '@radix-ui/react-icons';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

function toArabicNumber(str: string) {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
}

function DeesktopHeader({
  user,
  theme,
  switchTheme,
}: {
  user: Student | Teacher;
  theme: ThemeType;
  switchTheme: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const request = useBoundStore((state) => state.request);

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
        {'id' in user && (
          <>
            <Button
              variant="ghost"
              onClick={() => {
                router.push('/dashboard');
              }}
              color="gray"
              className={`${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
              } hover:cursor-pointer`}
            >
              انتخاب درس
            </Button>
            <Button
              variant="ghost"
              color="gray"
              className={`${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
              } hover:cursor-pointer`}
              onClick={() => {
                if (request.student.id === '') {
                  toast({
                    description: 'لطفا از منوی اصلی درسی را انتخاب کنید',
                    variant: 'destructive',
                  });
                  return;
                }
                router.push('/request');
              }}
            >
              ثبت درخواست
            </Button>
            <Button
              onClick={() => {
                router.push('/my-requests');
              }}
              variant="ghost"
              color="gray"
              className={`${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
              } hover:cursor-pointer`}
            >
              درخواست های من
            </Button>
            <Button
              size="1"
              variant="ghost"
              style={{
                backgroundColor: theme === 'dark' ? 'white' : 'black',
                color: theme === 'dark' ? 'black' : 'white',
                fontSize: 'var(--font-size-2)',
              }}
            >
              امتیاز
            </Button>
          </>
        )}
        {'depName' in user && (
          <>
            <Button
              size="1"
              variant="ghost"
              style={{
                backgroundColor: theme === 'dark' ? 'white' : 'black',
                color: theme === 'dark' ? 'black' : 'white',
                fontSize: 'var(--font-size-2)',
              }}
            >
              درخواست ها
            </Button>
          </>
        )}
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
          {('id' in user && user.id === '') ||
          ('depName' in user && user.name === '') ? (
            <Skeleton className="w-[150px] h-[20px] rounded-full" />
          ) : (
            <Text size="3">{user.name}</Text>
          )}
          {('id' in user && user.id === '') ||
          ('depName' in user && user.name === '') ? (
            <Skeleton className="w-[50px] h-[20px] rounded-full" />
          ) : 'id' in user ? (
            <Text className="w-max" size="2" align="center">
              {toArabicNumber(user.id)}
            </Text>
          ) : (
            <Text size="2">{user.depName}</Text>
          )}
        </Flex>
        {('id' in user && user.id === '') ||
        ('depName' in user && user.name === '') ? (
          <Skeleton className="w-[40px] h-[40px] rounded-l" />
        ) : (
          <Avatar
            fallback={user.username.charAt(0).toUpperCase()}
            variant="soft"
          />
        )}
      </Flex>
    </Flex>
  );
}

function MobileHeader({
  deps,
  setFirstDep,
  setCurrDep,
  setDeps,
  firstDep,
  currDep,
  router,
  theme,
  switchTheme,
}: {
  deps: { name: string; selected: boolean }[];
  setFirstDep: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrDep: (currDep: string) => void;
  setDeps: React.Dispatch<
    React.SetStateAction<{ name: string; selected: boolean }[]>
  >;
  firstDep: boolean;
  currDep: string;
  router: AppRouterInstance;
  theme: ThemeType;
  switchTheme: () => void;
}) {
  return (
    <Box
      display={{
        initial: 'block',
        sm: 'none',
      }}
    >
      <Flex className="w-full border-b h-[48px] px-4 sticky" justify="between">
        <Sheet>
          <SheetTrigger>
            <IconButton size="2" variant="ghost" color="gray">
              <HamburgerMenuIcon width={16} height={16} />
            </IconButton>
          </SheetTrigger>
          <SheetContent className="w-[200px]">
            <SheetHeader>
              <SheetTitle>
                <Heading as="h5" size="3">
                  گروه های آموزشی
                </Heading>
              </SheetTitle>
            </SheetHeader>
            <Flex
              className="w-full rounded-md sticky top-[60px]"
              style={{
                height: 'calc(100vh - 60px)',
              }}
            >
              <ScrollArea className="w-full">
                <Flex
                  direction="column"
                  className="w-full pt-4"
                  align="start"
                  gap="4"
                >
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
                    <Flex
                      dir="rtl"
                      direction="column"
                      className="w-full"
                      gap="1"
                    >
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
          </SheetContent>
        </Sheet>
        <Flex className="pt-1 gap-[18px]" align="center" dir="ltr">
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
              <SunIcon width={16} height={16} />
            )}
          </Button>
          <Button
            size="1"
            variant="ghost"
            color="gray"
            className={`${
              theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
            } hover:cursor-pointer`}
            onClick={() => {
              router.push('/dashboard');
            }}
          >
            انتخاب درس
          </Button>
          <Button
            size="1"
            variant="ghost"
            color="gray"
            onClick={() => {
              router.push('/my-requests');
            }}
          >
            درخواست های من
          </Button>
          <Button
            variant="ghost"
            style={{
              backgroundColor: theme === 'dark' ? 'white' : 'black',
              color: theme === 'dark' ? 'black' : 'white',
              fontSize: 'var(--font-size-2)',
            }}
          >
            امتیاز
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
      </Flex>
    </Box>
  );
}

export default function Header({
  user,
  theme,
  switchTheme,
  deps,
  setFirstDep,
  setCurrDep,
  setDeps,
  firstDep,
  currDep,
}: {
  user: Student | Teacher;
  theme: ThemeType;
  switchTheme: () => void;
  deps: { name: string; selected: boolean }[];
  setFirstDep: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrDep: (currDep: string) => void;
  setDeps: React.Dispatch<
    React.SetStateAction<{ name: string; selected: boolean }[]>
  >;
  firstDep: boolean;
  currDep: string;
}) {
  const router = useRouter();

  return (
    <>
      <Box
        display={{
          initial: 'none',
          sm: 'block',
        }}
        style={{
          backgroundColor: theme === 'dark' ? '#111113' : 'white',
        }}
        className="sticky top-0 z-50"
      >
        <DeesktopHeader user={user} theme={theme} switchTheme={switchTheme} />
      </Box>
      <MobileHeader
        currDep={currDep}
        deps={deps}
        firstDep={firstDep}
        router={router}
        setCurrDep={setCurrDep}
        setDeps={setDeps}
        setFirstDep={setFirstDep}
        switchTheme={switchTheme}
        theme={theme}
      />
    </>
  );
}
