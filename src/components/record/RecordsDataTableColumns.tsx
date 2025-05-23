import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Record } from "@/types/DTO/Record";
import { GetCategoryResponse } from "@/types/DTO/Category";

export const GetRecordsDataTableColumns = (
  setIsDeleteRecordDialogOpen: (isOpen: boolean) => void,
  setRecordToDelete: (record: Record) => void,
  setIsEditRecordSheetOpen: (isOpen: boolean) => void,
  setRecordToEdit: (record: Record) => void
) => {
  const RecordsDataTableColumns: ColumnDef<Record>[] = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">
          {(row.getValue("category") as GetCategoryResponse)?.name ?? "---"}
        </div>
      ),
      filterFn: (rows, id, filterValue) => {
        const category = rows.getValue("category") as GetCategoryResponse;

        return (
          category != undefined &&
          category.name.toLowerCase().includes(filterValue.toLowerCase())
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseInt(row.getValue("amount"));

        const formatted = new Intl.NumberFormat("hu-HU", {
          style: "currency",
          currency: "HUF",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setRecordToEdit(row.original);
                  setIsEditRecordSheetOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRecordToDelete(row.original);
                  setIsDeleteRecordDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return RecordsDataTableColumns;
};

export default GetRecordsDataTableColumns;
