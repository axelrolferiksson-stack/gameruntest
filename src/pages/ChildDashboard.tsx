import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ActivityRing } from "@/components/ActivityRing";
import { ScreenTimeCard } from "@/components/ScreenTimeCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { 
  LogOut, 
  Footprints, 
  Timer,
  Bike,
  Trophy,
  Sparkles,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { healthKitService, type HealthData } from "@/services/healthKit";
import { notificationService } from "@/services/notifications";

const mockChallenges = [
  {
    id: 1,
    title: "Morning Walk",
    description: "Take 1,000 steps before 10 AM",
    reward: 15,
    icon: Footprints,
    progress: 750,
    target: 1000,
    unit: "steps",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Active Hour",
    description: "Stay active for 30 minutes straight",
    reward: 20,
    icon: Timer,
    progress: 30,
    target: 30,
    unit: "min",
    isCompleted: true,
  },
  {
    id: 3,
    title: "Bike Ride",
    description: "Go on a 2km bike ride",
    reward: 25,
    icon: Bike,
    progress: 0.5,
    target: 2,
    unit: "km",
    isCompleted: false,
  },
];

export default function ChildDashboard() {
  const [challenges] = useState(mockChallenges);
  const [healthData, setHealthData] = useState<HealthData>({ steps: 0, distance: 0, activeMinutes: 0 });
  const [screenTimeEarned, setScreenTimeEarned] = useState(0);
  const [screenTimeRemaining] = useState(0); // Start at 0 to trigger notification
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

  const activityProgress = Math.min(100, Math.floor((healthData.steps / 5000) * 100));

  const handleStartChallenge = (title: string) => {
    toast.success(`Starting: ${title}!`, {
      description: "Get moving to earn screen time!",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 gradient-glass border-b border-border/50">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleEnableNotifications}>
            <Bell className={`w-5 h-5 ${notificationsEnabled ? 'text-primary' : ''}`} />
          </Button>
          <div className="font-display font-bold text-xl text-foreground">
            Game<span className="text-primary">Run</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">
            Hey, {profile?.display_name || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground">Let's get moving today!</p>
        </motion.div>

        {/* Activity Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <ActivityRing progress={activityProgress} size={200} strokeWidth={16} />
        </motion.div>

        {/* Screen Time Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <ScreenTimeCard minutes={screenTimeEarned} type="earned" />
          <ScreenTimeCard minutes={screenTimeRemaining} type="remaining" />
        </div>

        {/* Today's Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-5 shadow-card border border-border/50 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h2 className="font-display font-bold text-lg text-foreground">Today's Progress</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-display font-bold text-2xl text-foreground">{healthData.steps.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Steps</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-foreground">{(healthData.distance / 1000).toFixed(1)}km</p>
              <p className="text-xs text-muted-foreground">Distance</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-foreground">{healthData.activeMinutes}m</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </motion.div>

        {/* Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-foreground">Challenges</h2>
            <span className="text-sm text-muted-foreground">
              {challenges.filter(c => c.isCompleted).length}/{challenges.length} done
            </span>
          </div>
          <div className="space-y-4">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <ChallengeCard
                  {...challenge}
                  onStart={() => handleStartChallenge(challenge.title)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Motivation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 gradient-hero rounded-2xl p-6 text-center text-primary-foreground"
        >
          <p className="font-display font-bold text-lg mb-2">
            🏃‍♂️ Keep going!
          </p>
          <p className="text-sm opacity-90">
            Just 250 more steps to unlock 15 extra minutes!
          </p>
        </motion.div>
      </main>
    </div>
  );
}
