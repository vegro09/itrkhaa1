import {
  Ban,
  BedDouble,
  Bike,
  BookOpen,
  ChefHat,
  ChevronsUp,
  CupSoda,
  Droplets,
  Dumbbell,
  Footprints,
  Headphones,
  Moon,
  PenLine,
  PersonStanding,
  PhoneCall,
  Shirt,
  ShowerHead,
  Smartphone,
  Sparkles,
  Sprout,
  Sun,
  Users,
  Wind,
} from "lucide-react";
import type { ChallengeIconKey } from "@/lib/sos-challenges";

const MAP: Record<
  ChallengeIconKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  prayer: Moon,
  water: Droplets,
  pushups: Dumbbell,
  phoneOff: Smartphone,
  laundry: Shirt,
  family: Users,
  walk: Footprints,
  book: BookOpen,
  sun: Sun,
  clean: Sparkles,
  tea: CupSoda,
  call: PhoneCall,
  stairs: ChevronsUp,
  write: PenLine,
  stretch: PersonStanding,
  music: Headphones,
  wind: Wind,
  shower: ShowerHead,
  cook: ChefHat,
  plant: Sprout,
  sleepReset: BedDouble,
  sport: Bike,
};

export function ChallengeIcon({ icon }: { icon: ChallengeIconKey }) {
  const Icon = MAP[icon] || Sparkles;
  return (
    <span className="relative inline-flex items-center justify-center text-current">
      <Icon className="h-20 w-20 md:h-24 md:w-24" strokeWidth={1.25} />
      {icon === "phoneOff" ? (
        <Ban className="absolute h-24 w-24 md:h-28 md:w-28 text-cherry" strokeWidth={1.25} />
      ) : null}
    </span>
  );
}
