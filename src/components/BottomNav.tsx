import { NavLink } from "./NavLink";
import { User, Trophy, Users, BarChart3, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/child", icon: Home, label: "Home" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/challenges", icon: Trophy, label: "Challenges" },
  { to: "/friends", icon: Users, label: "Friends" },
  { to: "/stats", icon: BarChart3, label: "Stats" },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 safe-area-pb z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors text-muted-foreground"
            activeClassName="text-primary"
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span className={cn("text-xs font-medium", isActive && "text-primary")}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
