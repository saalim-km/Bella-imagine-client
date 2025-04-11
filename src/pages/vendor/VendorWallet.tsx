import { Spinner } from "@/components/ui/spinner";
import WalletComponent from "@/components/common/WalletComponent";
import { useVendorWallet } from "@/hooks/wallet/useWallet";
import { PopulatedWallet, WalletTransactions } from "@/types/Wallet";
import { useEffect, useState } from "react";

// Example usage of the wallet component
export default function VendorWallet() {
  const { data, isLoading } = useVendorWallet();

  const [walletData, setWalletData] = useState<Omit<
    PopulatedWallet,
    "paymentId"
  > | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactions | null>(
    null
  );

  useEffect(() => {
    if (data) {
      setWalletData(data.walletData);

      setTransactions({
        userId: data.walletData.userId,
        paymentId: data.walletData.paymentId,
      });
    }
  }, [data]);

  // Handler functions
  const handleRefresh = () => {
    console.log("Refreshing wallet data...");
    // Implement your refresh logic here
  };

  const handleDeposit = () => {
    console.log("Opening deposit modal...");
    // Implement your deposit logic here
  };

  const handleWithdraw = () => {
    console.log("Opening withdraw modal...");
    // Implement your withdraw logic here
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!walletData || !transactions) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <WalletComponent
        walletData={walletData}
        transactions={transactions}
        userRole="client" 
        onRefresh={handleRefresh}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
}
