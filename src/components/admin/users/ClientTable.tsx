import type React from "react"
import { useState, useMemo } from "react"
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
import { clientKeys, useAllClientQuery, useBlockClient, useUnBlockClient } from "@/hooks/admin/useClients"
import { useThemeConstants } from "@/utils/theme/themeUtills"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useQueryClient } from "@tanstack/react-query"
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { buildQueryParams } from "@/utils/queryGenerator"
import Pagination from "@/components/common/Pagination"
import { Spinner } from "@/components/ui/spinner"


const FILTER_OPTIONS = [
  { label: "Active", value: "isActive" },
  { label: "Inactive", value: "notActive" },
  { label: "Blocked", value: "blocked" },
  { label: "Not Blocked", value: "notBlocked" },
  { label: "Latest Joined", value: "latest" },
  { label: "Older Member", value: "oldest" },
];

export function ClientTable() {
  const queryClient = useQueryClient()
  const { mutate: block } = useBlockClient()
  const { mutate: unBlock } = useUnBlockClient()
  const { bgColor, buttonPrimary, isDarkMode } = useThemeConstants()
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [appliedFilters, setAppliedFilters] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const toggleFilter = (key: string) => {
    setSelectedFilters((prev) => {
      let updatedFilters = prev.includes(key) 
        ? prev.filter((item) => item !== key)
        : [...prev, key];
      if (key === "latest") {
        updatedFilters = updatedFilters.filter((item) => item !== "older");
      } else if (key === "older") {
        updatedFilters = updatedFilters.filter((item) => item !== "latest");
      }
  
      return updatedFilters;
    });
  };

  const applyFilters = () => {
    setAppliedFilters(selectedFilters)
    setCurrentPage(1)
    setDropdownOpen(false)
  }

  const handleSearchSubmit = () => {
    setAppliedSearchTerm(searchTerm)
    setCurrentPage(1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const [selectedClient, setSelectedClient] = useState<{
    id: string
    action: "block" | "unblock"
  } | null>(null)

  function confirmAction(clientId: string, action: "block" | "unblock") {
    setSelectedClient({ id: clientId, action })
  }

  function handleConfirm() {
    if (!selectedClient) return

    const { id, action } = selectedClient

    if (action === "block") {
      block(id, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
          toast.success(data.message)
        },
        onError: (err) => {
          console.log(err)
        },
      })
    } else {
      unBlock(id, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
          toast.success(data.message)
        },
        onError: (err) => {
          console.log(err)
        },
      })
    }
    setSelectedClient(null)
  }

  const filterOptions = buildQueryParams(appliedFilters)
  console.log(filterOptions);
  const { data: clientsData, isLoading } = useAllClientQuery(
    {
      ...filterOptions,
      search: appliedSearchTerm,
    },
    { page: currentPage, limit: itemsPerPage },
  )

  const clients = clientsData?.clients.data || []
  const totalClients = clientsData?.clients.total || 0
  const totalPages = Math.max(1, Math.ceil(totalClients / itemsPerPage))

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
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
            <CardTitle>Clients</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex">
                <Input 
                  placeholder="Search clients..." 
                  className="w-[200px] rounded-r-none" 
                  value={searchTerm} 
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  className="rounded-l-none" 
                  onClick={handleSearchSubmit}
                >
                  Search
                </Button>
              </div>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Filter {appliedFilters.length > 0 && `(${appliedFilters.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {FILTER_OPTIONS.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={selectedFilters.includes(option.value)}
                      onCheckedChange={() => toggleFilter(option.value)}
                      onSelect={(e) => e.preventDefault()} // Prevent closing on select
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="flex justify-end p-2">
                    <Button size="sm" onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
           <Spinner/>
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
                  {clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No clients found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients.map((client) => (
                      <TableRow key={client._id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                          <Badge variant={client.isActive ? "default" : "secondary"}>
                            {client.isActive ? "Active" : "InActive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(client.createdAt).toLocaleDateString("en-GB")}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={isDarkMode ? buttonPrimary : "text-black bg-slate-100"}
                              >
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a href={`/admin/clients/${client._id}`}>View Details</a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => client._id && confirmAction(client._id, client.isblocked ? "unblock" : "block")}
                              >
                                {client.isblocked ? "Unblock" : "Block"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {selectedClient && (
        <AlertDialog open={true} onOpenChange={(open) => !open && setSelectedClient(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedClient.action === "block" ? "Block Client" : "Unblock Client"}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {selectedClient.action} this client?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedClient(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                {selectedClient.action === "block" ? "Block" : "Unblock"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}