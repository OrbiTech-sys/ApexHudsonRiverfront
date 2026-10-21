import type { SavedTourRequest } from "@/types/portal";
import type { GeneratedFile } from "@/lib/demo/download";
import { formattedAddress, site } from "@/data/site";
import { addDays, fromIso, toIso } from "@/lib/portal/dates";

const startTimes = {
  morning: { hour: 10, minute: 0 },
  afternoon: { hour: 14, minute: 0 },
  evening: { hour: 17, minute: 30 },
} as const;

const pad = (value: number) => String(value).padStart(2, "0");

/** Escapes text values per RFC 5545. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function stamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Builds a calendar file for a saved tour request, or null when no date was
 * chosen. Times are floating local times, so the visit lands on the chosen
 * clock time wherever the file is opened.
 */
export function buildTourIcs(request: SavedTourRequest): GeneratedFile | null {
  const { inquiry } = request;
  if (!inquiry.preferredDate) return null;

  const dayStart = fromIso(inquiry.preferredDate);
  const compact = inquiry.preferredDate.replace(/-/g, "");
  const time = inquiry.preferredTime ? startTimes[inquiry.preferredTime] : null;

  const when = time
    ? [
        `DTSTART:${compact}T${pad(time.hour)}${pad(time.minute)}00`,
        `DTEND:${compact}T${pad(time.hour + 1)}${pad(time.minute)}00`,
      ]
    : [
        `DTSTART;VALUE=DATE:${compact}`,
        `DTEND;VALUE=DATE:${toIso(addDays(dayStart, 1)).replace(/-/g, "")}`,
      ];

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Apex Hudson Riverfront//Demo//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${request.id}@apex-demo.invalid`,
    `DTSTAMP:${stamp(request.createdAt)}`,
    ...when,
    `SUMMARY:${escapeText(`Apartment tour, ${site.name} (demo request)`)}`,
    `LOCATION:${escapeText(`${site.name}, ${formattedAddress}`)}`,
    `DESCRIPTION:${escapeText(
      `Demo tour request ${request.reference}. This was saved in your browser only; the leasing team has not received it and no tour is booked.`,
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return {
    filename: `tour-request-${request.reference}.ics`,
    content: lines.join("\r\n"),
  };
}
