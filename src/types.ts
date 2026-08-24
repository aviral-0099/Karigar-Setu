export type Language = 'en' | 'hi';

export type TradeCategory =
  | 'carpentry'
  | 'electrical'
  | 'plumbing'
  | 'masonry'
  | 'painting'
  | 'handloom'
  | 'pottery'
  | 'metalwork'
  | 'tailoring'
  | 'stonecraft';

export interface Karigar {
  id: string;
  name: string;
  hindiName: string;
  trade: TradeCategory;
  specialization: string;
  hindiSpecialization: string;
  experienceYears: number;
  city: string;
  locality: string;
  dailyRate: number; // in INR
  hourlyRate?: number;
  unitRateLabel?: string; // e.g. "₹45/sq.ft", "₹850/day", "₹120/point"
  rating: number;
  totalReviews: number;
  phone: string;
  whatsapp: string;
  avatarUrl: string;
  portfolioImages: string[];
  isAadhaarVerified: boolean;
  isSkillCertified: boolean;
  certificationBody?: string;
  isAvailableToday: boolean;
  languages: string[];
  bio: string;
  hindiBio: string;
  completedJobsCount: number;
  skills: string[];
  reviews: {
    id: string;
    author: string;
    city: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export interface JobPost {
  id: string;
  title: string;
  trade: TradeCategory;
  description: string;
  city: string;
  locality: string;
  budgetType: 'daily' | 'fixed' | 'per_unit';
  budgetAmount: number;
  unitLabel?: string;
  durationDays?: number;
  startDate: string;
  isUrgent: boolean;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  applicantsCount: number;
  status: 'open' | 'in_progress' | 'completed';
}

export interface BookingRequest {
  id: string;
  karigarId: string;
  karigarName: string;
  karigarTrade: TradeCategory;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  serviceDate: string;
  jobDescription: string;
  estimatedBudget: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}
