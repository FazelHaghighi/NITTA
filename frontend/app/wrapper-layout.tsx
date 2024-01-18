'use client';
import { useBoundStore } from '@/hooks/useBoundStore';
import { Theme } from '@radix-ui/themes';
import { useEffect } from 'react';

export default function WrapperRootLatout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useBoundStore((state) => state.theme);
  const setTheme = useBoundStore((state) => state.setTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light'))
      setTheme(savedTheme);
  }, []);

  return (
    <Theme appearance={theme} accentColor="blue" grayColor="slate">
      {children}
    </Theme>
  );
}
