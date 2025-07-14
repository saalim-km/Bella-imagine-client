import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { communityToast } from "../ui/community-toast";

interface OTPModalProps {
  isOpen: boolean;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isSending: boolean;
}

export default function OTPModal({
  isOpen,
  onVerify,
  onResend,
  isSending,
}: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  useEffect(() => {
    if (!isOpen) {
      setOtp("");
      setIsVerifying(false);
    } else {
      // Start timer when modal opens and not already running
      if (timer === 0) {
        setTimer(60);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Start timer when resend is initiated
    if (isSending && timer === 0) {
      setTimer(60);
    }
  }, [isSending]);

  const handleVerify = async () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      communityToast.error({ description : "OTP must be a 6-digit number"});
      return;
    }
    setIsVerifying(true);
    try {
      await onVerify(otp);
    } finally {
      setIsVerifying(false);
      setOtp("");
    }
  };

  const handleResend = () => {
    if (timer === 0 && !isSending) {
      onResend();
      setOtp("");
      setTimer(60);
      communityToast.success({description : 'OTP resend successfully please check you email'})
    }
  };

  const isOtpComplete = otp.length === 6;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md p-6 space-y-6 rounded-lg">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-lg font-bold text-orange-700 dark:text-orange-500">
            Enter Verification Code
          </AlertDialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We've sent a 6-digit code to your email. Enter it below to verify.
          </p>
        </AlertDialogHeader>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            className="gap-2"
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-12 h-14 text-2xl font-bold border-gray-300 dark:border-gray-600 
                            focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:focus:ring-orange-500
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                            data-[active=true]:border-orange-500 data-[active=true]:ring-1 data-[active=true]:ring-orange-500"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={isSending || timer > 0}
            className="text-orange-700 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700"
          >
            {isSending
              ? "Resending..."
              : timer > 0
              ? `Resend code in ${timer}s`
              : "Resend code"}
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !isOtpComplete}
            className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 text-white"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
