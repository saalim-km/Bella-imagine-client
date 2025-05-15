import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAllVendorQuery, useBlockVendor, useUnBlockVendor, vendorKeys } from "@/hooks/admin/useVendor";
import { useThemeConstants } from "@/utils/theme/theme.utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { buildQueryParams } from "@/utils/helper/query-generator";
import Pagination from "@/components/common/Pagination";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { handleError } from "@/utils/Error/error-handler.utils";

const FILTER_OPTIONS = [
  { label: "Active", value: "isActive" },
  { label: "Inactive", value: "notActive" },
  { label: "Blocked", value: "blocked" },
  { label: "Not Blocked", value: "notBlocked" },
  { label: "Latest Joined", value: "latest" },
  { label: "Older Member", value: "oldest" },
];

export function UserTable() {
  const navigate = useNavigate()
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

  const [selectedVendor, setSelectedVendor] = useState<{
    id: string;
    action: "block" | "unblock";
  } | null>(null);

  function confirmAction(vendorId: string, action: "block" | "unblock") {
    setSelectedVendor({ id: vendorId, action });
  }

  function handleConfirm() {
    if (!selectedVendor) return;

    const { id, action } = selectedVendor;

    if (action === "block") {
      block(id, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
          toast.success(data?.message);
        },
        onError: (err) => {
          handleError(err)
        },
      });
    } else {
      unBlock(id, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
          toast.success(data?.message);
        },
        onError: (err) => {
          handleError(err)
        },
      });
    }
    setSelectedVendor(null);
  }

  const filterOptions = buildQueryParams(appliedFilters)
  console.log(filterOptions);
  console.log('current page : ',currentPage);
  const { data: vendorsData, isLoading } = useAllVendorQuery(
    { ...filterOptions, search: appliedSearchTerm},{ page: currentPage, limit: itemsPerPage }  
  );

  const vendors = vendorsData?.vendors?.data || [];
  const totalVendors = vendorsData?.vendors?.total || 0;
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
                <Button variant={"outline"} className="rounded-l-none" onClick={handleSearchSubmit}>
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
                    <Button variant={"outline"} size="sm" onClick={applyFilters}>
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
                  {vendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No vendors found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendors.map((vendor) => (
                      <TableRow key={vendor._id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>
                          <Badge variant={vendor.isActive ? "outline" : "secondary"}>
                            {vendor.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(vendor.createdAt).toLocaleDateString("en-GB")}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a onClick={()=> navigate(`/admin/user/${vendor._id}/vendor`)}>View Details</a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => vendor._id && confirmAction(vendor._id, vendor.isblocked ? "unblock" : "block")}
                              >
                                {vendor.isblocked ? "Unblock" : "Block"}
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
      {selectedVendor && (
        <AlertDialog open={true} onOpenChange={(open) => !open && setSelectedVendor(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedVendor.action === "block" ? "Block Vendor" : "Unblock Vendor"}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {selectedVendor.action} this vendor?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedVendor(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                {selectedVendor.action === "block" ? "Block" : "Unblock"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}