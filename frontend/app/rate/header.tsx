'use client';
import { Avatar, Box, Button, Flex, IconButton, Text } from '@radix-ui/themes';
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
          variant="ghost"
          color="gray"
          onClick={() => {
            router.push('/dashboard');
          }}
          className={`${
            theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
          } hover:cursor-pointer`}
        >
          انتخاب درس
        </Button>
        <Button
          onClick={() => {
            router.push('/request');
          }}
          variant="ghost"
          color="gray"
          className={`${
            theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
          } hover:cursor-pointer`}
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
              {user.id}
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

export default function Header({
  user,
  theme,
  switchTheme,
}: {
  user: Student | Teacher;
  theme: ThemeType;
  switchTheme: () => void;
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
      <Box
        display={{
          initial: 'block',
          sm: 'none',
        }}
      >
        <Flex
          className="w-full border-b h-[48px] px-4 sticky"
          justify="between"
        >
          <Sheet>
            <SheetTrigger>
              <IconButton size="2" variant="ghost" color="gray">
                <HamburgerMenuIcon width={16} height={16} />
              </IconButton>
            </SheetTrigger>
            <SheetContent className="w-[200px]">
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Flex gap="6" className="pt-1" align="center" dir="ltr">
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
              style={{
                backgroundColor: theme === 'dark' ? 'white' : 'black',
                color: theme === 'dark' ? 'black' : 'white',
                fontSize: 'var(--font-size-2)',
              }}
            >
              انتخاب
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
              ثبت درخواست
            </Button>
            <Button
              onClick={() => {
                router.push('/rate');
              }}
              variant="ghost"
              color="gray"
              className={`${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
              } hover:cursor-pointer`}
            >
              امتیاز
            </Button>
            <Button
              onClick={() => {
                router.push('/messages');
              }}
              variant="ghost"
              color="gray"
              className={`${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
              } hover:cursor-pointer`}
            >
              پیام ها
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
    </>
  );
}
