import { Avatar, Box, Button, Flex } from '@radix-ui/themes';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { Student, ThemeType } from '@/types/globalTypes';
import Link from 'next/link';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function Header({
  theme,
  switchTheme,
  student,
}: {
  theme: ThemeType;
  switchTheme: () => void;
  student: Student;
}) {
  const router = useRouter();

  return (
    <Flex
      className="w-full border-b px-4 h-[48px]"
      justify="between"
      align="center"
    >
      <Button
        color="gray"
        variant="ghost"
        onClick={() => {
          switchTheme();
        }}
      >
        {theme === 'dark' ? (
          <MoonIcon width={16} height={16} />
        ) : (
          <SunIcon width={16} height={16} />
        )}
      </Button>
      <Flex gap="6" className="pt-1">
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
        <Link href="/rate">
          <Button
            variant="ghost"
            color="gray"
            className={`${
              theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
            } hover:cursor-pointer`}
          >
            امتیاز
          </Button>
        </Link>
        <Button
          size="1"
          variant="ghost"
          style={{
            backgroundColor: theme === 'dark' ? 'white' : 'black',
            color: theme === 'dark' ? 'black' : 'white',
            fontSize: 'var(--font-size-2)',
          }}
        >
          درخواست
        </Button>
      </Flex>
      <Avatar
        fallback={student.username.charAt(0).toUpperCase()}
        variant="soft"
      />
    </Flex>
  );
}
