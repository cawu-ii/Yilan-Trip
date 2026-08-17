export type Day = 1 | 2;

export interface Person {
  id: number;
  name: string;
  color: string;
}

export interface ItineraryItem {
  id: number;
  day: Day;
  sortOrder: number;
  time: string | null;
  title: string;
  location: string | null;
  mapUrl: string | null;
  note: string | null;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseParticipant {
  personId: number;
  shareAmount: number;
}

export type SplitType = "equal" | "custom";

export interface Expense {
  id: number;
  day: Day;
  title: string;
  amount: number;
  paidBy: number;
  splitType: SplitType;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  participants: ExpenseParticipant[];
}

export interface SettlementPayment {
  id: number;
  fromPersonId: number;
  toPersonId: number;
  amount: number;
  createdBy: number;
  createdAt: string;
}

export interface PersonBalance {
  personId: number;
  name: string;
  color: string;
  paid: number;
  owed: number;
  net: number;
}

export interface ExpenseSummary {
  totalTrip: number;
  perDay: { day: Day; total: number }[];
  balances: PersonBalance[];
}

export type FoodCategory = "night_market" | "restaurant" | "souvenir";

export interface FoodItem {
  id: number;
  category: FoodCategory;
  name: string;
  note: string | null;
  mapUrl: string | null;
  visited: boolean;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export const FOOD_CATEGORY_LABEL: Record<FoodCategory, string> = {
  night_market: "羅東夜市",
  restaurant: "餐廳",
  souvenir: "伴手禮",
};
