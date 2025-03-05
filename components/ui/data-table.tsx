"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  filterOptions?: {
    key: string;
    options: { label: any; value: any }[];
  };
  enableRowSelection?: boolean;
  buttonSelected?: {
    label: string;
    onClick: (selectedRows: TData[]) => void;
  };
  column?: boolean;
  disableCheckboxValue?: {
    key: keyof TData;
    value: any;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  filterOptions,
  enableRowSelection = false,
  buttonSelected,
  column,
  disableCheckboxValue,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [filterValue, setFilterValue] = useState<string>("all");
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });

  const handleRowSelection = (rowId: string, row: TData) => {
    if (disableCheckboxValue && row[disableCheckboxValue.key] === disableCheckboxValue.value) {
      return;
    }
    setSelectedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const handleSelectAll = () => {
    const allSelectableRows = table.getRowModel().rows.filter(
      (row) =>
        !disableCheckboxValue || row.original[disableCheckboxValue.key] !== disableCheckboxValue.value
    );

    const allSelected = allSelectableRows.every((row) => selectedRows[row.id]);

    const newSelections = Object.fromEntries(
      allSelectableRows.map((row) => [row.id, !allSelected])
    );

    setSelectedRows(newSelections);
  };

  const getSelectedRowsData = () => {
    return table
      .getRowModel()
      .rows.filter((row) => selectedRows[row.id])
      .map((row) => row.original);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4 gap-2">
        <Input
          placeholder="Search"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {filterOptions && (
          <Select
            value={filterValue}
            onValueChange={(value) => {
              setFilterValue(value);
              if (filterOptions) {
                table
                  .getColumn(filterOptions.key)
                  ?.setFilterValue(value === "all" ? undefined : value);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filterOptions.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-3">
          {buttonSelected && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => buttonSelected.onClick(getSelectedRowsData())}
              disabled={Object.values(selectedRows).every(
                (isSelected) => !isSelected
              )}
            >
              {buttonSelected.label}
            </Button>
          )}
          {column && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns
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
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {enableRowSelection && (
                  <TableHead>
                    <Checkbox
                      checked={Object.values(selectedRows).every(
                        (isSelected) => isSelected
                      )}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isDisabled =
                  disableCheckboxValue &&
                  row.original[disableCheckboxValue.key] ===
                    disableCheckboxValue.value;

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={isDisabled ? "text-muted-foreground" : ""}
                  >
                    {enableRowSelection && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows[row.id] || false}
                          onCheckedChange={() => handleRowSelection(row.id, row.original)}
                          disabled={isDisabled}
                        />
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
