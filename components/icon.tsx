import {
  BarChart2,
  Cpu,
  Heart,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MousePointer2,
  Phone,
  Search,
  Settings,
  Target,
  TrendingUp,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "bar-chart-2": BarChart2,
  cpu: Cpu,
  heart: Heart,
  lock: Lock,
  mail: Mail,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  "mouse-pointer-2": MousePointer2,
  phone: Phone,
  search: Search,
  settings: Settings,
  target: Target,
  "trending-up": TrendingUp,
  users: Users
};

type IconProps = {
  name: string;
  className?: string;
};

export function AppIcon({ name, className }: IconProps) {
  const Icon = iconMap[name] ?? Search;

  return <Icon className={className} strokeWidth={1.8} />;
}
