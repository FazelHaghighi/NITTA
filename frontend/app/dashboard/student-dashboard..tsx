import { Student } from '@/types/globalTypes';
import { Flex, Grid, Heading, Skeleton } from '@radix-ui/themes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataTable } from './data-table';
import { columns } from './column';
import { useBoundStore } from '@/hooks/useBoundStore';
import { useEffect, useState } from 'react';

async function getDeps() {
  try {
    const res = await fetch('http://127.0.0.1:8000/getDepartments', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export default function StudentDashboard({ student }: { student: Student }) {
  const currDep = useBoundStore((state) => state.currDep);
  const setCurrDep = useBoundStore((state) => state.setCurrDep);
  const [deps, setDeps] = useState<string[]>([]);

  useEffect(() => {
    getDeps().then((res) => {
      setDeps(res.departments);
      setCurrDep(res.departments[0]);
    });
  }, []);

  return (
    <>
      <Flex direction="row">
        <Flex
          direction="column"
          className="md:w-[27%] lg:w-[20%] xl:w-[16.5%] pt-4 px-4"
          align="start"
          gap="4"
        >
          <Heading size="5">گروه های آموزشی</Heading>
          <ScrollArea
            className="w-full rounded-md"
            style={{
              height: 'calc(100vh - 120px)',
            }}
          >
            {deps.length === 0 ? (
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
                <Skeleton key={index} className="w-full h-8 mb-4 rounded-md" />
              ))
            ) : (
              <DataTable
                columns={columns}
                data={deps.map((dep) => ({ name: dep }))}
              />
            )}
          </ScrollArea>
        </Flex>
        <Flex className="md:w-[43%] lg:w-[60%] xl:w-2/3"></Flex>
        <Flex className="md:w-[27%] lg:w-[20%] xl:w-[16.5%]"></Flex>
      </Flex>
    </>
  );
}
