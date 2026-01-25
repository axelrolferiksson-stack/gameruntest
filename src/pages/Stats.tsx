import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Footprints, Timer, MapPin, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import logo from "@/assets/logo.png";
import { useState } from "react";

const weeklyData = [
  { day: "Mon", steps: 8432, distance: 6.2, screenTime: 45 },
  { day: "Tue", steps: 12500, distance: 9.1, screenTime: 60 },
  { day: "Wed", steps: 5621, distance: 4.1, screenTime: 30 },
  { day: "Thu", steps: 15234, distance: 11.2, screenTime: 75 },
  { day: "Fri", steps: 9876, distance: 7.3, screenTime: 50 },
  { day: "Sat", steps: 18432, distance: 13.5, screenTime: 90 },
  { day: "Sun", steps: 7654, distance: 5.6, screenTime: 40 },
];

const monthlyData = [
  { week: "W1", steps: 65000, distance: 48, screenTime: 320 },
  { week: "W2", steps: 72000, distance: 53, screenTime: 360 },
  { week: "W3", steps: 58000, distance: 42, screenTime: 290 },
  { week: "W4", steps: 81000, distance: 59, screenTime: 405 },
];

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, unit, change, icon }: StatCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 border border-border/50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl gradient-activity flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{unit}</p>
      <p className="text-xs text-muted-foreground mt-1">{title}</p>
    </motion.div>
  );
};

const Stats = () => {
  const [period, setPeriod] = useState("week");

  const data = period === "week" ? weeklyData : monthlyData;
  const xKey = period === "week" ? "day" : "week";

  const totalSteps = data.reduce((sum, d) => sum + d.steps, 0);
  const totalDistance = data.reduce((sum, d) => sum + d.distance, 0);
  const totalScreenTime = data.reduce((sum, d) => sum + d.screenTime, 0);
  const avgSteps = Math.round(totalSteps / data.length);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <img src={logo} alt="GameRun" className="w-10 h-10" />
          <h1 className="font-display text-xl font-bold text-foreground">Statistics</h1>
          <div className="w-10" />
        </div>

        {/* Period Tabs */}
        <Tabs value={period} onValueChange={setPeriod} className="w-full mb-6">
          <TabsList className="grid grid-cols-3 w-full bg-card border border-border/50">
            <TabsTrigger value="week" className="data-[state=active]:gradient-activity data-[state=active]:text-primary-foreground">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:gradient-activity data-[state=active]:text-primary-foreground">
              Month
            </TabsTrigger>
            <TabsTrigger value="year" className="data-[state=active]:gradient-activity data-[state=active]:text-primary-foreground">
              Year
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            title="Total Steps"
            value={totalSteps.toLocaleString()}
            unit="steps"
            change={12}
            icon={<Footprints className="w-5 h-5 text-primary-foreground" />}
          />
          <StatCard
            title="Distance"
            value={totalDistance.toFixed(1)}
            unit="kilometers"
            change={8}
            icon={<MapPin className="w-5 h-5 text-primary-foreground" />}
          />
          <StatCard
            title="Screen Time"
            value={`${Math.floor(totalScreenTime / 60)}h ${totalScreenTime % 60}m`}
            unit="earned"
            change={15}
            icon={<Timer className="w-5 h-5 text-primary-foreground" />}
          />
          <StatCard
            title="Avg Steps/Day"
            value={avgSteps.toLocaleString()}
            unit="per day"
            change={-3}
            icon={<Trophy className="w-5 h-5 text-primary-foreground" />}
          />
        </div>

        {/* Steps Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 border border-border/50 mb-6"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">Steps Overview</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey={xKey} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="steps"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#stepsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Screen Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 border border-border/50"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">Screen Time Earned</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                  dataKey={xKey} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis hide />
                <Line
                  type="monotone"
                  dataKey="screenTime"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Stats;
