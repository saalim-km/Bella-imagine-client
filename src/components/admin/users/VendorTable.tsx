"use client"
import { useState } from "react"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePhotographers, useDeactivatePhotographer } from "@/hooks"

interface UserTableProps {
  userType: "photographers" | "clients"
}

export function UserTable({ userType }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltering, setIsFiltering] = useState(false)

  // Fetch photographers data
  const { data: photographersData, isLoading } = usePhotographers(
    { search: searchTerm },
    { page: currentPage, limit: 10 },
  )

  // Mutation for deactivating a photographer
  const { mutate: deactivatePhotographer } = useDeactivatePhotographer()

  const photographers = photographersData?.data || []

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handleDeactivate = (id: number) => {
    deactivatePhotographer(id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Photographers</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search photographers..."
              className="w-[250px]"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button variant="outline" size="sm" onClick={() => setIsFiltering(!isFiltering)}>
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p>Loading users...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {photographers.map((photographer) => (
                <TableRow key={photographer.id}>
                  <TableCell className="font-medium">{photographer.name}</TableCell>
                  <TableCell>{photographer.email}</TableCell>
                  <TableCell>
                    <Badge variant={photographer.status === "Active" ? "default" : "secondary"}>
                      {photographer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{photographer.joinDate}</TableCell>
                  <TableCell>{photographer.earnings}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={`/admin/users/${photographer.id}`}>View Details</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`/admin/users/${photographer.id}/edit`}>Edit</a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeactivate(photographer.id)}>
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

