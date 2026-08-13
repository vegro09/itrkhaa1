import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Home, MessageCircleHeart, BookOpen, User } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { useT } from "@/lib/i18n";

const items = [
  { to: "/dashboard", icon: Home, key: "home" as const },
  { to: "/hakeem", icon: MessageCircleHeart, key: "hakeem" as const },
  { to: "/library", icon: BookOpen, key: "library" as const },
  { to: "/profile", icon: User, key: "profile" as const },
];

export function BottomNav() {
  const { state } = useApp();
  const tr = useT(state.lang);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hidden entirely on the Hakeem chat route and during onboarding.
  if (pathname.startsWith("/hakeem") || pathname === "/") return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="flex items-center gap-1 rounded-full border border-noir/10 bg-card/80 px-2 py-2 shadow-[var(--shadow-float)] backdrop-blur-md"
      >
        {items.map(({ to, icon: Icon, key }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-cherry"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center gap-2 ${
                  active ? "text-cotton" : "text-noir/55"
                }`}
              >
                <Icon size={20} strokeWidth={1.75} />
                {active && <span className="text-xs">{tr(key)}</span>}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}
