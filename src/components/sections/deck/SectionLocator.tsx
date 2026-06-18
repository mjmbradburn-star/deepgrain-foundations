import { cn } from "@/lib/utils";

interface SectionLocatorProps {
  index: number;
  total: number;
  left?: string;
  right?: string;
  tone?: "green" | "linen";
  className?: string;
}

/**
 * Deck-footer rail. Faint tracked-caps anchors at the bottom of a section,
 * mirroring `Deepgrain · 04 · Montagu` from the slides. Gives the site a
 * sense of progress without adding visual weight.
 */
export const SectionLocator = ({
  index,
  total,
  left = "Deepgrain",
  right,
  tone = "green",
  className,
}: SectionLocatorProps) => {
  const color = tone === "green" ? "text-cream/35" : "text-walnut/35";
  const padded = String(index).padStart(2, "0");
  const totalPadded = String(total).padStart(2, "0");
  return (
    <div
      className={cn(
        "flex items-center justify-between font-sans uppercase",
        color,
        className,
      )}
      style={{ fontSize: "10px", letterSpacing: "0.25em" }}
    >
      <span>{left}</span>
      <span>{padded} / {totalPadded}</span>
      <span>{right ?? ""}</span>
    </div>
  );
};
