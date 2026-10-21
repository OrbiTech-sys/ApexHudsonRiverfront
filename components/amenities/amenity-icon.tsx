import {
  Briefcase,
  Car,
  Dumbbell,
  Flame,
  Sofa,
  Sun,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { AmenityIconName } from "@/types/property";

const icons: Record<AmenityIconName, LucideIcon> = {
  waves: Waves,
  dumbbell: Dumbbell,
  sun: Sun,
  flame: Flame,
  sofa: Sofa,
  briefcase: Briefcase,
  car: Car,
};

export function AmenityIcon({
  name,
  className,
}: {
  name: AmenityIconName;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.5} />;
}
