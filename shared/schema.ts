import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["branded", "generic"] }).notNull(),
  price: integer("price").notNull(), // in cents
  ingredients: text("ingredients").array().notNull(), // array of active ingredients
  manufacturer: text("manufacturer").notNull(),
  description: text("description"),
});

export const insertMedicineSchema = createInsertSchema(medicines).omit({ id: true });

export type Medicine = typeof medicines.$inferSelect;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;

export const analysisRequestSchema = z.object({
  prescriptions: z.array(z.string()),
  allergies: z.array(z.string()),
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;

// Define response types manually since they are computed
export interface AnalysisResult {
  original: string;
  found: boolean;
  ingredients: string[];
  generics: Medicine[];
  savings: number;
  warnings: string[];
}

export interface FullAnalysisResponse {
  results: AnalysisResult[];
  disclaimer: string;
}
