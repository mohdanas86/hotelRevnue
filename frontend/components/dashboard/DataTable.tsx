"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useRevenueOverTime } from "@/hooks/useDashboard";
import type { DashboardFilters, RevenueOverTimeItem } from "@/types/dashboard";
import { formatCurrencyFull, formatDate, formatNumber } from "@/lib/formatters";

// We'll use revenue-over-time data as the table source
// (daily aggregated per date — best available for tabular view)

type TableRow = {
    date: string;
    revenue: number;
    adr: number;
};

const columns: ColumnDef<TableRow>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => (
            <span className="tabular-nums text-xs">{String(getValue())}</span>
        ),
    },
    {
        accessorKey: "revenue",
        header: "Revenue (₹)",
        cell: ({ getValue }) => (
            <span className="tabular-nums text-xs">{formatCurrencyFull(Number(getValue()))}</span>
        ),
    },
    {
        accessorKey: "adr",
        header: "Avg ADR (₹)",
        cell: ({ getValue }) => (
            <span className="tabular-nums text-xs">{formatCurrencyFull(Number(getValue()))}</span>
        ),
    },
];

interface DataTableProps {
    filters: DashboardFilters;
}

export function DataTable({ filters }: DataTableProps) {
    const dailyFilters = useMemo(
        () => ({ ...filters, granularity: "day" as const }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters.startDate, filters.endDate, filters.hotelId, filters.channel, filters.segment]
    );
    const { data, isLoading, error } = useRevenueOverTime(dailyFilters);

    const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = useState("");

    const tableData = useMemo<TableRow[]>(
        () =>
            (data?.data ?? []).map((d) => ({
                date: d.Date,
                revenue: d.Revenue_INR,
                adr: d.ADR_INR,
            })),
        [data]
    );

    const table = useReactTable({
        data: tableData,
        columns,
        state: { sorting, columnFilters, columnVisibility, globalFilter },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { pagination: { pageSize: 25 } },
    });

    const exportCSV = useCallback(() => {
        const rows = table.getFilteredRowModel().rows;
        const header = ["Date", "Revenue (INR)", "ADR (INR)"];
        const csvRows = [
            header.join(","),
            ...rows.map((r) =>
                [r.getValue("date"), r.getValue("revenue"), r.getValue("adr")].join(",")
            ),
        ];
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "hotel_revenue_data.csv";
        a.click();
        URL.revokeObjectURL(url);
    }, [table]);

    if (isLoading && !data) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <p className="text-sm text-muted-foreground">No records available for the selected filters.</p>
        );
    }

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
                <Input
                    placeholder="Search dates, revenue…"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 w-56 text-xs"
                />
                <Badge variant="secondary" className="ml-auto text-xs">
                    {table.getFilteredRowModel().rows.length} rows
                </Badge>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={exportCSV}>
                    <Download className="h-3 w-3" />
                    Export CSV
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => {
                                    const sorted = header.column.getIsSorted();
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="cursor-pointer select-none text-xs"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {sorted === "asc" ? (
                                                    <ChevronUp className="h-3 w-3" />
                                                ) : sorted === "desc" ? (
                                                    <ChevronDown className="h-3 w-3" />
                                                ) : (
                                                    <ChevronsUpDown className="h-3 w-3 opacity-30" />
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {table.getRowModel().rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="py-8 text-center text-sm text-muted-foreground">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                    <Select
                        value={String(table.getState().pagination.pageSize)}
                        onValueChange={(val) => table.setPageSize(Number(val))}
                    >
                        <SelectTrigger className="h-7 w-16 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 25, 50, 100].map((s) => (
                                <SelectItem key={s} value={String(s)}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    rows / page
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        ‹ Prev
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next ›
                    </Button>
                </div>
            </div>
        </div>
    );
}
