import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void; // Not used as we remove close
  onVerify: (otp: string) => void; 
  onResend: () => void;
  isSending: boolean;
}

export default function OTPModal({ isOpen, onClose, onVerify, onResend, isSending }: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error("OTP must be a 6-digit number");
      return;
    }
    setIsVerifying(true);
    onVerify(otp);
    setIsVerifying(false);
    setOtp("");
  };

  const handleResend = () => {
    onResend();
    setOtp("");
    setTimer(60); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 space-y-4">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
          <p className="text-sm text-gray-500">We've sent a 6-digit OTP to your email. Please enter it below.</p>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Enter OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="text-center tracking-widest text-lg font-semibold"
        />
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleResend} disabled={isSending || timer > 0}>
            {isSending ? "Resending..." : timer > 0 ? `Resend OTP (${timer}s)` : "Resend OTP"}
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}