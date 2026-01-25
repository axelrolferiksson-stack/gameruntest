import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/BottomNav";
import { Settings, Edit2, Camera, Star, Flame, Trophy, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/logo-white.png";

const Profile = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: "Total Steps", value: "124,500", icon: "👟" },
    { label: "Challenges Won", value: "12", icon: "🏆" },
    { label: "Friends", value: "8", icon: "👥" },
    { label: "Screen Time", value: "42h", icon: "📱" },
  ];

  const achievements = [
    { title: "First 10K Steps", date: "Today", icon: "🏃", unlocked: true },
    { title: "7-Day Streak", date: "Yesterday", icon: "🔥", unlocked: true },
    { title: "Community Champion", date: "This week", icon: "🏆", unlocked: true },
    { title: "Speed Demon", date: "Locked", icon: "⚡", unlocked: false },
    { title: "Explorer", date: "Locked", icon: "🗺️", unlocked: false },
  ];

  const level = 12;
  const xp = 2450;
  const xpToNext = 3000;
  const xpProgress = (xp / xpToNext) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with gradient */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-56 gradient-hero opacity-20" />
        <motion.div
          className="absolute top-10 right-10 w-40 h-40 rounded-full gradient-activity opacity-20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="relative px-6 pt-12">
          <div className="flex items-center justify-between mb-8">
            <Link to="/child" className="hover:opacity-80 transition-opacity">
              <motion.img 
                src={logo} 
                alt="GameRun" 
                className="w-10 h-10 drop-shadow-[0_0_10px_hsl(200,100%,50%)]" 
                whileHover={{ scale: 1.1 }}
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="text-foreground hover:bg-primary/20"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 shadow-card neon-border relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-glow opacity-30" />
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <motion.div 
                    className="w-20 h-20 rounded-full gradient-activity flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-glow-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    {profile?.display_name?.charAt(0).toUpperCase() || "U"}
                  </motion.div>
                  <motion.button 
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-glow-primary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </motion.button>
                  {/* Level badge */}
                  <div className="absolute -top-1 -left-1 w-7 h-7 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-primary-foreground shadow-glow-primary">
                    {level}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    {profile?.display_name || "User"}
                  </h1>
                  <p className="text-muted-foreground text-sm">@{profile?.display_name?.toLowerCase().replace(/\s/g, '') || "user"}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 neon-border hover:bg-primary/20">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
              </div>

              {/* XP Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary" /> Level {level}
                  </span>
                  <span className="text-xs text-primary">{xp} / {xpToNext} XP</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full gradient-activity rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-muted/30 rounded-2xl p-4 text-center neon-border cursor-pointer"
                  >
                    <span className="text-2xl">{stat.icon}</span>
                    <p className="text-xl font-bold text-primary mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="px-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">Achievements</h2>
        </div>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ x: 5 }}
              className={`bg-card rounded-2xl p-4 flex items-center gap-4 neon-border cursor-pointer ${!achievement.unlocked ? 'opacity-50' : ''}`}
            >
              <motion.div 
                className={`w-12 h-12 rounded-xl ${achievement.unlocked ? 'gradient-activity shadow-glow-primary' : 'bg-muted'} flex items-center justify-center text-2xl`}
                whileHover={achievement.unlocked ? { rotate: [0, -10, 10, 0] } : {}}
              >
                {achievement.icon}
              </motion.div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{achievement.title}</p>
                <p className="text-sm text-muted-foreground">{achievement.date}</p>
              </div>
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                >
                  <Zap className="w-5 h-5 text-primary" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;