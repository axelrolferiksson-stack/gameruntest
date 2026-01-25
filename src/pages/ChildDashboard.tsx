import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ActivityRing } from "@/components/ActivityRing";
import { ScreenTimeCard } from "@/components/ScreenTimeCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { 
  ArrowLeft, 
  Footprints, 
  Timer,
  Bike,
  Trophy,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

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
  const [activityProgress] = useState(68);
  const [screenTimeEarned] = useState(45);
  const [screenTimeRemaining] = useState(30);

  const handleStartChallenge = (title: string) => {
    toast.success(`Starting: ${title}!`, {
      description: "Get moving to earn screen time!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 gradient-glass border-b border-border/50">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="font-display font-bold text-xl text-foreground">
            Move<span className="text-primary">Time</span>
          </div>
          <Button variant="ghost" size="icon">
            <Trophy className="w-5 h-5" />
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
            Hey, Emma! 👋
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
              <p className="font-display font-bold text-2xl text-foreground">3,245</p>
              <p className="text-xs text-muted-foreground">Steps</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-foreground">1.8km</p>
              <p className="text-xs text-muted-foreground">Distance</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-foreground">45m</p>
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
