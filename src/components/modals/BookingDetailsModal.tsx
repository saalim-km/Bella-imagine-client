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
    name: string
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
      case "  ":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">View Booking Details</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Booking Details
            </DialogTitle>
          </div>
          <DialogDescription>Booking ID: {booking._id}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] px-6 pb-6">
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Status Section */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status === "confirmed" ? (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  ) : booking.status === "cancelled" ? (
                    <X className="mr-1 h-3 w-3" />
                  ) : (
                    <AlertCircle className="mr-1 h-3 w-3" />
                  )}
                  {booking.status}
                </Badge>
                <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                  <DollarSign className="mr-1 h-3 w-3" />
                  {booking.paymentStatus}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Created on {moment(booking.createdAt).format("LLL")}
              </div>
            </motion.div>

            {/* Service Details */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Service Information</h3>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="text-xl font-medium">
                  {booking.serviceDetails.serviceTitle}
                </h4>
                <p className="text-muted-foreground">
                  {booking.serviceDetails.serviceDescription}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-medium text-lg text-primary">
                      ${booking.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Date and Time */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Date & Time</h3>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {moment(booking.bookingDate).format("LLL")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {format(
                        new Date(`2000-01-01T${booking.timeSlot.startTime}`),
                        "h:mm a"
                      )}{" "}
                      -
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
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">People</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">
                    {booking.userId.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {booking.userId._id}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">
                    {booking.vendorId.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {booking.vendorId._id}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Payment</h3>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Payment ID</p>
                  <p className="font-medium">{booking.paymentId}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Status</p>
                  <Badge
                    className={getPaymentStatusColor(booking.paymentStatus)}
                  >
                    {booking.paymentStatus}
                  </Badge>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <p className="font-medium">Total Amount</p>
                  <p className="font-bold text-primary">
                    ${booking.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>

            {booking.isClientApproved && booking.isVendorApproved && (
              <motion.div
                variants={itemVariants}
                className="space-y-3 flex justify-end"
              >
                <ReviewRatingSystem vendorId={booking.vendorId._id} bookingId={booking._id} />
              </motion.div>
            )}

            {/* Policies and Terms */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Policies & Terms</h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cancellation">
                  <AccordionTrigger>Cancellation Policies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {booking.serviceDetails.cancellationPolicies.map(
                        (policy, index) => (
                          <li key={index} className="text-muted-foreground">
                            {policy}
                          </li>
                        )
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="terms">
                  <AccordionTrigger>Terms & Conditions</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {booking.serviceDetails.termsAndConditions.map(
                        (term, index) => (
                          <li key={index} className="text-muted-foreground">
                            {term}
                          </li>
                        )
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
