import { useState } from "react"
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

export function ClientTable() {
  const queryClient = useQueryClient()
  const { mutate: block } = useBlockClient()
  const { mutate: unBlock } = useUnBlockClient()
  const { bgColor, buttonPrimary, isDarkMode } = useThemeConstants()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4


  const [selectedClient, setSelectedClient] = useState<{ id: string; action: "block" | "unblock" } | null>(null)

  function confirmAction(clientId: string, action: "block" | "unblock") {
    setSelectedClient({ id: clientId, action })
  }

  function handleConfirm() {
    if (!selectedClient) return

    const { id, action } = selectedClient
    console.log(id);
    if (action === "block") {
      block(id, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({queryKey : clientKeys.lists()})
          toast.success(data.message)
        },
        onError: (err) => {
          console.log(err)
        },
      })
    } else {
      unBlock(id, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({queryKey : clientKeys.lists()})
          toast.success(data.message)
        },
        onError: (err) => {
          console.log(err)
        },
      })
    }

    // Reset the dialog state
    setSelectedClient(null)
  }

  const { data: clientsData, isLoading } = useAllClientQuery(
    { search: searchTerm },
    { page: currentPage, limit: itemsPerPage }
  )

  const clients = clientsData?.clients.data || []
  const totalClients = clientsData?.clients.total || 0
  const totalPages = Math.max(1, Math.ceil(totalClients / itemsPerPage))

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
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
              <Input placeholder="Search clients..." className="w-[250px]" value={searchTerm} onChange={handleSearch} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <p>Loading clients...</p>
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
                  {clients.map((client) => (
                    <TableRow key={client._id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        <Badge variant={client.isActive ? "default" : "secondary"}>{client.isActive ? "Active" : "InActive"}</Badge>
                      </TableCell>
                      <TableCell>{new Date(client.createdAt).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className={isDarkMode ? buttonPrimary : "text-black bg-slate-100"}>
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
                              onClick={() => confirmAction(client._id, client.isblocked ? "unblock" : "block")}
                            >
                              {client.isblocked ? "Unblock" : "Block"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                  Previous
                </Button>
                <span className="text-sm">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </Button>
              </div>
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
