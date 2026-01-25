import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/BottomNav";
import { Settings, Edit2, Camera, Star, Clock, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface ParentInfo {
  id: string;
  name: string;
  avatar: string | null;
}

const Profile = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [parentInfo, setParentInfo] = useState<ParentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);

  const stats = [
    { label: "Total Steps", value: "124,500", icon: "👟" },
    { label: "Challenges Won", value: "12", icon: "🏆" },
    { label: "Friends", value: "8", icon: "👥" },
    { label: "Screen Time", value: "42h", icon: "📱" },
  ];

  const level = 12;
  const xp = 2450;
  const xpToNext = 3000;
  const xpProgress = (xp / xpToNext) * 100;

  useEffect(() => {
    if (profile?.id) {
      fetchParentInfo();
      checkPendingRequest();

      // Subscribe to realtime updates for parent-child links
      const channel = supabase
        .channel('parent-child-links')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'parent_child_links',
            filter: `child_id=eq.${profile.id}`,
          },
          () => {
            fetchParentInfo();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile?.id]);

  const fetchParentInfo = async () => {
    if (!profile?.id) return;

    try {
      // Find parent linked to this child
      const { data: link, error: linkError } = await supabase
        .from("parent_child_links")
        .select("parent_id")
        .eq("child_id", profile.id)
        .maybeSingle();

      if (linkError) {
        console.error("Error fetching parent link:", linkError);
        setLoading(false);
        return;
      }

      if (!link) {
        setLoading(false);
        return;
      }

      // Fetch parent profile
      const { data: parentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .eq("id", link.parent_id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching parent profile:", profileError);
        setLoading(false);
        return;
      }

      if (parentProfile) {
        setParentInfo({
          id: parentProfile.id,
          name: parentProfile.display_name,
          avatar: parentProfile.avatar_url,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPendingRequest = async () => {
    if (!profile?.id) return;

    const { data } = await supabase
      .from("screen_time_requests")
      .select("id")
      .eq("child_id", profile.id)
      .eq("status", "pending")
      .maybeSingle();

    setPendingRequest(!!data);
  };

  const handleAskForTime = async () => {
    if (!profile?.id || !parentInfo?.id) return;

    setRequesting(true);
    try {
      const { error } = await supabase
        .from("screen_time_requests")
        .insert({
          child_id: profile.id,
          parent_id: parentInfo.id,
          requested_minutes: 15,
          status: "pending",
        });

      if (error) throw error;

      toast.success("Request sent!", {
        description: "Your parent will see your request for 15 minutes.",
      });
      setPendingRequest(true);
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

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
                  <h1 className="font-display text-2xl font-bold text-foreground">{profile?.display_name || "User"}</h1>
                  <p className="text-muted-foreground text-sm">
                    @{profile?.display_name?.toLowerCase().replace(/\s/g, "") || "user"}
                  </p>
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
                  <span className="text-xs text-primary">
                    {xp} / {xpToNext} XP
                  </span>
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
                    <p className="text-xl font-bold text-primary mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Parent Account Section */}
      <div className="px-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">My Parent</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !parentInfo ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 bg-card rounded-2xl border border-border/50"
          >
            <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-display font-bold text-foreground mb-2">No parent linked</h3>
            <p className="text-sm text-muted-foreground">Ask your parent to link your account</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-5 shadow-card neon-border"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <motion.div
                  className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center text-xl font-bold text-primary-foreground"
                  whileHover={{ scale: 1.05 }}
                >
                  {parentInfo.name.charAt(0).toUpperCase()}
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg text-foreground">{parentInfo.name}</h3>
                <p className="text-sm text-muted-foreground">Parent Account</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 gradient-activity hover:opacity-90"
                onClick={handleAskForTime}
                disabled={requesting || pendingRequest}
              >
                {requesting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 mr-2" />
                )}
                {pendingRequest ? "Request Pending" : "Ask for Screen Time"}
              </Button>
            </div>

            {pendingRequest && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                You have a pending request. Wait for your parent to respond.
              </p>
            )}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;