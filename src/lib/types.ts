export interface Opinion {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  topic: string;
  price: number;
  previousPrice: number;
  priceHistory: number[];
  holders: number;
  debates: number;
  createdAt: string;
  trending: boolean;
}

export interface Debate {
  id: string;
  opinionId: string;
  opinionContent: string;
  topic: string;
  status: "recruiting" | "ongoing" | "voting" | "settled";
  proSide: DebateSide;
  conSide: DebateSide;
  totalPool: number;
  startTime: string;
  endTime?: string;
  messages: DebateMessage[];
}

export interface DebateSide {
  label: string;
  participants: number;
  totalBet: number;
}

export interface DebateMessage {
  id: string;
  author: string;
  avatar: string;
  side: "pro" | "con";
  content: string;
  likes: number;
  timestamp: string;
  isAI?: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  balance: number;
  totalProfit: number;
  rank: number;
  totalUsers: number;
  percentile: number;
  debatesWon: number;
  debatesTotal: number;
  holdings: Holding[];
  badges: string[];
}

export interface Holding {
  opinionId: string;
  opinionContent: string;
  buyPrice: number;
  currentPrice: number;
  quantity: number;
  profit: number;
  profitPercent: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  value: number;
  winRate: number;
  badge?: string;
}
