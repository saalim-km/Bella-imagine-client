import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import AdminTransactionsComponent from '@/components/admin/payment/AdminTransactionComp'
import { Spinner } from '@/components/ui/spinner';
import { useAdminTransactionsQuery } from '@/hooks/service/useTranactions';
import { PopulatedPayments } from '@/types/Payment';
import { useEffect, useState } from 'react';
import AdminWallet from './AdminWalltetPage';

const AdminTransactionsPage = () => {
    const { data, isLoading } = useAdminTransactionsQuery();
    const [transactions, setTransactions] = useState<PopulatedPayments[] | null>(
      null
    );
  
    useEffect(() => {
      if (data) {
        setTransactions(data.payments);
      }
    }, [data]);
  
    if (isLoading) {
      return <Spinner />;
    }
  
    if (!transactions) {
      return null;
    }
  
  return (
    <AdminLayout>
        <div>
          <AdminWallet/>
          {/* <AdminTransactionsComponent transactions={transactions} userRole='admin'/> */}
        </div>
    </AdminLayout>
  )
}

export default AdminTransactionsPage