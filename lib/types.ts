/**
 * /lib/types.ts
 * Core domain types for My College Life.
 */

export interface Expense {
  id: string;
  amount: number;
  category: "Food & Dining" | "Books & Supplies" | "Transport & Gas" | "Entertainment" | "Bills & Utilities" | "Health" | "Other" | string;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD or full ISO)
  paymentMethod?: "Apple Pay" | "Debit Card" | "Credit Card" | "Cash" | "Clipper Card" | string;
  notes?: string;
  createdAt: string;
}

export interface Budget {
  monthlyLimit: number;
  currency: string;
  month: string; // YYYY-MM
  categoryLimits?: Record<string, number>;
  savingsGoal?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  course?: string;
  dueDate?: string; // ISO date string or formatted deadline
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export type PortfolioItemType = "project" | "certification" | "skill" | "education";

export interface ProjectItem {
  id: string;
  type: "project";
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  githubUrl?: string;
  term?: string;
  stars?: number;
}

export interface CertificationItem {
  id: string;
  type: "certification";
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface SkillItem {
  id: string;
  type: "skill";
  name: string;
  category: "Languages" | "Frameworks" | "Developer Tools" | "Design" | "Other" | string;
  proficiency?: "beginner" | "intermediate" | "advanced" | "proficient";
}

export interface EducationItem {
  id: string;
  type: "education";
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
}

export type PortfolioItem = ProjectItem | CertificationItem | SkillItem | EducationItem;

export interface PortfolioProfile {
  name: string;
  tagline: string;
  institution: string;
  classYear: string;
  gpa: string;
  bio: string;
  email?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  statusTag?: string;
  items: PortfolioItem[];
}

export interface ItineraryActivity {
  id?: string;
  time?: string;
  title: string;
  description?: string;
  cost?: number;
  location?: string;
  category?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  date?: string;
  activities: ItineraryActivity[];
}

export interface TripPlan {
  id: string;
  destination: string;
  startingPoint?: string;
  duration: string; // e.g., "3 Days (Weekend)"
  budget: number;
  estimatedCost?: number;
  vibes: string[]; // e.g., ["Food", "Adventure", "Nature"]
  recommendedBase?: string;
  weatherForecast?: string;
  itinerary: ItineraryDay[];
  costBreakdown?: {
    accommodation?: number;
    meals?: number;
    activities?: number;
    transit?: number;
  };
  travelTips?: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  tags?: string[];
  suggestedFollowUps?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  courseTag?: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface CollegeLifeAllData {
  version: number;
  exportedAt: string;
  expenses: Expense[];
  budget: Budget;
  tasks: Task[];
  portfolio: PortfolioProfile;
  trips: TripPlan[];
  chatSessions: ChatSession[];
}
