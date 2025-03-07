import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isSending?: boolean;
}

export default function OTPModal({ isOpen, onClose, onVerify, onResend, isSending }: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    setIsVerifying(true);
    onVerify(otp);
    setIsVerifying(false);
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
          onChange={(e) => setOtp(e.target.value)}
          className="text-center tracking-widest text-lg font-semibold"
        />
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onResend} disabled={isSending}>
            {isSending ? "Resending..." : "Resend OTP"}
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}