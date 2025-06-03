import type React from "react";
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
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Pagination from "../common/Pagination";
import moment from "moment";
import { formatPrice } from "@/utils/formatters/format-price.utils";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ConfirmationModal } from "../modals/ConfimationModal";
import { useState } from "react";
import { useBookingStatusMutation } from "@/hooks/booking/useBooking";
import { clientUpdateBookingStatus } from "@/services/booking/bookingService";
import { toast } from "sonner";
import { BookingDetailsModal } from "../modals/BookingDetailsModal";

export interface BookingList {
  serviceDetails: {
    serviceTitle: string;
    serviceDescription: string;
    additionalHoursPrice: number;
    cancellationPolicies: string[];
    termsAndConditions: string[];
  };
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  _id: string;
  userId: {
    _id: string;
    name: string
  };
  vendorId: {
    _id: string;
    name: string
  };
  isClientApproved: boolean;
  isVendorApproved: boolean;
  location : {
    lat : number;
    lng : number;
    travelFee : number;
  }
  bookingDate: string;
  totalPrice: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  __v: number;
  paymentId: string;
}

interface ClientBookingListProps {
  bookings: BookingList[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function ClientBookingList({
  bookings,
  page,
  setPage,
  totalPages,
  sortBy,
  setSortBy,
  search,
  setSearch,
}: ClientBookingListProps) {
  console.log('got the bookings', bookings);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSort = (field: string) => {
    setSortBy(
      sortBy === field ? `-${field}` : sortBy === `-${field}` ? "" : field
    );
  };

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
      onClick={() => handleSort(field)}
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
          <span className="text-muted-foreground">Client:</span>
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
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="hidden md:block rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadSortable field="serviceRequired">
                Service
              </TableHeadSortable>
              <TableHeadSortable field="clientName">
                Vendor Name
              </TableHeadSortable>
              <TableHeadSortable field="date">Date</TableHeadSortable>
              <TableHeadSortable field="price">Price</TableHeadSortable>
              <TableHeadSortable field="status">Status</TableHeadSortable>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id} className="hover:bg-accent">
                <TableCell className="font-medium">
                  {booking.serviceDetails.serviceTitle}
                </TableCell>
                <TableCell>
                  {booking.vendorId.name}
                </TableCell>
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
                  <BookingDetailsModal
                    booking={booking}
                    trigger={<Button size={"sm"}>View Booking Details</Button>}
                  />
                </TableCell>
                <TableCell>
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
                      <SelectItem value="pending" disabled = {booking.status !== 'pending'}>pending</SelectItem>
                      <SelectItem value="completed" disabled = {booking.status === 'cancelled'}>completed</SelectItem>
                      <SelectItem
                        value="cancelled"
                        className="text-destructive"
                        disabled = {booking.status === 'completed'}
                      >
                        cancelled
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <Button
                    size={"sm"}
                    onClick={() => {
                      setBookingId(booking._id);
                      setStatus("completed");
                      setIsConfirmationModalOpen(true);
                    }}
                    disabled={booking.isClientApproved || booking.status === 'cancelled'}
                  >
                    Mark as Complete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </div>
  );
}
