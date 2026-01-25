import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChildCard } from "@/components/ChildCard";
import { 
  LogOut, 
  Plus, 
  Bell, 
  Settings,
  TrendingUp,
  Users,
  Clock,
  Activity,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface LinkedChild {
  id: string;
  name: string;
  avatar: string | null;
  screenTimeRemaining: number;
  activityProgress: number;
  isLocked: boolean;
}

export default function ParentDashboard() {
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.id) {
      fetchLinkedChildren();
    }
  }, [profile?.id]);

  const fetchLinkedChildren = async () => {
    if (!profile?.id) return;

    try {
      // Fetch parent-child links
      const { data: links, error: linksError } = await supabase
        .from("parent_child_links")
        .select("child_id")
        .eq("parent_id", profile.id);

      if (linksError) {
        console.error("Error fetching links:", linksError);
        return;
      }

      if (!links || links.length === 0) {
        setChildren([]);
        setLoading(false);
        return;
      }

      const childIds = links.map(link => link.child_id);

      // Fetch child profiles
      const { data: childProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", childIds);

      if (profilesError) {
        console.error("Error fetching child profiles:", profilesError);
        return;
      }

      // Fetch screen time balances
      const { data: balances, error: balancesError } = await supabase
        .from("screen_time_balance")
        .select("user_id, minutes_remaining")
        .in("user_id", childIds);

      if (balancesError) {
        console.error("Error fetching balances:", balancesError);
      }

      // Fetch today's activity
      const today = new Date().toISOString().split("T")[0];
      const { data: activities, error: activitiesError } = await supabase
        .from("activity_logs")
        .select("user_id, distance_meters")
        .in("user_id", childIds)
        .eq("logged_at", today);

      if (activitiesError) {
        console.error("Error fetching activities:", activitiesError);
      }

      // Build child data
      const linkedChildren: LinkedChild[] = (childProfiles || []).map(child => {
        const balance = balances?.find(b => b.user_id === child.id);
        const activity = activities?.find(a => a.user_id === child.id);
        const screenTime = balance?.minutes_remaining || 0;
        const distance = activity?.distance_meters || 0;
        // Activity progress as percentage of daily goal (e.g., 5km = 5000m)
        const activityProgress = Math.min(100, Math.round((distance / 5000) * 100));

        return {
          id: child.id,
          name: child.display_name,
          avatar: child.avatar_url,
          screenTimeRemaining: screenTime,
          activityProgress,
          isLocked: screenTime <= 0,
        };
      });

      setChildren(linkedChildren);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantTime = async (childId: string, childName: string) => {
    try {
      const { data: balance } = await supabase
        .from("screen_time_balance")
        .select("minutes_remaining")
        .eq("user_id", childId)
        .maybeSingle();

      const currentMinutes = balance?.minutes_remaining || 0;

      const { error } = await supabase
        .from("screen_time_balance")
        .upsert({
          user_id: childId,
          minutes_remaining: currentMinutes + 15,
          last_updated: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (error) throw error;

      toast.success(`Granted 15 minutes to ${childName}!`, {
        description: "Screen time has been added to their account.",
      });

      fetchLinkedChildren();
    } catch (error) {
      console.error("Error granting time:", error);
      toast.error("Failed to grant screen time");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const stats = [
    { label: "Total Kids", value: children.length.toString(), icon: Users, color: "gradient-activity" },
    { label: "Avg Activity", value: children.length > 0 ? `${Math.round(children.reduce((a, c) => a + c.activityProgress, 0) / children.length)}%` : "0%", icon: Activity, color: "gradient-reward" },
    { label: "Time Granted", value: `${children.reduce((a, c) => a + c.screenTimeRemaining, 0)}m`, icon: Clock, color: "gradient-hero" },
    { label: "Active Kids", value: children.filter(c => !c.isLocked).length.toString(), icon: TrendingUp, color: "gradient-activity" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 gradient-glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                Welcome, {profile?.display_name || 'Parent'}
              </h1>
              <p className="text-sm text-muted-foreground">Manage your children's screen time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
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
            <Button variant="outline" size="sm" onClick={() => navigate("/parent/add-child")}>
              <Plus className="w-4 h-4 mr-1" />
              Add Child
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : children.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-card rounded-2xl border border-border/50"
            >
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display font-bold text-lg text-foreground mb-2">No children linked yet</h3>
              <p className="text-muted-foreground mb-6">Link your child's account to start monitoring their activity</p>
              <Button onClick={() => navigate("/parent/add-child")} className="gradient-hero">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Child
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {children.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ChildCard
                    name={child.name}
                    avatar={child.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${child.name}`}
                    screenTimeRemaining={child.screenTimeRemaining}
                    activityProgress={child.activityProgress}
                    isLocked={child.isLocked}
                    onGrantTime={() => handleGrantTime(child.id, child.name)}
                    onViewDetails={() => toast.info(`Viewing ${child.name}'s details`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
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
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/settings')}>
              <Settings className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
