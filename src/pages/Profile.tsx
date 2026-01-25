import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/BottomNav";
import { Settings, Edit2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Profile = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: "Total Steps", value: "124,500" },
    { label: "Challenges Won", value: "12" },
    { label: "Friends", value: "8" },
    { label: "Screen Time Earned", value: "42h" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-48 gradient-activity opacity-20" />
        
        <div className="relative px-6 pt-12">
          <div className="flex items-center justify-between mb-8">
            <img src={logo} alt="GameRun" className="w-10 h-10" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="text-foreground"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 shadow-card border border-border/50"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full gradient-activity flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {profile?.display_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
              <div className="flex-1">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {profile?.display_name || "User"}
                </h1>
                <p className="text-muted-foreground text-sm">@{profile?.display_name?.toLowerCase().replace(/\s/g, '') || "user"}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted/50 rounded-2xl p-4 text-center"
                >
                  <p className="text-2xl font-bold gradient-reward text-transparent bg-clip-text">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="px-6 mt-8">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Recent Achievements
        </h2>
        <div className="space-y-3">
          {[
            { title: "First 10K Steps", date: "Today", icon: "🏃" },
            { title: "7-Day Streak", date: "Yesterday", icon: "🔥" },
            { title: "Community Champion", date: "This week", icon: "🏆" },
          ].map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-card rounded-2xl p-4 flex items-center gap-4 border border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{achievement.title}</p>
                <p className="text-sm text-muted-foreground">{achievement.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
