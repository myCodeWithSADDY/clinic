// components/resource-list-page.tsx
"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  header: string;

  cell: (row: T) => React.ReactNode;
  className?: string;
};

type ResourceListPageProps<T> = {
  title: string;
  description: string;
  addHref?: string;
  addLabel?: string;
  addAction?: React.ReactNode;
  searchPlaceholder: string;
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  loading: boolean;
  error?: string;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  pagination: { total: number; totalPages: number };
  emptyTitle?: string;
  emptyDescription?: string;
  // Optional per-row actions (e.g. a dropdown menu cell), rendered
  // as the last column if provided
  renderActions?: (row: T) => React.ReactNode;
};

export function ResourceListPage<T>({
  title,
  description,
  addHref,
  addLabel,
  addAction,
  searchPlaceholder,
  columns,
  data,
  getRowKey,
  loading,
  error,
  search,
  onSearchChange,
  page,
  onPageChange,
  pagination,
  emptyTitle = "No results found",
  emptyDescription = "Try changing your search or add a new record.",
  renderActions,
}: ResourceListPageProps<T>) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {addAction ? (
          addAction
        ) : (
          <Button asChild>
            <Link href={addHref ?? "#"}>
              <Plus className="mr-2 size-4" />
              {addLabel}
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All {title}</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-destructive">
              {error}
            </div>
          ) : data.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">{emptyTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {emptyDescription}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead key={col.header} className={col.className}>
                          {col.header}
                        </TableHead>
                      ))}
                      {renderActions && <TableHead className="w-10" />}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={getRowKey(row)}>
                        {columns.map((col) => (
                          <TableCell key={col.header} className={col.className}>
                            {col.cell(row)}
                          </TableCell>
                        ))}
                        {renderActions && (
                          <TableCell>{renderActions(row)}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {pagination.total} result{pagination.total !== 1 ? "s" : ""}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || loading}
                    onClick={() => onPageChange(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages || loading}
                    onClick={() => onPageChange(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
