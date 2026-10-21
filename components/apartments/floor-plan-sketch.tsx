import type { BedroomType } from "@/types/property";

interface Room {
  label: string;
  x: number;
  y: number;
}

interface Layout {
  walls: string[];
  rooms: Room[];
}

/**
 * Generic schematic layouts by bedroom type. These are placeholders so the
 * page has a floor-plan slot; replace with each plan's real drawing.
 */
const layouts: Record<BedroomType, Layout> = {
  studio: {
    walls: ["M150 20 V120 H20", "M290 20 V120 H380", "M210 20 V80 H290"],
    rooms: [
      { label: "Kitchen", x: 85, y: 70 },
      { label: "Closet", x: 250, y: 55 },
      { label: "Bath", x: 335, y: 70 },
      { label: "Living / Sleeping", x: 200, y: 205 },
    ],
  },
  "one-bed": {
    walls: ["M170 20 V150 H20", "M240 20 V120 H380"],
    rooms: [
      { label: "Bedroom", x: 95, y: 90 },
      { label: "Bath", x: 205, y: 75 },
      { label: "Kitchen", x: 310, y: 75 },
      { label: "Living / Dining", x: 230, y: 215 },
    ],
  },
  "two-bed": {
    walls: [
      "M160 20 V130 H20",
      "M240 20 V120 H380",
      "M20 170 H160 V280",
    ],
    rooms: [
      { label: "Bedroom 1", x: 90, y: 80 },
      { label: "Bath", x: 200, y: 75 },
      { label: "Kitchen", x: 310, y: 75 },
      { label: "Bedroom 2", x: 90, y: 230 },
      { label: "Living / Dining", x: 270, y: 205 },
    ],
  },
};

export function FloorPlanSketch({
  bedroomType,
  planName,
}: {
  bedroomType: BedroomType;
  planName: string;
}) {
  const { walls, rooms } = layouts[bedroomType];

  return (
    <figure>
      <svg
        viewBox="0 0 400 300"
        role="img"
        aria-label={`Schematic floor plan placeholder for ${planName}`}
        className="h-auto w-full border border-line bg-paper"
      >
        <rect
          x="20"
          y="20"
          width="360"
          height="260"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3"
        />
        {walls.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2"
          />
        ))}
        {/* Window wall */}
        <line
          x1="70"
          y1="280"
          x2="330"
          y2="280"
          stroke="var(--river)"
          strokeWidth="6"
        />
        {rooms.map((room) => (
          <text
            key={room.label}
            x={room.x}
            y={room.y}
            textAnchor="middle"
            fontSize="12"
            fill="var(--ink-2)"
            style={{ fontFamily: "var(--font-body), sans-serif" }}
          >
            {room.label}
          </text>
        ))}
      </svg>
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-3">
        Schematic placeholder, not to scale. The blue line marks a window wall.
        The leasing team supplies the actual floor plan for each home.
      </figcaption>
    </figure>
  );
}
