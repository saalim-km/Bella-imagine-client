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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BookingList } from "./ClinetBookingList";
import moment from "moment";
import { formatPrice } from "@/utils/format/format-price.utils";
import { BookingDetailsModal } from "../modals/BookingDetailsModal";
import { Button } from "../ui/button";
import Pagination from "../common/Pagination";
import { useBookingStatusMutation } from "@/hooks/booking/useBooking";
import { vendorUpdateBookingStatus } from "@/services/booking/bookingService";
import { ConfirmationModal } from "../modals/ConfimationModal";
import { useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface VendorBookingListProps {
  bookings: BookingList[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

export default function VendorBookingList({
  bookings,
  searchQuery,
  setSearchQuery,
  page,
  setPage,
  totalPages,
}: VendorBookingListProps) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

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

  const { mutate: updateBookingStatus } = useBookingStatusMutation(
    vendorUpdateBookingStatus
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

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Requests</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell className="font-medium">
                  {booking.serviceDetails.serviceTitle}
                </TableCell>
                <TableCell>
                  {booking.userId.name}
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
                    value={
                      booking.status
                    }
                    onValueChange={(value) => {
                      setBookingId(booking._id);
                      setStatus(value);
                      setIsConfirmationModalOpen(true);
                    }}
                    disabled={
                      (booking.isVendorApproved &&
                        booking.status === "completed") ||
                      booking.status === "cancelled"
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">pending</SelectItem>
                      <SelectItem value="confirmed">confirmed</SelectItem>
                      <SelectItem value="completed">completed</SelectItem>
                      <SelectItem
                        value="cancelled"
                        className="text-destructive"
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
                    disabled={booking.isVendorApproved || booking.status === 'cancelled'}
                  >
                    Mark as Complete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {bookings.map((booking) => (
          <Card key={booking._id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {booking.serviceDetails.serviceTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span>
                  {booking.userId.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{moment(booking.bookingDate).format("LLL")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span>{formatPrice(booking.totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2">
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>
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
  );
}