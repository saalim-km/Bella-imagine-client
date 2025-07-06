import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  useAllVendorQuery,
  useBlockVendor,
  useUnBlockVendor,
} from "@/hooks/admin/useVendor";
import { useQueryClient } from "@tanstack/react-query";
import { buildQueryParams } from "@/utils/helper/query-generator";
import { handleError } from "@/utils/Error/error-handler.utils";
import { ColumnDef, DataTable } from "@/components/common/Table";
import { ReusableDropdown } from "@/components/common/ReusableDropdown";
import { IVendor } from "@/services/vendor/vendorService";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ReusableAlertDialog } from "@/components/common/AlertDialogue";
import { communityToast } from "@/components/ui/community-toast";

const FILTER_OPTIONS = [
  { label: "Blocked", value: "blocked" },
  { label: "Older Member", value: "oldest" },
];

export function UserTable() {
  const queryClient = useQueryClient();
  const { mutate: block } = useBlockVendor();
  const { mutate: unBlock } = useUnBlockVendor();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [selectedVendor, setSelectedVendor] = useState<{
    id: string;
    action: "block" | "unblock";
  } | null>(null);

  // Define columns for DataTable
  const columns: ColumnDef<IVendor>[] = [
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
      cell: (item) => (
        <Badge variant={item.isblocked ? "outline" : "secondary"}>
          {item.isblocked ? "blocked" : "not-blocked"}
        </Badge>
      ),
    },
    {
      id: "joinDate",
      header: "Join Date",
      cell: (item) => new Date(item.createdAt).toLocaleDateString("en-GB"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (item) => (
        <ReusableDropdown
          actions={[
            {
              label: "View Details",
              href: `/admin/user/${item._id}/vendor`,
            },
            { type: "separator" },
            {
              label: item.isblocked ? "Unblock" : "Block",
              onClick: () =>
                item._id &&
                confirmAction(item._id, item.isblocked ? "unblock" : "block"),
              danger: true,
            },
          ]}
        />
      ),
    },
  ];

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

  function confirmAction(vendorId: string, action: "block" | "unblock") {
    setSelectedVendor({ id: vendorId, action });
  }

  async function handleConfirm() {
    if (!selectedVendor) return;

    const { id, action } = selectedVendor;

    const queryKey = [
      "vendors-list-admin",
      { ...filterOptions, search: appliedSearchTerm },
      { page: currentPage, limit: itemsPerPage },
    ];

    await queryClient.cancelQueries({ queryKey });
    const previousData = queryClient.getQueryData(queryKey);

    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;

      const updatedDocs = oldData.data.data.map((vendor: IVendor) =>
        vendor._id === id
          ? { ...vendor, isblocked: action === "block" }
          : vendor
      );

      return {
        ...oldData,
        data: {
          ...oldData.data,
          data: updatedDocs,
        },
      };
    });

    if (action === "block") {
      block(id, {
        onSuccess: (data) => {
          communityToast.success({ description: data?.message });
        },
        onError: (err) => {
          queryClient.setQueryData(queryKey,previousData)
          handleError(err);
        },
      });
    } else {
      unBlock(id, {
        onSuccess: (data) => {
          communityToast.success({ description: data?.message });
        },
        onError: (err) => {
          queryClient.setQueryData(queryKey,previousData)
          handleError(err);
        },
      });
    }
    setSelectedVendor(null);
  }

  const filterOptions = buildQueryParams(appliedFilters);
  const { data: vendorsData, isLoading } = useAllVendorQuery(
    { ...filterOptions, search: appliedSearchTerm },
    { page: currentPage, limit: itemsPerPage }
  );

  const vendors = vendorsData?.data?.data || [];
  const totalVendors = vendorsData?.data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalVendors / itemsPerPage));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vendors</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex">
                <Input
                  placeholder="Search vendors..."
                  className="w-[200px] rounded-r-none"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  variant={"outline"}
                  className="rounded-l-none"
                  onClick={handleSearchSubmit}
                >
                  Search
                </Button>
              </div>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Filter{" "}
                    {appliedFilters.length > 0 && `(${appliedFilters.length})`}
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
                    <Button
                      variant={"outline"}
                      size="sm"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <DataTable
          data={vendors}
          columns={columns}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          emptyMessage="No vendors found matching your filters"
          isLoading={isLoading}
        />
      </Card>

      {selectedVendor && (
        <ReusableAlertDialog
          open={true}
          onOpenChange={(open) => !open && setSelectedVendor(null)}
          title={
            selectedVendor.action === "block"
              ? "Block Vendor"
              : "Unblock Vendor"
          }
          description={`Are you sure you want to ${selectedVendor.action} this vendor?`}
          confirmLabel={selectedVendor.action === "block" ? "Block" : "Unblock"}
          cancelLabel="Cancel"
          onConfirm={handleConfirm}
          onCancel={() => setSelectedVendor(null)}
          confirmVariant={
            selectedVendor.action === "block" ? "destructive" : "default"
          }
        />
      )}
    </>
  );
}
