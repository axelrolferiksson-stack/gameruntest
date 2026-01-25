import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChildCard } from "@/components/ChildCard";
import { 
  ArrowLeft, 
  Plus, 
  Bell, 
  Settings,
  TrendingUp,
  Users,
  Clock,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const mockChildren = [
  {
    id: 1,
    name: "Emma",
    avatar: "https://images.unsplash.com/photo-1595967444215-4e0b24f3d09a?w=150&h=150&fit=crop&crop=face",
    screenTimeRemaining: 45,
    activityProgress: 72,
    isLocked: false,
  },
  {
    id: 2,
    name: "Lucas",
    avatar: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?w=150&h=150&fit=crop&crop=face",
    screenTimeRemaining: 0,
    activityProgress: 35,
    isLocked: true,
  },
];

const stats = [
  { label: "Total Kids", value: "2", icon: Users, color: "gradient-activity" },
  { label: "Avg Activity", value: "68%", icon: Activity, color: "gradient-reward" },
  { label: "Time Granted", value: "2h 15m", icon: Clock, color: "gradient-hero" },
  { label: "Week Trend", value: "+12%", icon: TrendingUp, color: "gradient-activity" },
];

export default function ParentDashboard() {
  const [children] = useState(mockChildren);

  const handleGrantTime = (childName: string) => {
    toast.success(`Granted 15 minutes to ${childName}!`, {
      description: "Screen time has been added to their account.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 gradient-glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">Parent Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your children's screen time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.color} rounded-2xl p-5 text-primary-foreground`}
            >
              <stat.icon className="w-6 h-6 mb-3 opacity-80" />
              <p className="text-2xl font-display font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Children Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-foreground">Your Children</h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4" />
              Add Child
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <ChildCard
                  {...child}
                  onGrantTime={() => handleGrantTime(child.name)}
                  onViewDetails={() => toast.info(`Viewing ${child.name}'s details`)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
        >
          <h3 className="font-display font-bold text-lg text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-xs">Lock All</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Activity className="w-5 h-5" />
              <span className="text-xs">View Activity</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Bell className="w-5 h-5" />
              <span className="text-xs">Notifications</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
