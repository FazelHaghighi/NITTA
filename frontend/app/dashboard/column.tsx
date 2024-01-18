'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Department = {
  name: string;
};

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: 'name',
    header: 'گروه آموزشی',
  },
];
