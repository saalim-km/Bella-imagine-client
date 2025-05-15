import ClientBookingList, {
  BookingList,
} from "@/components/User/ClinetBookingList";
import { useBookingQuery } from "@/hooks/booking/useBooking";
import { getClientBookings } from "@/services/booking/bookingService";
import { TRole } from "@/types/interfaces/User";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ClientBookingListingProps {
  userType : TRole
}

export function ClientBookingListing({userType} : ClientBookingListingProps) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("Date: Newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const limit = 3;

  const [bookings, setBookings] = useState<BookingList[] | null>(null);

  const { data, isLoading } = useBookingQuery(
    getClientBookings,
    page,
    limit,
    sortBy,
    search,
    statusFilter,
    userType === 'client'
  );

  useEffect(() => {
    if (data) {
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    }
  }, [data]);

  if (isLoading) {
    return null;
  }

  if (!bookings) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <ClientBookingList
        bookings={bookings}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalPages={totalPages}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
    </motion.div>
  );
}
