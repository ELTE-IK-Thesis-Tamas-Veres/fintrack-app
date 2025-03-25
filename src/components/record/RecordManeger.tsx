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

import {
  CreateRecordRequest,
  EditRecordRequest,
  Record,
} from "@/types/DTO/Record";
import RecordsDataTableColumns, {
  GetRecordsDataTableColumns,
} from "@/components/record/RecordsDataTableColumns";
import { CreateRecordSheet } from "./CreateRecordSheet";
import { toast } from "sonner";
import { DeleteRecordDialog } from "./DeleteRecordDialog";
import { EditRecordSheet } from "./EditRecordSheet";

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

  const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] =
    React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<Record | null>(
    null
  );

  const [isEditRecordSheetOpen, setIsEditRecordSheetOpen] =
    React.useState(false);
  const [recordToEdit, setRecordToEdit] = React.useState<Record | null>(null);

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

  const createRecordHandler = async (request: CreateRecordRequest) => {
    const body: CreateRecordRequest = request;

    try {
      const response = await fetch("/api/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchRecords();

        toast("Record created", {
          description: "The record was successfully created",
        });
      } else {
        toast("Error creating record", {
          description: "An error occurred while creating the record",
        });
      }
    } catch (error) {
      toast("Error creating record", {
        description: "An error occurred while creating the record",
      });
    }
  };

  const editRecordHandler = async (request: EditRecordRequest) => {
    const body: EditRecordRequest = request;

    try {
      const response = await fetch(`/api/record/${recordToEdit?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchRecords();

        toast("Record updated", {
          description: "The record was successfully updated",
        });
      } else {
        toast("Error updating record", {
          description: "An error occurred while updating the record",
        });
      }
    } catch (error) {
      toast("Error updating record", {
        description: "An error occurred while updating the record",
      });
    }
  };

  const deleteRecordHandler = async (record: Record) => {
    try {
      const response = await fetch(`/api/record/${record.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRecords();

        toast("Record deleted", {
          description: "The record was successfully deleted",
        });
      } else {
        toast("Error deleting record", {
          description: "An error occurred while deleting the record",
        });
      }
    } catch (error) {
      toast("Error deleting record", {
        description: "An error occurred while deleting the record",
      });
    }
  };

  React.useEffect(() => {
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
    columns: GetRecordsDataTableColumns(
      setIsDeleteRecordDialogOpen,
      setRecordToDelete,
      setIsEditRecordSheetOpen,
      setRecordToEdit
    ),
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
    <div className="max-w-6xl mx-auto p-6">
      {/* 📌 Header Section */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Manage Records</h1>
        <p className="text-muted-foreground">
          View, edit, or delete financial records with ease.
        </p>
      </header>
      {recordToDelete && (
        <DeleteRecordDialog
          deleteRecordHandler={deleteRecordHandler}
          record={recordToDelete}
          isOpen={isDeleteRecordDialogOpen}
          setIsOpen={setIsDeleteRecordDialogOpen}
        />
      )}
      {recordToEdit && (
        <EditRecordSheet
          editRecordHandler={editRecordHandler}
          original={recordToEdit}
          isSheetOpen={isEditRecordSheetOpen}
          setIsSheetOpen={setIsEditRecordSheetOpen}
        />
      )}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Filter descriptions..."
            value={
              (table.getColumn("description")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="max-w-md mr-2"
          />
          <Input
            placeholder="Filter categories..."
            value={
              (table.getColumn("category")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("category")?.setFilterValue(event.target.value)
            }
            className="max-w-md mr-2"
          />
        </div>

        <div className="flex gap-2">
          <CreateRecordSheet createRecordHandler={createRecordHandler} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <span>Columns</span> <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
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
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-card p-4 rounded-md shadow-md border">
        {recordsDataState.isLoading && recordsDataState.response.length == 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Loading records...
          </p>
        ) : recordsDataState.response.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No records found. Start by adding a new one!
          </p>
        ) : (
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
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
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
