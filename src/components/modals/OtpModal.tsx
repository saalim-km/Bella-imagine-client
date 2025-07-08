import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface OTPModalProps {
  isOpen: boolean;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isSending: boolean;
}

export default function OTPModal({ isOpen, onVerify, onResend, isSending }: OTPModalProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      setOtp(new Array(6).fill(""));
      setIsVerifying(false);
    } else {
      // Start timer when modal opens and not already running
      if (timer === 0) {
        setTimer(60);
      }
      // Focus first input when modal opens
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [timer,isOpen]);

  useEffect(() => {
    // Start timer when resend is initiated
    if (isSending && timer === 0) {
      setTimer(60);
    }
  }, [timer,isSending]);

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      // toast.error("OTP must be a 6-digit number");
      alert("OTP must be a 6-digit number");
      return;
    }
    setIsVerifying(true);
    try {
      await onVerify(otpString);
    } finally {
      setIsVerifying(false);
      setOtp(new Array(6).fill(""));
    }
  };

  const handleResend = () => {
    if (timer === 0 && !isSending) {
      onResend();
      setOtp(new Array(6).fill(""));
      setTimer(60);
      // Focus first input after resend
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    
    // Auto focus next input if digit entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // If current field is empty, move to previous field
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current field
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    
    if (pasteData.length > 0) {
      const newOtp = new Array(6).fill("");
      for (let i = 0; i < pasteData.length && i < 6; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      
      // Focus the next empty field or the last field
      const nextIndex = Math.min(pasteData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== "") && otp.length === 6;

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

        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="otp-input w-12 h-14 text-center text-2xl font-bold border-gray-300 dark:border-gray-600 
                        focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:focus:ring-orange-500
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          ))}
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={isSending || timer > 0}
            className="text-orange-700 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700"
          >
            {isSending ? (
              "Resending..."
            ) : timer > 0 ? (
              `Resend code in ${timer}s`
            ) : (
              "Resend code"
            )}
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