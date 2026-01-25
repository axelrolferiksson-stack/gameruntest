import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, User, Trophy, ChevronRight, Footprints, Zap, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "community" | "personal";
  progress: number;
  target: number;
  unit: string;
  reward: number;
  members?: number;
  isCompleted: boolean;
  icon: "steps" | "speed" | "location";
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Complete a 500-kilometer run",
    description: "Join the community and run together!",
    type: "community",
    progress: 342,
    target: 500,
    unit: "km",
    reward: 60,
    members: 1345,
    isCompleted: false,
    icon: "steps",
  },
  {
    id: "2",
    title: "Run 15km this week",
    description: "Personal weekly goal",
    type: "personal",
    progress: 8.5,
    target: 15,
    unit: "km",
    reward: 30,
    isCompleted: false,
    icon: "steps",
  },
  {
    id: "3",
    title: "15,000 steps today",
    description: "Daily step challenge",
    type: "personal",
    progress: 12572,
    target: 15000,
    unit: "steps",
    reward: 2,
    isCompleted: false,
    icon: "steps",
  },
  {
    id: "4",
    title: "Run faster than 25 km/h",
    description: "Speed challenge",
    type: "personal",
    progress: 22,
    target: 25,
    unit: "km/h",
    reward: 1,
    isCompleted: false,
    icon: "speed",
  },
  {
    id: "5",
    title: "Visit Bäckby Centrum",
    description: "Location-based challenge",
    type: "personal",
    progress: 0,
    target: 1,
    unit: "visit",
    reward: 1,
    isCompleted: false,
    icon: "location",
  },
];

const finishedChallenges = [
  { id: "f1", title: "Run 15km", members: 89, type: "community" as const },
  { id: "f2", title: "Run 10km in one hour", members: 234, type: "community" as const },
];

const ChallengeIcon = ({ type }: { type: "steps" | "speed" | "location" }) => {
  switch (type) {
    case "steps":
      return <Footprints className="w-5 h-5" />;
    case "speed":
      return <Zap className="w-5 h-5" />;
    case "location":
      return <MapPin className="w-5 h-5" />;
  }
};

const Challenges = () => {
  const [activeTab, setActiveTab] = useState("community");

  const communityChallenges = challenges.filter((c) => c.type === "community");
  const personalChallenges = challenges.filter((c) => c.type === "personal");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <img src={logo} alt="GameRun" className="w-10 h-10" />
          <h1 className="font-display text-xl font-bold text-foreground">Challenges</h1>
          <div className="w-10" />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-card border border-border/50">
            <TabsTrigger value="community" className="gap-2 data-[state=active]:gradient-activity data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="personal" className="gap-2 data-[state=active]:gradient-activity data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="community" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Featured Community Challenge */}
                {communityChallenges[0] && (
                  <div className="relative rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 gradient-activity opacity-80" />
                    <div className="relative p-6">
                      <Button size="sm" className="mb-4 bg-primary/20 text-primary-foreground border border-primary-foreground/30">
                        Join Now
                      </Button>
                      <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">
                        {communityChallenges[0].title}
                      </h3>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="text-primary-foreground/80">
                          <p className="text-sm">Group Goal</p>
                          <p className="font-bold">{communityChallenges[0].target} {communityChallenges[0].unit}</p>
                        </div>
                        <div className="text-primary-foreground/80">
                          <p className="text-sm">Members</p>
                          <p className="font-bold">{communityChallenges[0].members?.toLocaleString()}</p>
                        </div>
                      </div>
                      <Progress
                        value={(communityChallenges[0].progress / communityChallenges[0].target) * 100}
                        className="mt-4 h-2 bg-primary-foreground/20"
                      />
                    </div>
                  </div>
                )}

                {/* Finished Challenges */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-semibold text-foreground">Finished Challenges</h2>
                    <Button variant="ghost" size="sm" className="text-primary">
                      See All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {finishedChallenges.map((challenge) => (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card rounded-2xl p-4 flex items-center gap-4 border border-border/50"
                      >
                        <div className="w-12 h-12 rounded-xl gradient-activity flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{challenge.title}</p>
                          <p className="text-sm text-muted-foreground">{challenge.members} active members</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="personal" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Daily Challenges */}
                <div>
                  <h2 className="font-display font-semibold text-foreground mb-4">Daily Challenges</h2>
                  <div className="space-y-3">
                    {personalChallenges.slice(0, 3).map((challenge, index) => (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-2xl p-4 border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary">
                            <ChallengeIcon type={challenge.icon} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{challenge.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {challenge.progress.toLocaleString()} / {challenge.target.toLocaleString()} {challenge.unit}
                            </p>
                          </div>
                          <span className="text-sm font-bold gradient-reward text-transparent bg-clip-text">
                            +{challenge.reward}
                          </span>
                        </div>
                        <Progress
                          value={(challenge.progress / challenge.target) * 100}
                          className="mt-3 h-1.5"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Location Challenges */}
                <div>
                  <h2 className="font-display font-semibold text-foreground mb-4">Visit Challenges</h2>
                  <p className="text-sm text-muted-foreground mb-3">Visit places for extra screentime!</p>
                  <div className="space-y-2">
                    {["Vasaparken (1h)", "Skrapan (1h)", "Björnön (1h)", "Vebobacken (1h)", "Domkyrkan (1h)"].map((place, index) => (
                      <motion.div
                        key={place}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex items-center justify-between py-3 px-4 bg-card rounded-xl border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">{place}</span>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Challenges;
