export interface Community {
  _id: number;
  name: string;
  members: number;
  featured: boolean;
  created: string;
  description?: string;
  coverImageUrl?: string;
  iconImageUrl?: string;
  memberCount?: number;
  postCount?: number;
  isPrivate?: boolean;
  isFeatured?: boolean;
  rules?: string[];
  createdAt?: string;
  updatedAt?: string;
}
