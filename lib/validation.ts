import { z } from "zod";

export const dayEnum = z.union([z.literal(1), z.literal(2)]);
export const personIdSchema = z.number().int().min(1).max(4);

// Loosely-validated "url" — trip members will paste Google Maps short
// links; we don't want to hard-reject anything link-shaped mid-trip.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional()
    .transform((v) => (v ? v : null));

export const itineraryItemCreateSchema = z.object({
  day: dayEnum,
  time: optionalText(20),
  title: z.string().trim().min(1, "請輸入標題").max(100),
  location: optionalText(100),
  mapUrl: optionalText(500),
  note: optionalText(500),
  personId: personIdSchema,
});

export const itineraryItemUpdateSchema = z.object({
  time: optionalText(20).optional(),
  title: z.string().trim().min(1).max(100).optional(),
  location: optionalText(100).optional(),
  mapUrl: optionalText(500).optional(),
  note: optionalText(500).optional(),
  personId: personIdSchema,
});

export const reorderSchema = z.object({
  day: dayEnum,
  orderedIds: z.array(z.number().int()).min(1),
});

export const expenseCreateSchema = z
  .object({
    day: dayEnum,
    title: z.string().trim().min(1, "請輸入項目名稱").max(100),
    amount: z.number().int().positive("金額需大於 0"),
    paidBy: personIdSchema,
    splitType: z.enum(["equal", "custom"]),
    participantIds: z.array(personIdSchema).min(1, "至少選一位分攤者"),
    customShares: z.record(z.string(), z.number().int().min(0)).optional(),
    personId: personIdSchema,
  })
  .refine(
    (data) => new Set(data.participantIds).size === data.participantIds.length,
    { message: "分攤名單重複", path: ["participantIds"] }
  )
  .refine(
    (data) => {
      if (data.splitType !== "custom") return true;
      if (!data.customShares) return false;
      const sum = data.participantIds.reduce(
        (acc, id) => acc + (data.customShares?.[String(id)] ?? -1),
        0
      );
      return sum === data.amount;
    },
    { message: "自訂金額總和需等於總金額", path: ["customShares"] }
  );

export const expenseUpdateSchema = expenseCreateSchema;

export const foodCategoryEnum = z.enum(["night_market", "restaurant", "souvenir"]);

export const foodItemCreateSchema = z.object({
  category: foodCategoryEnum,
  name: z.string().trim().min(1, "請輸入名稱").max(100),
  note: optionalText(500),
  mapUrl: optionalText(500),
  personId: personIdSchema,
});

export const foodItemUpdateSchema = z.object({
  category: foodCategoryEnum.optional(),
  name: z.string().trim().min(1).max(100).optional(),
  note: optionalText(500).optional(),
  mapUrl: optionalText(500).optional(),
  visited: z.boolean().optional(),
  personId: personIdSchema,
});
