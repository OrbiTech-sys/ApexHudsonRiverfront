import { z } from "zod";
import { demoCredentials } from "@/data/portal";

const isEmail = (value: string) => z.email().safeParse(value).success;

const isPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return /^[+()\-.\s\d]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
};

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .refine(isEmail, "Enter a valid email address, like name@example.com."),
  password: z.string().min(1, "Enter your password."),
});
export type LoginValues = z.infer<typeof loginSchema>;

export function matchesDemoAccount(values: LoginValues): boolean {
  return (
    values.email.trim().toLowerCase() === demoCredentials.email &&
    values.password === demoCredentials.password
  );
}

export const maintenanceSchema = z.object({
  category: z.enum([
    "plumbing",
    "electrical",
    "heating-cooling",
    "appliances",
    "doors-locks",
    "pests",
    "other",
  ]),
  priority: z.enum(["routine", "urgent"]),
  location: z.enum(["kitchen", "bathroom", "bedroom", "living-area", "entry-other"]),
  description: z
    .string()
    .trim()
    .min(10, "Describe the issue in at least 10 characters.")
    .max(1000, "Keep the description under 1,000 characters."),
  preferredWindow: z.enum(["any", "morning", "afternoon"]),
  permissionToEnter: z.boolean(),
});
export type MaintenanceValues = z.infer<typeof maintenanceSchema>;

export const maintenanceDefaults: MaintenanceValues = {
  category: "plumbing",
  priority: "routine",
  location: "kitchen",
  description: "",
  preferredWindow: "any",
  permissionToEnter: true,
};

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name.").max(60),
  lastName: z.string().trim().min(1, "Enter your last name.").max(60),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .refine(isEmail, "Enter a valid email address, like name@example.com."),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isPhone(value),
      "Enter a valid phone number, including area code.",
    ),
});
export type ProfileValues = z.infer<typeof profileSchema>;

/** Parses user-typed money such as "$1,250.50". Returns NaN if invalid. */
export function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (!/^\d*\.?\d{0,2}$/.test(cleaned) || cleaned === "" || cleaned === ".") {
    return Number.NaN;
  }
  return Number(cleaned);
}

export function makePaymentSchema(balance: number) {
  return z
    .object({
      mode: z.enum(["full", "other"]),
      amount: z.string(),
      method: z.enum(["bank", "card"]),
    })
    .superRefine((values, ctx) => {
      if (values.mode !== "other") return;
      const amount = parseAmount(values.amount);
      if (!Number.isFinite(amount)) {
        ctx.addIssue({
          code: "custom",
          path: ["amount"],
          message: "Enter an amount in dollars and cents, like 250.00.",
        });
      } else if (amount <= 0) {
        ctx.addIssue({ code: "custom", path: ["amount"], message: "Enter an amount greater than zero." });
      } else if (amount > balance) {
        ctx.addIssue({
          code: "custom",
          path: ["amount"],
          message: "The amount can't be more than your current balance.",
        });
      }
    });
}
export type PaymentValues = {
  mode: "full" | "other";
  amount: string;
  method: "bank" | "card";
};
