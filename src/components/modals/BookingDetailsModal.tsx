import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Info,
  User,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  Loader2,
  IndianRupee,
} from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/store/store";
import ReviewRatingSystem from "./ReviewRatingModal";
import { BookingList } from "@/pages/User/ClientBookingListing";
import { PaymentStatus } from "@/types/interfaces/Payment";



interface BookingDetailsModalProps {
  booking: BookingList;
  trigger?: React.ReactNode;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// Utility function for status colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Sub-component: Section Header
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
  </div>
);

// Sub-component: Service Information
const ServiceInfo: React.FC<{
  serviceDetails: BookingList["serviceDetails"];
  totalPrice: number;
  createdAt?: string;
}> = ({ serviceDetails, totalPrice, createdAt }) => (
  <motion.div variants={itemVariants} className="space-y-4">
    <SectionHeader icon={<Info className="h-5 w-5" />} title="Service Information" />
    <div className="bg-muted/20 rounded-xl p-6 space-y-4 border">
      <div>
        <h4 className="text-xl font-medium">{serviceDetails.serviceTitle}</h4>
        <p className="text-muted-foreground mt-2">{serviceDetails.serviceDescription}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="bg-background p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Price</p>
          <p className="font-medium text-xl text-primary mt-1">₹{totalPrice.toFixed(2)}</p>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Booking Date</p>
          <p className="font-medium mt-1">
            {createdAt ? moment(createdAt).format("LL") : "N/A"}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Sub-component: Date & Time
const DateTimeInfo: React.FC<{
  bookingDate: string;
  timeSlot: BookingList["timeSlot"];
}> = ({ bookingDate, timeSlot }) => (
  <motion.div variants={itemVariants} className="space-y-4">
    <SectionHeader icon={<Calendar className="h-5 w-5" />} title="Date & Time" />
    <div className="bg-muted/20 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border">
      <div>
        <p className="text-sm text-muted-foreground">Service Date</p>
        <p className="font-medium">{moment(bookingDate).format("dddd, MMMM Do YYYY")}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Time Slot</p>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <p className="font-medium">
            {format(new Date(`2000-01-01T${timeSlot.startTime}`), "h:mm a")} -{" "}
            {format(new Date(`2000-01-01T${timeSlot.endTime}`), "h:mm a")}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Sub-component: People
const PeopleInfo: React.FC<{
  userId: BookingList["userId"];
  vendorId: BookingList["vendorId"];
}> = ({ userId, vendorId }) => (
  <motion.div variants={itemVariants} className="space-y-4">
    <SectionHeader icon={<User className="h-5 w-5" />} title="People" />
    <div className="bg-muted/20 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border">
      <div>
        <p className="text-sm text-muted-foreground">Client</p>
        <p className="font-medium mt-1">{userId.name}</p>
        <p className="text-xs text-muted-foreground mt-2">User ID: {userId._id}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Vendor</p>
        <p className="font-medium mt-1">{vendorId.name}</p>
        <p className="text-xs text-muted-foreground mt-2">Vendor ID: {vendorId._id}</p>
      </div>
    </div>
  </motion.div>
);

// Sub-component: Location
const LocationInfo: React.FC<{
  location: BookingList["serviceDetails"]["location"];
  customLocation?: string;
}> = ({ location, customLocation }) => (
  <motion.div variants={itemVariants} className="space-y-4">
    <SectionHeader icon={<MapPin className="h-5 w-5" />} title="Service Location" />
    <div className="bg-muted/20 rounded-xl overflow-hidden border">
      <div className="h-[300px] w-full">
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
          loadingElement={
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <GoogleMap
            center={{ lat: location.lat, lng: location.lng }}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              zoomControl: true,
              clickableIcons: false,
            }}
          >
            <Marker position={{ lat: location.lat, lng: location.lng }} />
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Address</p>
        <p className="font-medium">{location.address}</p>
      </div>
      {customLocation && (
        <div className="p-4">
          <p className="text-sm text-muted-foreground">Custom Location</p>
          <p className="font-medium">{customLocation}</p>
        </div>
      )}
    </div>
  </motion.div>
);

// Sub-component: Payment Details
const PaymentInfo: React.FC<{
  paymentId: string | null;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  travelFee?: number;
  distance?: number;
}> = ({ paymentId, paymentStatus, totalPrice, travelFee, distance }) => (
  <motion.div variants={itemVariants} className="space-y-4">
    <SectionHeader icon={<IndianRupee className="h-5 w-5" />} title="Payment Details" />
    <div className="bg-muted/20 rounded-xl p-6 space-y-4 border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Payment ID</p>
          <p className="font-medium mt-1">{paymentId || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge className={`${getStatusColor(paymentStatus)} px-3 py-1 text-sm font-medium`}>
            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Distance</p>
          <p className="font-medium mt-1">{distance ? `${distance.toFixed(2)} km` : "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Travel Fee</p>
          <p className="font-medium mt-1">{travelFee ? `₹${travelFee.toFixed(2)}` : "N/A"}</p>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between items-center bg-background p-4 rounded-lg">
        <p className="font-medium">Total Amount</p>
        <p className="font-bold text-2xl text-primary">₹{totalPrice.toFixed(2)}</p>
      </div>
    </div>
  </motion.div>
);

// Sub-component: Policies & Terms
const PoliciesTerms: React.FC<{
  serviceDetails: BookingList["serviceDetails"];
}> = ({ serviceDetails }) => (
  <motion.div variants={itemVariants} className="space-y-4">
    <SectionHeader icon={<FileText className="h-5 w-5" />} title="Policies & Terms" />
    <div className="bg-muted/20 rounded-xl overflow-hidden border">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="cancellation">
          <AccordionTrigger className="px-6 hover:no-underline">
            Cancellation Policies
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <ul className="list-disc pl-5 space-y-2">
              {serviceDetails.cancellationPolicies.length > 0 ? (
                serviceDetails.cancellationPolicies.map((policy, index) => (
                  <li key={index} className="text-muted-foreground">{policy}</li>
                ))
              ) : (
                <li className="text-muted-foreground">No cancellation policies provided.</li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="terms">
          <AccordionTrigger className="px-6 hover:no-underline">
            Terms & Conditions
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <ul className="list-disc pl-5 space-y-2">
              {serviceDetails.termsAndConditions.length > 0 ? (
                serviceDetails.termsAndConditions.map((term, index) => (
                  <li key={index} className="text-muted-foreground">{term}</li>
                ))
              ) : (
                <li className="text-muted-foreground">No terms and conditions provided.</li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </motion.div>
);

// Main Component
export function BookingDetailsModal({ booking, trigger }: BookingDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const userType = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor;
    if (state.client.client) return state.client.client;
    return null;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="whitespace-nowrap">
            View Booking Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] lg:max-w-[1400px] p-0 overflow-hidden rounded-lg">
        <DialogHeader className="px-8 pt-8 pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Booking Details
              </DialogTitle>
              <DialogDescription className="mt-1">Booking ID: {booking._id}</DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={`${getStatusColor(booking.status)} px-3 py-1 text-sm font-medium`}
              >
                {booking.status === "completed" ? (
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                ) : booking.status === "cancelled" ? (
                  <X className="mr-1.5 h-4 w-4" />
                ) : (
                  <AlertCircle className="mr-1.5 h-4 w-4" />
                )}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <Badge
                className={`${getStatusColor(booking.paymentStatus)} px-3 py-1 text-sm font-medium`}
              >
                <IndianRupee className="mr-1.5 h-4 w-4" />
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-8 pb-8">
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <ServiceInfo
                  serviceDetails={booking.serviceDetails}
                  totalPrice={booking.totalPrice}
                  createdAt={booking.createdAt}
                />
                <DateTimeInfo bookingDate={booking.bookingDate} timeSlot={booking.timeSlot} />
                <PeopleInfo userId={booking.userId} vendorId={booking.vendorId} />
              </div>
              <div className="space-y-8">
                <LocationInfo
                  location={booking.serviceDetails.location}
                  customLocation={booking.customLocation}
                />
                <PaymentInfo
                  paymentId={booking.paymentId}
                  paymentStatus={booking.paymentStatus}
                  totalPrice={booking.totalPrice}
                  travelFee={booking.travelFee}
                  distance={booking.distance}
                />
              </div>
            </div>
            <PoliciesTerms serviceDetails={booking.serviceDetails} />
            {booking.isClientApproved && booking.isVendorApproved && userType?.role === "client" && (
              <motion.div variants={itemVariants} className="flex justify-end pt-4">
                <ReviewRatingSystem vendorId={booking.vendorId._id} bookingId={booking._id} />
              </motion.div>
            )}
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}