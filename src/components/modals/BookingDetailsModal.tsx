import type React from "react";
import { useState } from "react";
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
import moment from "moment";
import ReviewRatingSystem from "./ReviewRatingModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export interface BookingList {
  serviceDetails: {
    serviceTitle: string;
    serviceDescription: string;
    cancellationPolicies: string[];
    termsAndConditions: string[];
  };
  isClientApproved: boolean;
  isVendorApproved: boolean;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  vendorId: {
    _id: string;
    name: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  bookingDate: string;
  totalPrice: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  __v: number;
  paymentId: string;
}

interface BookingDetailsModalProps {
  booking: BookingList;
  trigger?: React.ReactNode;
}

export function BookingDetailsModal({
  booking,
  trigger,
}: BookingDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const userType = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor;
    if (state.client.client) return state.client.client;
    return null;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="whitespace-nowrap">
            View Booking Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] lg:max-w-[1000px] p-0 overflow-hidden rounded-lg">
        <DialogHeader className="px-8 pt-8 pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Booking Details
              </DialogTitle>
              <DialogDescription className="mt-1">
                Booking ID: {booking._id}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={`${getStatusColor(booking.status)} px-3 py-1 text-sm font-medium`}
              >
                {booking.status === "confirmed" ? (
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                ) : booking.status === "cancelled" ? (
                  <X className="mr-1.5 h-4 w-4" />
                ) : (
                  <AlertCircle className="mr-1.5 h-4 w-4" />
                )}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <Badge
                className={`${getPaymentStatusColor(booking.paymentStatus)} px-3 py-1 text-sm font-medium`}
              >
                <DollarSign className="mr-1.5 h-4 w-4" />
                {booking.paymentStatus.charAt(0).toUpperCase() +
                  booking.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] px-8 pb-8">
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Service Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Info className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Service Information</h3>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-6 space-y-4 border">
                    <div>
                      <h4 className="text-xl font-medium">
                        {booking.serviceDetails.serviceTitle}
                      </h4>
                      <p className="text-muted-foreground mt-2">
                        {booking.serviceDetails.serviceDescription}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-background p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Total Price
                        </p>
                        <p className="font-medium text-xl text-primary mt-1">
                          ₹{booking.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Booking Date
                        </p>
                        <p className="font-medium mt-1">
                          {moment(booking.createdAt).format("LL")}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Date & Time */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Date & Time</h3>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border">
                    <div>
                      <p className="text-sm text-muted-foreground">Service Date</p>
                      <p className="font-medium">
                        {moment(booking.bookingDate).format("dddd, MMMM Do YYYY")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time Slot</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">
                          {format(
                            new Date(`2000-01-01T${booking.timeSlot.startTime}`),
                            "h:mm a"
                          )}{" "}
                          -{" "}
                          {format(
                            new Date(`2000-01-01T${booking.timeSlot.endTime}`),
                            "h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* People */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">People</h3>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border">
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium mt-1">{booking.userId.name}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        User ID: {booking.userId._id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vendor</p>
                      <p className="font-medium mt-1">{booking.vendorId.name}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Vendor ID: {booking.vendorId._id}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Location */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Service Location</h3>
                  </div>
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
                          center={booking.location}
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
                          <Marker
                            position={booking.location}
                          />
                        </GoogleMap>
                      </LoadScript>
                    </div>
                  </div>
                </motion.div>

                {/* Payment */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <IndianRupee className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Payment Details</h3>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-6 space-y-4 border">
                    <div className="grid grid-cols-2 gap-36">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Payment ID
                        </p>
                        <p className="font-medium mt-1">{booking.paymentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="mt-1">
                          <Badge
                            className={`₹{getPaymentStatusColor(
                              booking.paymentStatus
                            )} px-3 py-1 text-sm font-medium`}
                          >
                            {booking.paymentStatus.charAt(0).toUpperCase() +
                              booking.paymentStatus.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center bg-background p-4 rounded-lg">
                      <p className="font-medium">Total Amount</p>
                      <p className="font-bold text-2xl text-primary">
                        ₹{booking.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Policies and Terms */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Policies & Terms</h3>
              </div>
              <div className="bg-muted/20 rounded-xl overflow-hidden border">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="cancellation">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      Cancellation Policies
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                      <ul className="list-disc pl-5 space-y-2">
                        {booking.serviceDetails.cancellationPolicies.map(
                          (policy, index) => (
                            <li
                              key={index}
                              className="text-muted-foreground"
                            >
                              {policy}
                            </li>
                          )
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
                        {booking.serviceDetails.termsAndConditions.map(
                          (term, index) => (
                            <li
                              key={index}
                              className="text-muted-foreground"
                            >
                              {term}
                            </li>
                          )
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </motion.div>

            {/* Review Button */}
            {booking.isClientApproved &&
              booking.isVendorApproved &&
              userType?.role === "client" && (
                <motion.div
                  variants={itemVariants}
                  className="flex justify-end pt-4"
                >
                  <ReviewRatingSystem
                    vendorId={booking.vendorId._id}
                    bookingId={booking._id}
                  />
                </motion.div>
              )}
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}