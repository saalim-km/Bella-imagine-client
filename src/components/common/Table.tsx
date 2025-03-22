import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import Pagination from "@/components/common/Pagination"
import { Spinner } from "../ui/spinner"

export type ColumnDef<T> = {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  emptyMessage?: string
  className?: string
  isLoading?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  emptyMessage = "No data found",
  className = "",
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <Card className={`p-4 ${className}`}>
      {isLoading ? (
        <Spinner/>
      ) : data.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground">{emptyMessage}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.className}>
                    {column.cell ? column.cell(item) : column.accessorKey ? item[column.accessorKey] : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 && onPageChange && (
        <div className="mt-4">
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
        </div>
      )}
    </Card>
  )
}