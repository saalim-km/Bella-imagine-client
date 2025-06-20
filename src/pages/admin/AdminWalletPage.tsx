import WalletComponent from "@/components/common/WalletComponent";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Spinner } from "@/components/ui/spinner";
import { useAdminWallet } from "@/hooks/wallet/useWallet";

const AdminWalletPage = () => {
  const { data, isLoading , isError} = useAdminWallet();

  console.log('wallet data got :',data);

  if (isLoading) {
    return <Spinner />;
  }

  if(isError || !data) {
    return <p>an error occure please try again later</p>
  }

  return (
    <AdminLayout>
      <WalletComponent 
        transactions={data?.data}     
        userRole="admin"
        walletData={data.data}
        key={data.data._id}   
      />
    </AdminLayout>
  );
};

export default AdminWalletPage;
