import { motion } from "framer-motion";
import { Clock, Zap, Gift } from "lucide-react";

interface ScreenTimeCardProps {
  minutes: number;
  type: "earned" | "remaining" | "bonus";
  className?: string;
}

export const ScreenTimeCard = ({ minutes, type, className = "" }: ScreenTimeCardProps) => {
  const configs = {
    earned: {
      icon: Zap,
      label: "Earned Today",
      gradient: "gradient-activity",
      glow: "shadow-glow-primary",
    },
    remaining: {
      icon: Clock,
      label: "Time Remaining",
      gradient: "gradient-reward",
      glow: "shadow-glow-secondary",
    },
    bonus: {
      icon: Gift,
      label: "Bonus Time",
      gradient: "gradient-hero",
      glow: "shadow-glow-primary",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`${config.gradient} ${config.glow} rounded-2xl p-6 text-primary-foreground ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium opacity-90">{config.label}</span>
      </div>
      <motion.div 
        className="text-4xl font-display font-bold"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        {timeDisplay}
      </motion.div>
    </motion.div>
  );
};
