import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoreHorizontal,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  PaymentStatus,
  PopulatedWallet,
  Purpose,
  WalletTransactions,
} from "@/types/interfaces/Wallet";
import moment from "moment";
import { formatPrice } from "@/utils/formatters/format-price.utils";

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const statusVariants = {
    [PaymentStatus.COMPLETED]: "bg-success text-success-foreground",
    [PaymentStatus.PENDING]: "bg-warning text-warning-foreground",
    [PaymentStatus.FAILED]: "bg-destructive text-destructive-foreground",
    [PaymentStatus.REFUNDED]: "bg-info text-info-foreground",
  };

  return (
    <Badge variant="outline" className={statusVariants[status]}>
      {status}
    </Badge>
  );
};



interface WalletComponentProps {
  walletData: Omit<PopulatedWallet, "paymentId">;
  transactions: PopulatedWallet;
  userRole: "client" | "vendor" | "admin";
}

export default function WalletComponent({
  walletData,
  transactions,
  userRole,
}: WalletComponentProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <div className="flex flex-col gap-6">
      {/* Wallet Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">My Wallet</CardTitle>
              <CardDescription>
                Manage your funds and transactions
              </CardDescription>
            </div>
            <Wallet className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">
                {formatPrice(walletData.balance)}
                {/* {walletData.balance} */}
              </div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Deposits
              </span>
              <span className="font-medium">
                {formatPrice(
                  transactions?.paymentId
                    ? transactions?.paymentId?.reduce(
                        (sum, wallet) => sum + wallet.amount,
                        0
                      )
                    : 0
                )}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Withdrawals
              </span>
              <span className="font-medium">
                {formatPrice(
                  transactions.paymentId?.reduce(
                    (sum, wallet) => sum + wallet.amount,
                    0
                  )
                )}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Pending Transactions
              </span>
              <span className="font-medium">
                {
                  transactions.paymentId?.filter(
                    (p) => p.status === PaymentStatus.PENDING
                  ).length
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Transaction History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsContent value={activeTab} className="mt-0">
              <ScrollArea className="w-full rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      {userRole === "admin" && <TableHead>User</TableHead>}
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.paymentId?.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={userRole === "admin" ? 7 : 6}
                          className="text-center py-10"
                        >
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.paymentId?.map((transaction) => (
                        <TableRow key={`${transaction._id}-${transaction._id}`}>
                          <TableCell className="font-medium">
                            {transaction.transactionId}
                          </TableCell>
                          <TableCell>
                            {moment(transaction.createdAt).format("LLL")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {transaction.purpose === "vendor-booking" ? (
                                <ArrowDownIcon className="h-4 w-4 text-destructive" />
                              ) : (
                                <ArrowUpIcon className="h-4 w-4 text-success" />
                              )}
                              <span className="text-sm">
                                {transaction.purpose}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell
                            className={`${
                              transaction.purpose === 'refund-amount'
                                ? "text-green-500"
                                : transaction.purpose === 'wallet-credit' ? "text-green-500" : transaction.purpose === 'commission-credit' ? "text-green-500" : "text-destructive"
                            }`}
                          >
                            {formatPrice(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={transaction.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}