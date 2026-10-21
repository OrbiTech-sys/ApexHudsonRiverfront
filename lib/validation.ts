import { z } from "zod";
import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import { todayIso } from "@/lib/format";

const requiredText = (label: string, max = 60) =>
  z
    .string()
    .trim()
    .min(1, `Enter your ${label}.`)
    .max(max, `Keep your ${label} under ${max} characters.`);

const isEmail = (value: string) => z.email().safeParse(value).success;

const isPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return /^[+()\-.\s\d]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
};

export const tourInquirySchema = z.object({
  firstName: requiredText("first name"),
  lastName: requiredText("last name"),
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
  apartmentType: z.enum(["no-preference", "studio", "one-bed", "two-bed"]),
  preferredDate: z
    .string()
    .refine(
      (value) => value === "" || value >= todayIso(),
      "Choose today or a later date.",
    ),
  preferredTime: z.enum(["", "morning", "afternoon", "evening"]),
  message: z.string().trim().max(1000, "Keep your message under 1,000 characters."),
  consent: z
    .boolean()
    .refine((value) => value, "Please confirm that you agree to be contacted."),
});

export type TourInquiryFormValues = z.infer<typeof tourInquirySchema>;

export const tourInquiryDefaults: TourInquiryFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  apartmentType: "no-preference",
  preferredDate: "",
  preferredTime: "",
  message: "",
  consent: false,
};

/**
 * Minimal Zod resolver for React Hook Form (flat field names only).
 * Avoids a dependency on @hookform/resolvers, whose optional peer
 * dependencies conflict with this project's tree.
 */
export function zodResolver<T extends FieldValues>(
  schema: z.ZodType<T>,
): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const name = String(issue.path[0] ?? "");
      if (name && !errors[name]) {
        errors[name] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {}, errors: errors as FieldErrors<T> };
  };
}
