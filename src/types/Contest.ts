export type TContest = "weekly" | "monthly" | "yearly";

export type TContestStatus = "active" | "upcoming" | "ended";

export interface IContest {
  _id?: string;
  title: string;
  description: string;
  contestType: TContest;
  status?: TContestStatus;
  categoryId: string;
  startDate: Date;
  endDate: Date;
  vendorParticipants?: string[];
  clientParticipants?: string[];
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
