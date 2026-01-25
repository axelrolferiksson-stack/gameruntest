import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Heart, 
  Bell, 
  Moon, 
  Shield, 
  HelpCircle,
  ChevronRight,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { healthKitService } from "@/services/healthKit";
import { notificationService } from "@/services/notifications";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

function SettingItem({ icon, title, description, action, onClick }: SettingItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action || (onClick && <ChevronRight className="w-5 h-5 text-muted-foreground" />)}
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [healthKitEnabled, setHealthKitEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isHealthKitAvailable] = useState(healthKitService.isAvailable());

  useEffect(() => {
    // Check if HealthKit was previously authorized
    const checkHealthKitStatus = async () => {
      if (isHealthKitAvailable) {
        // In a real app, we'd check the actual authorization status
        const storedStatus = localStorage.getItem('healthkit_enabled');
        setHealthKitEnabled(storedStatus === 'true');
      }
    };

    // Check notification status
    const checkNotificationStatus = () => {
      if ('Notification' in window) {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    };

    checkHealthKitStatus();
    checkNotificationStatus();
  }, [isHealthKitAvailable]);

  const handleHealthKitToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        const authorized = await healthKitService.requestAuthorization();
        if (authorized) {
          setHealthKitEnabled(true);
          localStorage.setItem('healthkit_enabled', 'true');
          toast.success('HealthKit enabled!', {
            description: 'Your activity data will now be tracked.',
          });
        } else {
          toast.error('HealthKit access denied', {
            description: 'Please enable HealthKit in your device settings.',
          });
        }
      } catch (error) {
        toast.error('Failed to enable HealthKit', {
          description: 'Please try again or check your device settings.',
        });
      }
    } else {
      setHealthKitEnabled(false);
      localStorage.setItem('healthkit_enabled', 'false');
      toast.success('HealthKit disabled');
    }
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        toast.success('Notifications enabled!');
      } else {
        toast.error('Notification permission denied');
      }
    } else {
      setNotificationsEnabled(false);
      toast.success('Notifications disabled');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 gradient-glass border-b border-border/50">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-bold text-xl text-foreground">Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-8">
        {/* Health & Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
            Health & Activity
          </h2>
          <div className="space-y-3">
            <SettingItem
              icon={<Heart className="w-5 h-5" />}
              title="HealthKit"
              description={isHealthKitAvailable ? "Track steps, distance & activity" : "Only available on iOS devices"}
              action={
                <Switch
                  checked={healthKitEnabled}
                  onCheckedChange={handleHealthKitToggle}
                  disabled={!isHealthKitAvailable}
                />
              }
            />
            <SettingItem
              icon={<Activity className="w-5 h-5" />}
              title="Activity Goals"
              description="Set your daily step target"
              onClick={() => toast.info('Coming soon!')}
            />
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
            Notifications
          </h2>
          <div className="space-y-3">
            <SettingItem
              icon={<Bell className="w-5 h-5" />}
              title="Push Notifications"
              description="Get alerts for challenges & reminders"
              action={
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationsToggle}
                />
              }
            />
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
            Appearance
          </h2>
          <div className="space-y-3">
            <SettingItem
              icon={<Moon className="w-5 h-5" />}
              title="Dark Mode"
              description="Always on"
              action={
                <Switch checked={true} disabled />
              }
            />
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
            Support
          </h2>
          <div className="space-y-3">
            <SettingItem
              icon={<Shield className="w-5 h-5" />}
              title="Privacy Policy"
              onClick={() => toast.info('Coming soon!')}
            />
            <SettingItem
              icon={<HelpCircle className="w-5 h-5" />}
              title="Help & Support"
              onClick={() => toast.info('Coming soon!')}
            />
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-muted-foreground text-sm"
        >
          <p>GameRun v1.0.0</p>
        </motion.div>
      </main>
    </div>
  );
}
