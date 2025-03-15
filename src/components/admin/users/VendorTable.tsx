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
import { useAllVendorQuery, useBlockVendor, useUnBlockVendor, vendorKeys } from "@/hooks/admin/useVendor"
import { useThemeConstants } from "@/utils/theme/themeUtills"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader
} from "@/components/ui/alert-dialog"

export function UserTable() {
  const queryClient = useQueryClient()
  const { bgColor, buttonPrimary, isDarkMode } = useThemeConstants()
  const { mutate: block } = useBlockVendor()
  const { mutate: unBlock } = useUnBlockVendor()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltering, setIsFiltering] = useState(false)
  const itemsPerPage = 5 // Matching the limit in the query
  
  const [selectedClient, setSelectedClient] = useState<{ id: string; action: "block" | "unblock" } | null>(null)

  function confirmAction(clientId: string, action: "block" | "unblock") {
    setSelectedClient({ id: clientId, action })
  }

  function handleConfirm() {
    if (!selectedClient) return

    const { id, action } = selectedClient
    
    if (action === "block") {
      block(id, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: vendorKeys.lists()
          })
          toast.success(data.message)
        },
        onError: (err) => {
          toast.error("Failed to block vendor")
        },
      })
    } else {
      unBlock(id, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: vendorKeys.lists()
          })
          toast.success(data.message)
        },
        onError: (err) => {
          toast.error("Failed to unblock vendor")
        },
      })
    }

    // Reset the dialog state
    setSelectedClient(null)
  }

  const { data: photographersData, isLoading } = useAllVendorQuery(
    { search: searchTerm, page: currentPage, limit: itemsPerPage },
  )

  const photographers = photographersData?.vendors.data || []
  const totalPages = photographersData?.vendors.total || 1

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <>
      <Card className={`bg-${bgColor}`}>
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
              <p>Loading vendors...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {photographers.map((photographer) => (
                    <TableRow key={photographer._id}>
                      <TableCell className="font-medium">{photographer.name}</TableCell>
                      <TableCell>{photographer.email}</TableCell>
                      <TableCell>
                        <Badge variant={photographer.isActive ? "default" : "secondary"}>
                          {photographer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{photographer.createdAt.toString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={isDarkMode ? buttonPrimary : 'text-black bg-slate-100'}
                            >
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <a href={`/admin/vendor/${photographer._id}`}>View Details</a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => confirmAction(photographer._id, photographer.isblocked ? "unblock" : "block")}
                            >
                              {photographer.isblocked ? "Unblock" : "Block"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              <div className="flex justify-end mt-4 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1} 
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages} 
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedClient?.action === "block" ? "Block Vendor" : "Unblock Vendor"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedClient?.action} this client?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedClient(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {selectedClient?.action === "block" ? "Block" : "Unblock"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}