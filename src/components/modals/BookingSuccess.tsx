import { motion } from "framer-motion";
import {   Camera, MessageSquare } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  userName: string;
}

export function BookingSuccessModal({
  isOpen,
  onClose,
  eventName,
  userName,
}: BookingSuccessModalProps) {
  const navigate = useNavigate()
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
                <Camera className="w-8 h-8 text-green-600" />
              </motion.div>
            </motion.div>
          </div>
          <DialogTitle className="text-center text-2xl font-semibold">
            Booking Confirmed, {userName}
          </DialogTitle>
          <DialogDescription className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <p className="text-muted-foreground">
                You've successfully booked
                for <span className="font-medium text-foreground">{eventName}</span>.
              </p>
              <p className="text-muted-foreground">
                Your photographer is ready to capture your special moments!
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
            <Camera className="w-4 h-4" />
            <span>Stunning photos await!</span>
          </motion.div>
        </div>
        <DialogFooter className="sm:justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="button"
              size="lg"
              className="w-full sm:w-auto"
              onClick={()=> navigate('/messages')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="button"
              size="lg"
              variant="outline"
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