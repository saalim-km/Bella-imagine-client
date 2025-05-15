export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "succeeded",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum Purpose {
  VENDOR_BOOKING = "vendor-booking",
  ROLE_UPGRADE = "role-upgrade",
  TICKET_PURCHASE = "ticket-purchase",
}

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
