import { motion } from "framer-motion";
import { CalendarCheck, PartyPopper } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventDate: string;
}

export function BookingSuccessModal({
  isOpen,
  onClose,
  eventName,
  eventDate,
}: BookingSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CalendarCheck className="w-8 h-8 text-green-600" />
              </motion.div>
            </motion.div>
          </div>
          <DialogTitle className="text-center text-2xl font-semibold">
            Booking Confirmed!
          </DialogTitle>
          <DialogDescription className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <p className="text-muted-foreground">
                Your booking for{" "}
                <span className="font-medium text-foreground">{eventName}</span>{" "}
                has been successfully confirmed.
              </p>
              <p className="text-muted-foreground">
                Event Date:{" "}
                <span className="font-medium text-foreground">{eventDate}</span>
              </p>
            </motion.div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground"
          >
            <PartyPopper className="w-4 h-4" />
            <span>Get ready for an amazing event!</span>
          </motion.div>
        </div>
        <DialogFooter className="sm:justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="button"
              size="lg"
              className="w-full sm:w-auto"
              onClick={onClose}
            >
              View My Bookings
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
    