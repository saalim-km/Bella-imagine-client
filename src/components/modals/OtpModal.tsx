import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface OTPModalProps {
  isOpen: boolean;
  onVerify: (otp: string) => void; 
  onResend: () => void;
  isSending: boolean;
}

export default function OTPModal({ isOpen, onVerify, onResend, isSending }: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (!isOpen) {
      setOtp("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && timer === 0 && !isSending) {
      setTimer(60);
    }
  }, [isSending]);

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
    if (timer === 0) {
      onResend();
      setOtp("");
      setTimer(60);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md p-6 space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Enter OTP</AlertDialogTitle>
          <p className="text-sm text-gray-500">We've sent a 6-digit OTP to your email. Please enter it below.</p>
        </AlertDialogHeader>
        <Input
          type="text"
          placeholder="Enter OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="text-center tracking-widest text-lg font-semibold"
        />
        <AlertDialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleResend} disabled={isSending || timer > 0}>
            {isSending ? "Resending..." : timer > 0 ? `Resend OTP (${timer}s)` : "Resend OTP"}
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}