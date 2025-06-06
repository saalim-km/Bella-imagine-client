import { useState } from "react";
import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useUpdateVendorRequest,
  useVendorRequest,
  vendorKeys,
} from "@/hooks/admin/useVendor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildQueryParams } from "@/utils/helper/query-generator";
import { handleError } from "@/utils/Error/error-handler.utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import Pagination from "@/components/common/Pagination";
import { useNavigate } from "react-router-dom";

export function VendorRequestsTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [customRejectReason, setCustomRejectReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const { mutate: approveVendor } = useUpdateVendorRequest();
  const { mutate: rejectVendor } = useUpdateVendorRequest();
  const itemsPerPage = 8;

  const FILTER_OPTIONS = [
    { label: "Old Requests", value: "oldest" },
  ];

  const predefinedReasons = [
    "Incomplete profile information",
    "Unverified contact details",
    "Does not meet quality standards",
    "Other (Specify reason)",
  ];

  const filterOptions = buildQueryParams(appliedFilters);
  console.log(filterOptions);
  const {
    data: vendorRequestsData,
    isLoading,
  } = useVendorRequest(
    {
      search: appliedSearchTerm,
      ...filterOptions,
    },
    {
      page: currentPage,
      limit: itemsPerPage,
    }
  );

  const vendorRequests = vendorRequestsData?.data?.data || [];
  const totalVendors = vendorRequestsData?.data?.total ?? 1;
  const totalPages = Math.max(1, Math.ceil(totalVendors / itemsPerPage));

  console.log(vendorRequests, totalPages);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

  const toggleFilter = (key: string) => {
    setSelectedFilters((prev) => {
      let updatedFilters = prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key];

      if (key === "latest") {
        updatedFilters = updatedFilters.filter((item) => item !== "oldest");
      } else if (key === "oldest") {
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

  const handleApprove = async (id: string) => {
    console.log("vendor id", id);
    setIsApproving(true);
    approveVendor(
      { id: id, status: true },
      {
        onSuccess: (data: any) => {
          setIsApproving(false);
          queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
          toast.success(data.message);
        },
        onError: (error) => {
          setIsApproving(false);
          handleError(error);
        },
      }
    );
  };

  const handleOpenRejectModal = (id: string) => {
    setSelectedVendor(id);
    setRejectModalOpen(true);
    setRejectReason("");
    setCustomRejectReason("");
  };

  const handleReject = async () => {
    if (selectedVendor) {
      setIsApproving(true);
      const reasonToSend =
        rejectReason === "Other (Specify reason)"
          ? customRejectReason
          : rejectReason;
      console.log(reasonToSend, selectedVendor);
      rejectVendor(
        {
          id: selectedVendor,
          reason: reasonToSend,
          status: false,
        },
        {
          onSuccess: (data: any) => {
            setIsApproving(false);
            setRejectModalOpen(false);
            setRejectReason("");
            setCustomRejectReason("");
            queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
            queryClient.invalidateQueries({
              queryKey: ["vendor-notifications"],
            });
            toast.success(data.message);
          },
          onError: (error) => {
            setIsApproving(false);
            handleError(error);
          },
        }
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Requests</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex">
              <Input
                placeholder="Search requests..."
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
          <Spinner />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No vendor requests found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  vendorRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="font-medium">
                        {request.name}
                      </TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell>
                        {request.isVerified === "pending" && (
                          <Badge className="bg-yellow-600" variant={"outline"}>
                            Pending
                          </Badge>
                        )}
                        {request.isVerified === "accept" && (
                          <Badge className="bg-green-600" variant={"outline"}>
                            Accepted
                          </Badge>
                        )}
                        {request.isVerified === "reject" && <Badge className="bg-red-600" variant={"outline"}>
                            Rejected
                          </Badge>}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="p-2">
                            <DropdownMenuItem asChild>
                              <a
                                onClick={() =>
                                  navigate(`/admin/user/${request._id}/vendor`)
                                }
                                className="hover:cursor-pointer"
                              >
                                View Details
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <div className="flex items-center gap-2 pt-1">
                                {request.isVerified !== "accept" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() =>
                                        request._id &&
                                        handleApprove(request._id)
                                      }
                                      disabled={isApproving}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleOpenRejectModal(request._id ?? "")
                                      }
                                      disabled={isApproving || request.isVerified == 'reject'}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </CardContent>
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Vendor Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Select a reason for rejection:</p>
            <div className="space-y-2">
              {predefinedReasons.map((reason, index) => (
                <Button
                  key={index}
                  variant={rejectReason === reason ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setRejectReason(reason)}
                >
                  {reason}
                </Button>
              ))}
            </div>
            {rejectReason === "Other (Specify reason)" && (
              <Textarea
                placeholder="Enter reason for rejection..."
                value={customRejectReason}
                onChange={(e) => setCustomRejectReason(e.target.value)}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={
                !rejectReason ||
                (rejectReason === "Other (Specify reason)" &&
                  !customRejectReason)
              }
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
