import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Square, MapPin, Clock, Tv, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { healthKitService } from "@/services/healthKit";
import { supabase } from "@/integrations/supabase/client";

interface PassSession {
  startTime: Date;
  startDistance: number;
}

export default function Pass() {
  const [isActive, setIsActive] = useState(false);
  const [session, setSession] = useState<PassSession | null>(null);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const distanceRef = useRef<NodeJS.Timeout | null>(null);
  
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Calculate earned screen time: 100m = 1 minute
  const distanceTraveled = session ? currentDistance - session.startDistance : 0;
  const earnedMinutes = Math.floor(distanceTraveled / 100);

  // Request HealthKit permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      const granted = await healthKitService.requestAuthorization();
      setHasPermission(granted);
      if (!granted) {
        toast.error("HealthKit permission required", {
          description: "Please enable Health access in Settings",
        });
      }
    };
    requestPermission();
  }, []);

  // Timer for elapsed time
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Poll distance updates
  useEffect(() => {
    if (isActive) {
      const updateDistance = async () => {
        const data = await healthKitService.getTodayData();
        setCurrentDistance(data.distance);
      };
      updateDistance();
      distanceRef.current = setInterval(updateDistance, 3000); // Update every 3s
    }
    return () => {
      if (distanceRef.current) clearInterval(distanceRef.current);
    };
  }, [isActive]);

  const handleStart = useCallback(async () => {
    if (!hasPermission) {
      const granted = await healthKitService.requestAuthorization();
      setHasPermission(granted);
      if (!granted) {
        toast.error("Cannot start without HealthKit permission");
        return;
      }
    }

    const data = await healthKitService.getTodayData();
    setSession({
      startTime: new Date(),
      startDistance: data.distance,
    });
    setCurrentDistance(data.distance);
    setElapsedSeconds(0);
    setIsActive(true);
    toast.success("Pass started! Get moving!");
  }, [hasPermission]);

  const handleEnd = useCallback(async () => {
    if (!session || !profile) return;
    
    setIsActive(false);
    setSaving(true);

    const endTime = new Date();
    const finalDistance = distanceTraveled;
    const finalEarnedMinutes = Math.floor(finalDistance / 100);

    try {
      // Save activity log
      const { error: logError } = await supabase.from("activity_logs").insert({
        user_id: profile.id,
        steps: 0,
        distance_meters: finalDistance,
        active_minutes: Math.floor(elapsedSeconds / 60),
        screen_time_earned: finalEarnedMinutes,
        logged_at: new Date().toISOString().split("T")[0],
      });

      if (logError) throw logError;

      // Update screen time balance
      const { data: balanceData } = await supabase
        .from("screen_time_balance")
        .select("*")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (balanceData) {
        await supabase
          .from("screen_time_balance")
          .update({
            minutes_remaining: balanceData.minutes_remaining + finalEarnedMinutes,
            last_updated: new Date().toISOString(),
          })
          .eq("user_id", profile.id);
      } else {
        await supabase.from("screen_time_balance").insert({
          user_id: profile.id,
          minutes_remaining: finalEarnedMinutes,
        });
      }

      toast.success(`Pass complete! Earned ${finalEarnedMinutes} minutes`);
      setSession(null);
      setElapsedSeconds(0);
    } catch (error) {
      console.error("Error saving pass:", error);
      toast.error("Failed to save pass data");
    } finally {
      setSaving(false);
    }
  }, [session, profile, distanceTraveled, elapsedSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 gradient-glass border-b border-border/50">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate("/child")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center font-display font-bold text-xl text-foreground">
            Activity Pass
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-8">
        {/* Permission Warning */}
        {hasPermission === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">
              HealthKit access required. Please enable in device Settings.
            </p>
          </motion.div>
        )}

        {/* Timer Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="font-display font-bold text-6xl text-foreground mb-2">
            {formatTime(elapsedSeconds)}
          </div>
          <p className="text-muted-foreground">
            {isActive ? "Pass Active" : "Ready to start"}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="font-display font-bold text-2xl text-foreground">
                {(distanceTraveled / 1000).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">km traveled</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Tv className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <p className="font-display font-bold text-2xl text-foreground">
                {earnedMinutes}
              </p>
              <p className="text-xs text-muted-foreground">min earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Info */}
        <Card className="mb-8 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Next minute at</span>
              <span className="font-display font-bold text-foreground">
                {((earnedMinutes + 1) * 100 - distanceTraveled).toFixed(0)}m
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${(distanceTraveled % 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Start/End Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {!isActive ? (
            <Button
              onClick={handleStart}
              disabled={hasPermission === false}
              className="w-full h-16 text-lg font-display font-bold gradient-hero"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Pass
            </Button>
          ) : (
            <Button
              onClick={handleEnd}
              disabled={saving}
              variant="destructive"
              className="w-full h-16 text-lg font-display font-bold"
            >
              <Square className="w-6 h-6 mr-2" />
              {saving ? "Saving..." : "End Pass"}
            </Button>
          )}
        </motion.div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-1">100 meters = 1 minute screen time</p>
          <p>Walk or run to earn more!</p>
        </div>
      </main>
    </div>
  );
}
