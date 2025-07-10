export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "succeeded",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export type Purpose =  'vendor-booking' | 'refund-amount' | 'wallet-credit' | 'commission-credit';

export interface IWalletEntity {
  _id?: string;
  userId: string;
  userType: "Client" | "Vendor" | "Admin";
  paymentId: string[];
  role: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PopulatedWallet
  extends Omit<IWalletEntity, "userId" | "paymentId"> {
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  paymentId: {
    _id?: string;
    userId: string;
    bookingId?: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentIntentId?: string;
    purpose: Purpose;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
}

export type WalletTransactions = Pick<PopulatedWallet, "userId" | "paymentId">;
export interface User {
  _id: string
  name: string
  email: string
}

export interface Transaction {
  _id: string
  userId: string
  bookingId: string
  transactionId: string
  amount: number
  currency: string
  status: "pending" | "processing" | "succeeded" | "failed" | "refunded" | "partially_refunded"
  paymentIntentId: string
  purpose: string
  createdAt: string
}

export interface Wallet {
  _id: string
  userId: User
  userType: string
  role: string
  balance: number
  paymentId: Transaction[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalTransactions: number
  limit: number
}

export interface WalletResponse {
  success: boolean
  message: string
  data: {
    wallet: Wallet
    pagination: PaginationInfo
  }
}

export interface WalletQueryParams {
  search?: string
  status?: string
  purpose?: string
  dateRange?: string
  page?: number
  limit?: number
}
