'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useBoundStore } from '@/hooks/useBoundStore';
import { Department } from './column';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<Department, TValue>) {
  const setCurrDep = useBoundStore((state) => state.setCurrDep);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [first, setFirst] = useState(true);
  return (
    <Table dir="rtl">
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, index) => (
            <TableRow
              onClick={() => {
                if (first) {
                  setFirst(false);
                }
                if (row.getIsSelected()) {
                  return;
                }
                table.getRowModel().rows.forEach((row, index, arr) => {
                  if (row.getIsSelected()) {
                    row.toggleSelected();
                    arr[index] = row;
                  }
                });
                row.toggleSelected();
                setCurrDep(row.original.name);
              }}
              key={row.id}
              data-state={
                (row.getIsSelected() && 'selected') ||
                (first && index === 0 && 'selected')
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
