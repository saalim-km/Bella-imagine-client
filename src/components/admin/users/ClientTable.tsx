import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAllClientQuery, useBlockClient, useUnBlockClient, clientKeys } from "@/hooks/admin/useClients";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { buildQueryParams } from "@/utils/helper/query-generator";
import { handleError } from "@/utils/Error/error-handler.utils";
import { DataTable, type ColumnDef } from "@/components/common/Table";
import { ReusableDropdown } from "@/components/common/ReusableDropdown";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ReusableAlertDialog } from "@/components/common/AlertDialogue";

const FILTER_OPTIONS = [
  { label: "Blocked", value: "blocked" },
  { label: "Older Member", value: "oldest" },
];

export function ClientTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: block } = useBlockClient();
  const { mutate: unBlock } = useUnBlockClient();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<{ id: string; action: "block" | "unblock" } | null>(null);
  const itemsPerPage = 4;

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
    setAppliedFilters(selectedFilters);
    setCurrentPage(1);
    setDropdownOpen(false);
  };

  const handleSearchSubmit = () => {
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  function confirmAction(clientId: string, action: "block" | "unblock") {
    setSelectedClient({ id: clientId, action });
  }

  function handleConfirm() {
    if (!selectedClient) return;
    const { id, action } = selectedClient;

    const mutation = action === "block" ? block : unBlock;
    mutation(id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
        toast.success(data.message);
      },
      onError: (err) => {
        handleError(err);
      },
    });

    setSelectedClient(null);
  }

  const filterOptions = buildQueryParams(appliedFilters);
  const { data: clientsData, isLoading } = useAllClientQuery(
    {
      ...filterOptions,
      search: appliedSearchTerm,
    },
    { page: currentPage, limit: itemsPerPage }
  );

  const clients = clientsData?.data.data || [];
  const totalClients = clientsData?.data.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalClients / itemsPerPage));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const columns: ColumnDef<typeof clients[0]>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },
    {
      id: "status",
      header: "Status",
      cell: (client) => (
        <Badge variant={client.isActive ? "default" : "secondary"}>
          {client.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "joinDate",
      header: "Join Date",
      cell: (client) => new Date(client.createdAt).toLocaleDateString("en-GB"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (client) => (
        <ReusableDropdown
          actions={[
            {
              label: "View Details",
              href: `/admin/user/${client._id}/client`,
            },
            { type: "separator" },
            {
              label: client.isblocked ? "Unblock" : "Block",
              onClick: () => client._id && confirmAction(client._id, client.isblocked ? "unblock" : "block"),
              danger: true,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <CardHeader className="flex items-center justify-between">
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
            <Button variant="outline" className="rounded-l-none" onClick={handleSearchSubmit}>
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
                  onSelect={(e) => e.preventDefault()}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <div className="flex justify-end p-2">
                <Button variant="outline" size="sm" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <DataTable
        data={clients}
        columns={columns}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        emptyMessage="No clients found matching your filters"
      />

      {selectedClient && (
        <ReusableAlertDialog
          open={true}
          onOpenChange={(open) => !open && setSelectedClient(null)}
          title={selectedClient.action === "block" ? "Block Client" : "Unblock Client"}
          description={`Are you sure you want to ${selectedClient.action} this client?`}
          confirmLabel={selectedClient.action === "block" ? "Block" : "Unblock"}
          cancelLabel="Cancel"
          onConfirm={handleConfirm}
          onCancel={() => setSelectedClient(null)}
          confirmVariant={selectedClient.action === "block" ? "destructive" : "default"}
        />
      )}
    </>
  );
}