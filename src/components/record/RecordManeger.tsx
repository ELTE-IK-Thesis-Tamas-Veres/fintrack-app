"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Record } from "@/types/Record";
import RecordsDataTableColumns from "@/components/record/RecordsDataTableColumns";
import { CreateRecordSheet } from "./CreateRecordSheet";
/*
const data: Record[] = [
  {
    id: "rec_1",
    description: "Transaction 1",
    amount: -7.02,
    category: "transport",
    date: new Date("2020-12-14"),
  },
  {
    id: "rec_2",
    description: "Transaction 2",
    amount: -249.67,
    category: "transport",
    date: new Date("2021-05-05"),
  },
  {
    id: "rec_3",
    description: "Transaction 3",
    amount: -239.19,
    category: "food",
    date: new Date("2022-01-31"),
  },
  {
    id: "rec_4",
    description: "Transaction 4",
    amount: 1.41,
    category: "entertainment",
    date: new Date("2022-01-09"),
  },
  {
    id: "rec_5",
    description: "Transaction 5",
    amount: 465.98,
    category: "shopping",
    date: new Date("2023-04-09"),
  },
  {
    id: "rec_6",
    description: "Transaction 6",
    amount: 497.98,
    category: "entertainment",
    date: new Date("2023-04-30"),
  },
  {
    id: "rec_7",
    description: "Transaction 7",
    amount: 189.98,
    category: "rent",
    date: new Date("2021-04-26"),
  },
  {
    id: "rec_8",
    description: "Transaction 8",
    amount: -307.02,
    category: "food",
    date: new Date("2024-01-22"),
  },
  {
    id: "rec_9",
    description: "Transaction 9",
    amount: 489.12,
    category: "transport",
    date: new Date("2021-04-29"),
  },
  {
    id: "rec_10",
    description: "Transaction 10",
    amount: -21.19,
    category: "shopping",
    date: new Date("2022-03-17"),
  },
  {
    id: "rec_11",
    description: "Transaction 11",
    amount: 333.31,
    category: "salary",
    date: new Date("2021-05-08"),
  },
  {
    id: "rec_12",
    description: "Transaction 12",
    amount: -25.09,
    category: "salary",
    date: new Date("2023-04-06"),
  },
  {
    id: "rec_13",
    description: "Transaction 13",
    amount: 78.17,
    category: "shopping",
    date: new Date("2020-05-18"),
  },
  {
    id: "rec_14",
    description: "Transaction 14",
    amount: 73.85,
    category: "transport",
    date: new Date("2023-04-24"),
  },
  {
    id: "rec_15",
    description: "Transaction 15",
    amount: -212.85,
    category: "rent",
    date: new Date("2020-02-29"),
  },
  {
    id: "rec_16",
    description: "Transaction 16",
    amount: -242.48,
    category: "health",
    date: new Date("2022-05-22"),
  },
  {
    id: "rec_17",
    description: "Transaction 17",
    amount: 164.95,
    category: "salary",
    date: new Date("2022-08-04"),
  },
  {
    id: "rec_18",
    description: "Transaction 18",
    amount: 77.83,
    category: "transport",
    date: new Date("2023-12-12"),
  },
  {
    id: "rec_19",
    description: "Transaction 19",
    amount: -43.08,
    category: "transport",
    date: new Date("2020-09-19"),
  },
  {
    id: "rec_20",
    description: "Transaction 20",
    amount: -66.79,
    category: "rent",
    date: new Date("2023-08-08"),
  },
  {
    id: "rec_21",
    description: "Transaction 21",
    amount: -444.37,
    category: "entertainment",
    date: new Date("2022-02-20"),
  },
  {
    id: "rec_22",
    description: "Transaction 22",
    amount: 382.35,
    category: "transport",
    date: new Date("2021-01-03"),
  },
  {
    id: "rec_23",
    description: "Transaction 23",
    amount: -16.22,
    category: "salary",
    date: new Date("2021-11-19"),
  },
  {
    id: "rec_24",
    description: "Transaction 24",
    amount: -126.73,
    category: "health",
    date: new Date("2022-03-05"),
  },
  {
    id: "rec_25",
    description: "Transaction 25",
    amount: 193.94,
    category: "transport",
    date: new Date("2022-03-26"),
  },
  {
    id: "rec_26",
    description: "Transaction 26",
    amount: 231.18,
    category: "utilities",
    date: new Date("2022-07-13"),
  },
  {
    id: "rec_27",
    description: "Transaction 27",
    amount: 372.47,
    category: "salary",
    date: new Date("2021-11-03"),
  },
  {
    id: "rec_28",
    description: "Transaction 28",
    amount: -11.89,
    category: "entertainment",
    date: new Date("2023-02-11"),
  },
  {
    id: "rec_29",
    description: "Transaction 29",
    amount: 405.0,
    category: "rent",
    date: new Date("2021-11-30"),
  },
  {
    id: "rec_30",
    description: "Transaction 30",
    amount: -466.77,
    category: "food",
    date: new Date("2022-03-04"),
  },
  {
    id: "rec_31",
    description: "Transaction 31",
    amount: 85.43,
    category: "food",
    date: new Date("2022-03-26"),
  },
  {
    id: "rec_32",
    description: "Transaction 32",
    amount: -156.51,
    category: "entertainment",
    date: new Date("2022-04-25"),
  },
  {
    id: "rec_33",
    description: "Transaction 33",
    amount: 96.25,
    category: "rent",
    date: new Date("2020-01-17"),
  },
  {
    id: "rec_34",
    description: "Transaction 34",
    amount: -147.79,
    category: "entertainment",
    date: new Date("2023-12-12"),
  },
  {
    id: "rec_35",
    description: "Transaction 35",
    amount: -111.88,
    category: "shopping",
    date: new Date("2020-09-07"),
  },
  {
    id: "rec_36",
    description: "Transaction 36",
    amount: -218.95,
    category: "food",
    date: new Date("2023-05-28"),
  },
  {
    id: "rec_37",
    description: "Transaction 37",
    amount: 392.33,
    category: "health",
    date: new Date("2023-08-02"),
  },
];*/

export default function RecordManager() {
  const [recordsDataState, setRecordsDataState] = React.useState<{
    isLoading: boolean;
    response: Record[];
    error: unknown;
  }>({
    isLoading: false,
    response: [],
    error: undefined,
  });

  const fetchRecords = async () => {
    setRecordsDataState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/record");
      const data = await response.json();

      if (data.error) {
        setRecordsDataState((previous) => ({
          ...previous,
          response: [],
          error: data.error,
        }));
      } else {
        setRecordsDataState((previous) => ({
          ...previous,
          response: data,
          error: undefined,
        }));
      }
    } catch (error) {
      setRecordsDataState((previous) => ({
        ...previous,
        response: [],
        error: undefined,
      }));
    } finally {
      setRecordsDataState((previous) => ({ ...previous, isLoading: false }));
    }
  };

  React.useEffect(() => {
    console.log("fetching records");
    fetchRecords();
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const table = useReactTable({
    data: recordsDataState.response,
    columns: RecordsDataTableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter descriptions..."
          value={
            (table.getColumn("description")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-2"
        />
        <CreateRecordSheet />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={RecordsDataTableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
