import WalletComponent from "@/components/common/WalletComponent";
import { Spinner } from "@/components/ui/spinner";
import { useClientWallet } from "@/hooks/wallet/useWallet";
import { PopulatedWallet } from "@/types/interfaces/Wallet";
import { useEffect, useState } from "react";


export default function ClientWallet() {
  const { data, isLoading } = useClientWallet();

  const [walletData, setWalletData] = useState<Omit<
    PopulatedWallet,
    "paymentId"
  > | null>(null);
  const [transactions, setTransactions] = useState<PopulatedWallet | null>(
    null
  );

  useEffect(() => {
    if (data) {
      setWalletData(data.data);

      setTransactions(data.data);
    }
  }, [data]);

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
      />
    </div>
  );
}
