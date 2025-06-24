import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Slider } from "@/components/ui/slider";
import { useBookingQuery } from "@/hooks/booking/useBooking";
import { getClientBookings } from "@/services/booking/bookingService";
import { useBookingStatusMutation } from "@/hooks/booking/useBooking";
import { clientUpdateBookingStatus } from "@/services/booking/bookingService";
import { ConfirmationModal } from "@/components/modals/ConfimationModal";
import { BookingDetailsModal } from "@/components/modals/BookingDetailsModal";
import { toast } from "sonner";
import { formatPrice } from "@/utils/formatters/format-price.utils";
import moment from "moment";
import { debounce } from "lodash";
import { TRole } from "@/types/interfaces/User";
import Pagination from "@/components/common/Pagination";
import { Spinner } from "@/components/ui/spinner";
import { PaymentStatus, TBookingStatus } from "@/types/interfaces/Payment";

interface FilterState {
  status: string;
  dateRange: DateRange | undefined;
  priceRange: [number, number];
  search: string;
}

interface ClientBookingListProps {
  userType: TRole;
}

export interface BookingList {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  vendorId: {
    _id: string;
    name: string;
  };
  adminCommision : number;
  paymentId: string | null;
  isClientApproved: boolean;
  isVendorApproved: boolean;
  serviceDetails: {
    _id: string;
    serviceTitle: string;
    serviceDescription: string;
    cancellationPolicies: string[];
    termsAndConditions: string[];
    location: {
      lat: number;
      lng: number;
      address: string;
    };
  };
  bookingDate: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  distance?: number;
  travelFee?: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  status: TBookingStatus;
  customLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ClientBookingList({
  userType,
}: ClientBookingListProps) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    dateRange: undefined,
    priceRange: [0, 100000],
    search: "",
  });
  const [bookings, setBookings] = useState<BookingList[] | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(
    filters.priceRange
  );

  const limit = 3;
  const maxPrice = 100000;

  // Debounced price range handler for API calls
  const debouncedPriceRange = useMemo(
    () =>
      debounce((value: [number, number]) => {
        setFilters((prev) => ({ ...prev, priceRange: value }));
        setPage(1);
      }, 500),
    []
  );

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPage(1);
      }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSliderChange = (value: number[]) => {
    setTempPriceRange([value[0], value[1]]);
    debouncedPriceRange([value[0], value[1]]);
  };

  const handleInputChange = (type: "min" | "max", value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    if (isNaN(numValue)) return;

    let newRange: [number, number];
    if (type === "min") {
      newRange = [Math.max(0, numValue), tempPriceRange[1]];
      if (numValue > tempPriceRange[1]) {
        newRange[1] = numValue;
      }
    } else {
      newRange = [tempPriceRange[0], Math.min(maxPrice, numValue)];
      if (numValue < tempPriceRange[0]) {
        newRange[0] = numValue;
      }
    }

    setTempPriceRange(newRange);
    debouncedPriceRange(newRange);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      dateRange: undefined,
      priceRange: [0, maxPrice],
      search: "",
    });
    setTempPriceRange([0, maxPrice]);
    setPage(1);
  };

  // Construct query parameters
  const queryParams = {
    page,
    limit,
    sort: sortBy,
    statusFilter: filters.status,
    search: filters.search,
    dateFrom: filters.dateRange?.from
      ? moment(filters.dateRange.from).format("YYYY-MM-DD")
      : undefined,
    dateTo: filters.dateRange?.to
      ? moment(filters.dateRange.to).format("YYYY-MM-DD")
      : undefined,
    priceMin: filters.priceRange[0],
    priceMax: filters.priceRange[1],
  };

  const { data, isLoading } = useBookingQuery(
    getClientBookings,
    queryParams,
    userType === "client"
  );

  useEffect(() => {
    if (data) {
      setBookings(data.data.data);
      const totalPages = Math.max(1, Math.ceil(data.data.total / limit));
      setTotalPages(totalPages);
    }
  }, [data]);

  const { mutate: updateBookingStatus } = useBookingStatusMutation(
    clientUpdateBookingStatus
  );

  const onUpdateStatus = () => {
    if (bookingId && status) {
      updateBookingStatus(
        { bookingId, status },
        {
          onSuccess: (data) => toast.success(data.message),
          onError: (error: any) => toast.error(error.response.data.message),
        }
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy === field) return <ChevronUp className="w-4 h-4" />;
    if (sortBy === `-${field}`) return <ChevronDown className="w-4 h-4" />;
    return null;
  };

  const TableHeadSortable = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <TableHead
      onClick={() => {
        setSortBy(
          sortBy === field ? `-${field}` : sortBy === `-${field}` ? "" : field
        );
        setPage(1);
      }}
      className="cursor-pointer hover:bg-accent transition-colors"
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <span className="w-4">{getSortIcon(field)}</span>
      </div>
    </TableHead>
  );

  const BookingCard = ({ booking }: { booking: BookingList }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{booking.serviceDetails.serviceTitle}</span>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Vendor:</span>
          <span className="text-right font-medium">
            {booking.vendorId.name}
          </span>
          <span className="text-muted-foreground">Date:</span>
          <span className="text-right font-medium">
            {moment(booking.bookingDate).format("LLL")}
          </span>
          <span className="text-muted-foreground">Price:</span>
          <span className="text-right font-medium">
            {formatPrice(booking.totalPrice)}
          </span>
        </div>
        <div className="flex justify-end space-x-2">
          <BookingDetailsModal
            booking={booking}
            trigger={<Button size="sm">View Details</Button>}
          />
          <Button
            size="sm"
            onClick={() => {
              setBookingId(booking._id);
              setStatus("completed");
              setIsConfirmationModalOpen(true);
            }}
            disabled={
              booking.isClientApproved || booking.status === "cancelled"
            }
          >
            Mark as Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-8"
            defaultValue={filters.search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => {
              setFilters((prev) => ({ ...prev, status: value }));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40 border-gray-400">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <DateRangePicker
            value={filters.dateRange}
            onChange={(range) => {
              setFilters((prev) => ({ ...prev, dateRange: range }));
              setPage(1);
            }}
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium">Price Range</label>
          <div className="mt-2 space-y-4">
            <Slider
              value={tempPriceRange}
              onValueChange={handleSliderChange}
              min={0}
              max={maxPrice}
              step={100}
              className="h-6"
              aria-label="Price range slider"
            />
            <div className="flex items-center gap-4">
              <div className="flex-1 ">
                <label className="text-xs font-medium text-muted-foreground">
                  Min
                </label>
                <Input
                  type="number"
                  value={tempPriceRange[0]}
                  onChange={(e) => handleInputChange("min", e.target.value)}
                  min={0}
                  max={maxPrice}
                  step={100}
                  className="h-8 text-sm border-gray-400"
                  aria-label="Minimum price"
                />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Max
                </label>
                <Input
                  type="number"
                  value={tempPriceRange[1]}
                  onChange={(e) => handleInputChange("max", e.target.value)}
                  min={0}
                  max={maxPrice}
                  step={100}
                  className="h-8 text-sm border-gray-400"
                  aria-label="Maximum price"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              ₹{tempPriceRange[0].toLocaleString()} - ₹
              {tempPriceRange[1].toLocaleString()}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full sm:w-auto"
          aria-label="Reset filters"
        >
          <X className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Spinner />
        </div>
      )}

      {!isLoading && bookings?.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No bookings found matching your filters.
          </p>
          <Button variant="link" onClick={resetFilters} className="mt-2">
            Clear filters to see all bookings
          </Button>
        </div>
      )}

      {!isLoading && bookings && bookings.length > 0 && (
        <>
          <div className="hidden md:block rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadSortable field="serviceDetails.serviceTitle">
                    Service
                  </TableHeadSortable>
                  <TableHeadSortable field="vendorId.name">
                    Vendor Name
                  </TableHeadSortable>
                  <TableHeadSortable field="bookingDate">
                    Date
                  </TableHeadSortable>
                  <TableHeadSortable field="totalPrice">
                    Price
                  </TableHeadSortable>
                  <TableHeadSortable field="status">Status</TableHeadSortable>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id} className="hover:bg-accent">
                    <TableCell className="font-medium">
                      {booking.serviceDetails.serviceTitle}
                    </TableCell>
                    <TableCell>{booking.vendorId.name}</TableCell>
                    <TableCell>
                      {moment(booking.bookingDate).format("LLL")}
                    </TableCell>
                    <TableCell>{formatPrice(booking.totalPrice)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <BookingDetailsModal
                          booking={booking}
                          trigger={<Button size="sm">View Details</Button>}
                        />
                        <Select
                          value={booking.status}
                          onValueChange={(value) => {
                            setBookingId(booking._id);
                            setStatus(value);
                            setIsConfirmationModalOpen(true);
                          }}
                          disabled={
                            (booking.isClientApproved &&
                              booking.status === "completed") ||
                            booking.status === "cancelled"
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="pending"
                              disabled={booking.status !== "pending"}
                            >
                              Pending
                            </SelectItem>
                            <SelectItem
                              value="completed"
                              disabled={booking.status === "cancelled"}
                            >
                              Completed
                            </SelectItem>
                            <SelectItem
                              value="cancelled"
                              className="text-destructive"
                              disabled={booking.status === "completed"}
                            >
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-2">
            <Pagination
              currentPage={page}
              onPageChange={setPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={() => {
          onUpdateStatus();
          setBookingId(null);
          setStatus(null);
        }}
        title="Confirm Action"
        message="Are you sure you want to perform this action?"
        confirmText="Yes, I'm sure"
        cancelText="No, cancel"
      />
    </motion.div>
  );
}
