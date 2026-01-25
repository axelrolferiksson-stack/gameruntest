import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Phone, BarChart3, MapPin, User, Copy, Check, Share2, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "offline";
  stepsToday: number;
}

const friends: Friend[] = [
  { id: "1", name: "Alex Johnson", username: "alexj", avatar: "A", status: "online", stepsToday: 8432 },
  { id: "2", name: "Emma Wilson", username: "emmaw", avatar: "E", status: "online", stepsToday: 12500 },
  { id: "3", name: "Marcus Lee", username: "marcusl", avatar: "M", status: "offline", stepsToday: 5621 },
  { id: "4", name: "Sophie Chen", username: "sophiec", avatar: "S", status: "online", stepsToday: 15234 },
];

const Friends = () => {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const shareLink = `gamerun.in/i/${profile?.display_name?.toLowerCase().replace(/\s/g, '') || "user"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <img src={logo} alt="GameRun" className="w-10 h-10" />
          <h1 className="font-display text-xl font-bold text-foreground">Friends</h1>
          <Button variant="ghost" size="icon" className="text-primary">
            <UserPlus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <h2 className="font-display font-semibold text-foreground mb-3">Search</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Type in username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-card border-border/50 rounded-xl h-12"
            />
          </div>
        </div>

        {/* Find Contacts */}
        <div className="mb-6">
          <h2 className="font-display font-semibold text-foreground mb-3">Find Contacts</h2>
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-card border border-border/50 flex items-center justify-center"
            >
              <Phone className="w-6 h-6 text-muted-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-card border border-border/50 flex items-center justify-center"
            >
              <BarChart3 className="w-6 h-6 text-muted-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-card border border-border/50 flex items-center justify-center"
            >
              <MapPin className="w-6 h-6 text-muted-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full gradient-activity flex items-center justify-center"
            >
              <User className="w-6 h-6 text-primary-foreground" />
            </motion.button>
          </div>
          <Button variant="outline" className="w-full rounded-xl h-12 border-primary text-primary">
            Add Contacts
          </Button>
        </div>

        {/* Share Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 border border-border/50 mb-6"
        >
          <h2 className="font-display font-semibold text-foreground mb-3">Share Link</h2>
          <p className="text-sm text-muted-foreground mb-4">Get your friends to join you!</p>
          
          <div className="flex gap-4 mb-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-2xl bg-[#FFFC00] flex items-center justify-center"
            >
              <span className="text-2xl">👻</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-2xl gradient-activity flex items-center justify-center"
            >
              <MessageCircle className="w-7 h-7 text-primary-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center"
            >
              <span className="text-2xl">📱</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center"
            >
              <Share2 className="w-6 h-6 text-foreground" />
            </motion.button>
          </div>

          <div className="flex items-center gap-2 bg-muted rounded-xl p-3">
            <span className="flex-1 text-sm text-muted-foreground truncate">{shareLink}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </motion.div>

        {/* Friends List */}
        <div>
          <h2 className="font-display font-semibold text-foreground mb-4">
            Your Friends ({friends.length})
          </h2>
          <div className="space-y-3">
            {filteredFriends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-4 flex items-center gap-4 border border-border/50"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full gradient-activity flex items-center justify-center text-lg font-bold text-primary-foreground">
                    {friend.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${
                    friend.status === "online" ? "bg-green-500" : "bg-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{friend.name}</p>
                  <p className="text-sm text-muted-foreground">@{friend.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold gradient-reward text-transparent bg-clip-text">
                    {friend.stepsToday.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">steps today</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Friends;
