import type { Row } from "@libsql/client";
import type {
  Day,
  Expense,
  ExpenseParticipant,
  FoodCategory,
  FoodItem,
  ItineraryItem,
  Person,
  SettlementPayment,
} from "@/types";

export function mapPerson(row: Row): Person {
  return {
    id: Number(row.id),
    name: String(row.name),
    color: String(row.color),
  };
}

export function mapItineraryItem(row: Row): ItineraryItem {
  return {
    id: Number(row.id),
    day: Number(row.day) as Day,
    sortOrder: Number(row.sort_order),
    time: (row.time as string) ?? null,
    title: String(row.title),
    location: (row.location as string) ?? null,
    mapUrl: (row.map_url as string) ?? null,
    note: (row.note as string) ?? null,
    createdBy: Number(row.created_by),
    updatedBy: row.updated_by == null ? null : Number(row.updated_by),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function mapExpense(
  row: Row,
  participants: ExpenseParticipant[]
): Expense {
  return {
    id: Number(row.id),
    day: Number(row.day) as Day,
    title: String(row.title),
    amount: Number(row.amount),
    paidBy: Number(row.paid_by),
    splitType: String(row.split_type) as Expense["splitType"],
    createdBy: Number(row.created_by),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    participants,
  };
}

export function mapExpenseParticipant(row: Row): ExpenseParticipant {
  return {
    personId: Number(row.person_id),
    shareAmount: Number(row.share_amount),
  };
}

export function mapSettlementPayment(row: Row): SettlementPayment {
  return {
    id: Number(row.id),
    fromPersonId: Number(row.from_person_id),
    toPersonId: Number(row.to_person_id),
    amount: Number(row.amount),
    createdBy: Number(row.created_by),
    createdAt: String(row.created_at),
  };
}

export function mapFoodItem(row: Row): FoodItem {
  return {
    id: Number(row.id),
    category: String(row.category) as FoodCategory,
    name: String(row.name),
    note: (row.note as string) ?? null,
    mapUrl: (row.map_url as string) ?? null,
    visited: Number(row.visited) === 1,
    createdBy: Number(row.created_by),
    updatedBy: row.updated_by == null ? null : Number(row.updated_by),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}
