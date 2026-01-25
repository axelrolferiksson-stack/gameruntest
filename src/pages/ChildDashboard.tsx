import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ActivityRing } from "@/components/ActivityRing";
import { ScreenTimeCard } from "@/components/ScreenTimeCard";
import { 
  LogOut, 
  Footprints, 
  Zap,
  MapPin,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

export default function ChildDashboard() {
  const [healthData, setHealthData] = useState<HealthData>({ steps: 0, distance: 0, activeMinutes: 0 });
  const [screenTimeEarned, setScreenTimeEarned] = useState(0);
  const [screenTimeRemaining] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealthData = async () => {
      const data = await healthKitService.getTodayData();
      setHealthData(data);
      setScreenTimeEarned(healthKitService.calculateScreenTimeEarned(data));
    };

    fetchHealthData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchHealthData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for screen time notifications
  useEffect(() => {
    if (screenTimeRemaining === 0 && notificationsEnabled) {
      notificationService.checkScreenTimeAndNotify(screenTimeRemaining);
    }
  }, [screenTimeRemaining, notificationsEnabled]);

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setNotificationsEnabled(true);
      toast.success('Notifications enabled!');
      // Immediately check screen time
      notificationService.checkScreenTimeAndNotify(screenTimeRemaining);
    } else {
      toast.error('Notification permission denied');
    }
  };

  // Calculate goal progress (e.g., 3.6 km out of 5 km daily goal)
  const dailyGoalKm = 5;
  const currentKm = healthData.distance / 1000;
  const goalProgress = Math.min(100, (currentKm / dailyGoalKm) * 100);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-2">
          <img src={logo} alt="GameRun" className="w-10 h-10" />
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="font-bold text-foreground">{screenTimeEarned}m</p>
          </div>
        </div>
      </header>

      <main className="px-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-display font-bold text-2xl text-foreground">
            Hey {profile?.display_name || 'there'}, looking great!
          </h1>
        </motion.div>

        {/* Today's Goal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 shadow-card border border-border/50 mb-6"
        >
          <p className="text-muted-foreground text-sm mb-4">Todays Goal</p>
          <div className="flex justify-center mb-4">
            <ActivityRing progress={goalProgress} size={160} strokeWidth={12}>
              <div className="text-center">
                <p className="font-display font-bold text-4xl text-foreground">{currentKm.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">km</p>
              </div>
            </ActivityRing>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="w-2 h-2 rounded-full bg-muted" />
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
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between py-3 px-4 bg-card rounded-xl border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground">{challenge.title}</span>
                  </div>
                  <span className="text-sm font-bold gradient-reward text-transparent bg-clip-text">
                    +{challenge.reward}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <Button 
            variant="link" 
            className="text-primary p-0 h-auto mt-2"
            onClick={() => navigate('/challenges')}
          >
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => navigate('/pass')}
            className="w-full h-14 text-lg font-display font-bold gradient-hero"
          >
            🏃‍♂️ Start Activity Pass
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
