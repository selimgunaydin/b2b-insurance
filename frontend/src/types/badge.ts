export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string | null;
  type: string;
  points: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  criteria: any;
  // Frontend specific
  isEarned?: boolean;
  earnedAt?: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  fullName: string;
  email: string;
  points: number;
  badgeCount: number;
  badges: {
    id: string;
    name: string;
    iconUrl: string | null;
  }[];
  policyCount: number;
  customerCount: number;
  membershipType: string;
}
