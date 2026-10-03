import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const enquiries = sqliteTable("enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientToken: text("client_token").notNull().unique(),
  kind: text("kind").notNull(),
  fullName: text("full_name").notNull(),
  organization: text("organization").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  enquiryType: text("enquiry_type"),
  category: text("category"),
  product: text("product"),
  businessType: text("business_type"),
  businessWebsite: text("business_website"),
  message: text("message").notNull(),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  timezone: text("timezone"),
  additionalNotes: text("additional_notes"),
  createdAt: text("created_at").notNull(),
});

