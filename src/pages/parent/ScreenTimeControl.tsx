import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Gift, Tv, Plus, Minus, History } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChildProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

interface ScreenTimeBalance {
  minutes_remaining: number;
}

export default function ScreenTimeControl() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [balance, setBalance] = useState<ScreenTimeBalance | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (childId) {
      fetchChildData();
    }
  }, [childId]);

  const fetchChildData = async () => {
    try {
      setLoading(true);
      
      // Fetch child profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .eq("id", childId)
        .single();
      
      if (profileError) throw profileError;
      setChild(profileData);

      // Fetch screen time balance
      const { data: balanceData } = await supabase
        .from("screen_time_balance")
        .select("minutes_remaining")
        .eq("user_id", childId)
        .maybeSingle();
      
      setBalance(balanceData || { minutes_remaining: 0 });
    } catch (error) {
      console.error("Error fetching child data:", error);
      toast.error("Failed to load child data");
      navigate("/parent");
    } finally {
      setLoading(false);
    }
  };

  const handleGrantTime = async (minutes: number) => {
    if (!childId || !balance) return;
    
    try {
      setSaving(true);
      const newBalance = balance.minutes_remaining + minutes;
      
      const { error } = await supabase
        .from("screen_time_balance")
        .upsert({
          user_id: childId,
          minutes_remaining: newBalance,
          last_updated: new Date().toISOString(),
        }, { onConflict: "user_id" });
      
      if (error) throw error;
      
      setBalance({ minutes_remaining: newBalance });
      toast.success(`Added ${minutes} minutes to ${child?.display_name}'s balance!`);
      setCustomAmount("");
    } catch (error) {
      console.error("Error granting time:", error);
      toast.error("Failed to grant screen time");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTime = async (minutes: number) => {
    if (!childId || !balance) return;
    
    try {
      setSaving(true);
      const newBalance = Math.max(0, balance.minutes_remaining - minutes);
      
      const { error } = await supabase
        .from("screen_time_balance")
        .upsert({
          user_id: childId,
          minutes_remaining: newBalance,
          last_updated: new Date().toISOString(),
        }, { onConflict: "user_id" });
      
      if (error) throw error;
      
      setBalance({ minutes_remaining: newBalance });
      toast.success(`Removed ${minutes} minutes from ${child?.display_name}'s balance`);
      setCustomAmount("");
    } catch (error) {
      console.error("Error removing time:", error);
      toast.error("Failed to remove screen time");
    } finally {
      setSaving(false);
    }
  };

  const hours = Math.floor((balance?.minutes_remaining || 0) / 60);
  const mins = (balance?.minutes_remaining || 0) % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/parent")}
            className="text-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-display font-bold text-lg text-foreground">Screen Time Control</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-4 pt-6">
        {/* Child Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <img
            src={child?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${child?.display_name}`}
            alt={child?.display_name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/30"
          />
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">{child?.display_name}</h2>
            <p className="text-muted-foreground text-sm">Managing screen time</p>
          </div>
        </motion.div>

        {/* Current Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="neon-border gradient-hero overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-primary-foreground/80">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Current Balance</span>
              </div>
              <p className="font-display font-bold text-4xl text-primary-foreground">{timeDisplay}</p>
              <p className="text-primary-foreground/70 text-sm mt-1">{balance?.minutes_remaining || 0} minutes total</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Grant Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="font-display font-semibold text-lg text-foreground mb-3">Quick Add</h3>
          <div className="grid grid-cols-3 gap-3">
            {[15, 30, 60].map((mins) => (
              <motion.button
                key={mins}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={saving}
                onClick={() => handleGrantTime(mins)}
                className="p-4 rounded-2xl text-center neon-border transition-all bg-card hover:bg-primary/10"
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Plus className="w-4 h-4 text-primary" />
                  <p className="font-display font-bold text-xl text-primary">{mins}</p>
                </div>
                <p className="text-xs text-muted-foreground">minutes</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Custom Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="font-display font-semibold text-lg text-foreground mb-3">Custom Amount</h3>
          <Card className="neon-border">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-amount" className="text-muted-foreground text-sm mb-2 block">
                    Enter minutes
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="custom-amount"
                      type="number"
                      min={1}
                      placeholder="e.g. 45"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="flex-1 bg-background/50 border-border/50 text-foreground text-lg font-display"
                    />
                    <span className="flex items-center text-muted-foreground">min</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!customAmount || parseInt(customAmount) < 1 || saving || parseInt(customAmount) > (balance?.minutes_remaining || 0)}
                    onClick={() => handleRemoveTime(parseInt(customAmount))}
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                  <Button
                    className="w-full gradient-hero text-primary-foreground font-semibold"
                    disabled={!customAmount || parseInt(customAmount) < 1 || saving}
                    onClick={() => handleGrantTime(parseInt(customAmount))}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-muted/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Tv className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">How Screen Time Works</p>
                  <p className="text-xs text-muted-foreground">
                    Your child earns screen time through physical activity. You can also grant bonus time as a reward or remove time if needed. They can activate their earned time from the Pass page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
