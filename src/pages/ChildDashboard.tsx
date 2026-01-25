import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ActivityRing } from "@/components/ActivityRing";
import { ScreenTimeCard } from "@/components/ScreenTimeCard";
import { Footprints, Zap, MapPin, ChevronRight, Sparkles, Timer, Trophy, Target } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { healthKitService, type HealthData } from "@/services/healthKit";
import { notificationService } from "@/services/notifications";
import { BottomNav } from "@/components/BottomNav";
import logo from "@/assets/logo.png";

const dailyChallenges = [
  { id: 1, title: "15,000 steps today", reward: 2, icon: Footprints, progress: 12572, target: 15000 },
  { id: 2, title: "Run faster than 25 km/h", reward: 1, icon: Zap, progress: 22, target: 25 },
  { id: 3, title: "Visit Bäckby Centrum", reward: 1, icon: MapPin, progress: 0, target: 1 },
];

const howToEarn = [
  {
    icon: Footprints,
    title: "Walk & Run",
    description: "Every 1000 steps = 5 min",
    color: "from-blue-500 to-cyan-400",
  },
  { icon: Trophy, title: "Complete Challenges", description: "Earn bonus time!", color: "from-cyan-400 to-blue-500" },
  { icon: MapPin, title: "Visit Places", description: "Explore for rewards", color: "from-blue-600 to-indigo-500" },
];

export default function ChildDashboard() {
  const [healthData, setHealthData] = useState<HealthData>({ steps: 0, distance: 0, activeMinutes: 0 });
  const [screenTimeEarned, setScreenTimeEarned] = useState(0);
  const [screenTimeRemaining] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealthData = async () => {
      const data = await healthKitService.getTodayData();
      setHealthData(data);
      setScreenTimeEarned(healthKitService.calculateScreenTimeEarned(data));
    };

    fetchHealthData();
    const interval = setInterval(fetchHealthData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (screenTimeRemaining === 0 && notificationsEnabled) {
      notificationService.checkScreenTimeAndNotify(screenTimeRemaining);
    }
  }, [screenTimeRemaining, notificationsEnabled]);

  const dailyGoalKm = 5;
  const currentKm = healthData.distance / 1000;
  const goalProgress = Math.min(100, (currentKm / dailyGoalKm) * 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with animated background */}
      <div className="relative">
        <div className="absolute inset-0 h-72 overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full gradient-activity opacity-20 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -top-10 right-0 w-56 h-56 rounded-full gradient-hero opacity-15 blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <header className="relative px-6 pt-12 pb-4">
          <div className="flex items-center justify-between mb-2">
            <Link to="/child" className="hover:opacity-80 transition-opacity">
              <motion.img
                src={logo}
                alt="GameRun"
                className="w-10 h-10 drop-shadow-[0_0_10px_hsl(200,100%,50%)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            </Link>
            <motion.div
              className="text-right bg-card/80 backdrop-blur-md px-4 py-2 rounded-2xl neon-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="font-bold text-primary text-lg">{screenTimeEarned}m</p>
            </motion.div>
          </div>
        </header>
      </div>

      <main className="px-6 relative">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display font-bold text-2xl text-foreground">
            Hey {profile?.display_name || "there"}! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Let's get moving and earn screen time!</p>
        </motion.div>

        {/* Today's Goal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 shadow-card neon-border mb-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-glow opacity-50" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Today's Goal
              </p>
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                {goalProgress.toFixed(0)}% Complete
              </span>
            </div>
            <div className="flex justify-center mb-4">
              <ActivityRing progress={goalProgress} size={160} strokeWidth={12}>
                <div className="text-center">
                  <motion.p
                    className="font-display font-bold text-4xl text-gradient-glow"
                    key={currentKm}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {currentKm.toFixed(1)}
                  </motion.p>
                  <p className="text-xs text-muted-foreground">of {dailyGoalKm} km</p>
                </div>
              </ActivityRing>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center p-2 bg-muted/30 rounded-xl">
                <p className="text-lg font-bold text-primary">{healthData.steps.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Steps</p>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded-xl">
                <p className="text-lg font-bold text-primary">{healthData.activeMinutes}</p>
                <p className="text-[10px] text-muted-foreground">Active Min</p>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded-xl">
                <p className="text-lg font-bold text-primary">{screenTimeEarned}m</p>
                <p className="text-[10px] text-muted-foreground">Earned</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How to Earn Screen Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg text-foreground">How to Earn Screen Time</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {howToEarn.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-card rounded-2xl p-4 neon-border text-center relative overflow-hidden group cursor-pointer"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="relative">
                  <div className="w-10 h-10 mx-auto rounded-xl gradient-activity flex items-center justify-center mb-2 shadow-glow-primary">
                    <item.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="font-semibold text-xs text-foreground">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">Daily Challenges</h2>
          <div className="space-y-2">
            {dailyChallenges.map((challenge, index) => {
              const Icon = challenge.icon;
              const progressPercent = Math.min(100, (challenge.progress / challenge.target) * 100);
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between py-3 px-4 bg-card rounded-xl neon-border group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-activity flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="text-sm text-foreground">{challenge.title}</span>
                      <div className="w-24 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                        <motion.div
                          className="h-full gradient-activity rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                  <motion.span
                    className="text-sm font-bold text-primary flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Timer className="w-3 h-3" />+{challenge.reward}m
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
          <Button variant="link" className="text-primary p-0 h-auto mt-2" onClick={() => navigate("/challenges")}>
            See All Challenges
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>

        {/* Screen Time Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <ScreenTimeCard minutes={screenTimeEarned} type="earned" />
          <ScreenTimeCard minutes={screenTimeRemaining} type="remaining" />
        </div>

        {/* Start Activity Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Button
            onClick={() => navigate("/pass")}
            className="w-full h-14 text-lg font-display font-bold gradient-hero shadow-neon relative overflow-hidden group"
          >
            <motion.div className="absolute inset-0 gradient-activity opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">🏃‍♂️ Start Activity Pass</span>
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
