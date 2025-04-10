import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaymentStatus, Purpose } from "@/types/Wallet";
import moment from "moment";
import { PopulatedPayments } from "@/types/Payment";

// Helper function to format currency
const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

// Status badge component
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

// Purpose badge component
const PurposeBadge = ({ purpose }: { purpose: Purpose }) => {
  const purposeVariants = {
    [Purpose.ROLE_UPGRADE]: "bg-success/20 text-success",
    [Purpose.TICKET_PURCHASE]: "bg-warning/20 text-warning",
    [Purpose.VENDOR_BOOKING]: "bg-primary/20 text-primary",
  };

  return (
    <Badge variant="outline" className={purposeVariants[purpose]}>
      {purpose}
    </Badge>
  );
};

// Transaction icon component
const TransactionIcon = ({ purpose }: { purpose: Purpose }) => {
  if (
    purpose === Purpose.ROLE_UPGRADE ||
    purpose === Purpose.TICKET_PURCHASE ||
    purpose === Purpose.VENDOR_BOOKING
  ) {
    return <ArrowDownIcon className="h-4 w-4 text-success" />;
  }
  return <ArrowUpIcon className="h-4 w-4 text-destructive" />;
};

interface AdminTransactionsComponentProps {
  transactions: PopulatedPayments[];
  userRole: "client" | "vendor" | "admin";
  onRefresh?: () => void;
}

export default function AdminTransactionsComponent({
  transactions,
  userRole,
}: AdminTransactionsComponentProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  // const [searchTerm, setSearchTerm] = useState<string>("");

  // // Filter transactions based on active tab and search term
  // const filteredTransactions = transactions.flatMap((wallet) =>
  //   wallet.paymentId
  //     .filter((payment) => {
  //       const matchesTab =
  //         activeTab === "all" ||
  //         payment.purpose.toLowerCase() === activeTab.toLowerCase();

  //       const matchesSearch =
  //         searchTerm === "" ||
  //         payment.transactionId
  //           .toLowerCase()
  //           .includes(searchTerm.toLowerCase()) ||
  //         wallet.userId.firstName
  //           .toLowerCase()
  //           .includes(searchTerm.toLowerCase()) ||
  //         wallet.userId.lastName
  //           .toLowerCase()
  //           .includes(searchTerm.toLowerCase()) ||
  //         wallet.userId.email.toLowerCase().includes(searchTerm.toLowerCase());

  //       return matchesTab && matchesSearch;
  //     })
  //     .map((payment) => ({
  //       ...wallet,
  //       paymentId: payment,
  //     }))
  // );

  return (
    <div className="flex flex-col gap-6">
      {/* Transactions Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Transaction History</CardTitle>
            {/* <div className="flex items-center gap-2">
              <div className="relative w-full md:w-auto">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-[250px]"
                />
              </div>
              <Button variant="outline" size="icon" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab("all")}>
                    All Transactions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("deposit")}>
                    Deposits
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("withdrawal")}>
                    Withdrawals
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("payment")}>
                    Payments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("refund")}>
                    Refunds
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            {/* <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposit">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
              <TabsTrigger value="refund">Refunds</TabsTrigger>
            </TabsList> */}

            <TabsContent value={activeTab} className="mt-0">
              <ScrollArea className="h-[400px] md:h-[500px] w-full rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      {userRole === "admin" && <TableHead>User</TableHead>}
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={userRole === "admin" ? 7 : 6}
                          className="text-center py-10"
                        >
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={`${transaction._id}-${transaction._id}`}>
                          {userRole === "admin" && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={`https://ui-avatars.com/api/?name=${transaction.userId.firstName}+${transaction.userId.lastName}`}
                                  />
                                  <AvatarFallback>
                                    {transaction.userId?.firstName[0] || ""}
                                    {transaction.userId?.lastName[0] || ""}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {transaction.userId.firstName[0] || ""}{" "}
                                    {transaction.userId.lastName[0] || ""}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {transaction.userId.email}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                          )}
                          <TableCell className="font-medium">
                            {transaction.transactionId}
                          </TableCell>
                          <TableCell>
                            {moment(transaction.createdAt).format("LLL")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TransactionIcon
                                purpose={transaction.purpose as Purpose}
                              />
                              <PurposeBadge
                                purpose={transaction.purpose as Purpose}
                              />
                            </div>
                          </TableCell>
                          <TableCell
                            className={`${
                              transaction.status === PaymentStatus.COMPLETED
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {transaction.status === PaymentStatus.REFUNDED
                              ? "-"
                              : "+"}
                            {formatCurrency(
                              transaction.amount,
                              transaction.currency
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              status={transaction.status as PaymentStatus}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Download Receipt
                                </DropdownMenuItem>
                                {userRole === "admin" &&
                                  transaction.status ===
                                    PaymentStatus.PENDING && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-success">
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                              </DropdownMenuContent>
                            </DropdownMenu>
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
