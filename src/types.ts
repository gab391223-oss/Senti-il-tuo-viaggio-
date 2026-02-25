export type Mood = 'adventurous' | 'relaxed' | 'cultural' | 'social' | 'solitary' | 'fun';

export interface UserProfile {
  mood: Mood;
  energy: number; // 0 to 100
  interests: string[];
  vibe: string; // e.g., "urban chaos", "natural silence"
  destination?: string;
  duration?: number;
  budget?: string;
}

export interface ItineraryItem {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  type: 'activity' | 'food' | 'rest';
  priceLevel: number; // 1-4
  history?: string;
  hours?: string;
  priceInfo?: string;
  isAlternative?: boolean;
}

export interface DayPlan {
  day: number;
  items: ItineraryItem[];
}

export interface TravelPlan {
  personaName: string;
  summary: string;
  days: DayPlan[];
}
