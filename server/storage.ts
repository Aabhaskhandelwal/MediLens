import { medicines, type Medicine, type InsertMedicine } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  searchMedicines(query: string): Promise<Medicine[]>;
  getMedicineByName(name: string): Promise<Medicine | undefined>;
  getGenericsForIngredients(ingredients: string[]): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
}

export class DatabaseStorage implements IStorage {
  async searchMedicines(query: string): Promise<Medicine[]> {
    if (!query) return await db.select().from(medicines);
    return await db.select().from(medicines).where(sql`${medicines.name} ILIKE ${'%' + query + '%'}`);
  }

  async getMedicineByName(name: string): Promise<Medicine | undefined> {
    const results = await db.select().from(medicines).where(sql`${medicines.name} ILIKE ${name}`);
    return results[0];
  }

  async getGenericsForIngredients(ingredients: string[]): Promise<Medicine[]> {
     // Filter in memory for safety and simplicity in MVP
     const allGenerics = await db.select().from(medicines).where(eq(medicines.type, 'generic'));
     return allGenerics.filter(med => 
       med.ingredients.some(ing => ingredients.includes(ing))
     );
  }

  async createMedicine(medicine: InsertMedicine): Promise<Medicine> {
    const [newMedicine] = await db.insert(medicines).values(medicine).returning();
    return newMedicine;
  }
}

export const storage = new DatabaseStorage();
