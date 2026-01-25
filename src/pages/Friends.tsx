import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Phone, BarChart3, MapPin, User, Copy, Check, Share2, MessageCircle, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-white.png";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "offline";
  stepsToday: number;
  rank: number;
}

const friends: Friend[] = [
  { id: "1", name: "Alex Johnson", username: "alexj", avatar: "A", status: "online", stepsToday: 18432, rank: 1 },
  { id: "2", name: "Emma Wilson", username: "emmaw", avatar: "E", status: "online", stepsToday: 15500, rank: 2 },
  { id: "3", name: "Marcus Lee", username: "marcusl", avatar: "M", status: "offline", stepsToday: 12621, rank: 3 },
  { id: "4", name: "Sophie Chen", username: "sophiec", avatar: "S", status: "online", stepsToday: 9234, rank: 4 },
];

const Friends = () => {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const shareLink = `gamerun.in/i/${profile?.display_name?.toLowerCase().replace(/\s/g, '') || "user"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied! Share with friends 🎉");
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative">
        <motion.div
          className="absolute top-10 right-0 w-48 h-48 rounded-full gradient-activity opacity-15 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <div className="px-6 pt-12">
          <div className="flex items-center justify-between mb-6">
            <Link to="/child" className="hover:opacity-80 transition-opacity">
              <motion.img 
                src={logo} 
                alt="GameRun" 
                className="w-10 h-10 drop-shadow-[0_0_10px_hsl(200,100%,50%)]" 
                whileHover={{ scale: 1.1 }}
              />
            </Link>
            <h1 className="font-display text-xl font-bold text-foreground">Friends</h1>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/20">
                <UserPlus className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-card neon-border rounded-xl h-12 focus:shadow-glow-primary transition-shadow"
              />
            </div>
          </motion.div>

          {/* Invite Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Invite Friends
            </h2>
            <div className="flex items-center gap-3 mb-4">
              {[
                { icon: Phone, label: "Contacts", gradient: false },
                { icon: MessageCircle, label: "Message", gradient: true },
                { icon: Share2, label: "Share", gradient: false },
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    item.gradient ? 'gradient-activity shadow-glow-primary' : 'bg-card neon-border'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${item.gradient ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Share Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-5 neon-border mb-6"
          >
            <h2 className="font-display font-semibold text-foreground mb-2">Your Invite Link</h2>
            <p className="text-sm text-muted-foreground mb-4">Share and earn bonus screen time when friends join! 🎁</p>
            
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-3 neon-border">
              <span className="flex-1 text-sm text-muted-foreground truncate font-mono">{shareLink}</span>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  className={`shrink-0 ${copied ? 'bg-green-500/20 text-green-400' : 'gradient-activity text-primary-foreground'}`}
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Leaderboard / Friends List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Today's Leaderboard
              </h2>
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                {friends.length} friends
              </span>
            </div>
            <div className="space-y-3">
              {filteredFriends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.01 }}
                  className={`bg-card rounded-2xl p-4 flex items-center gap-4 neon-border cursor-pointer ${
                    friend.rank === 1 ? 'ring-2 ring-primary/30' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center">
                    <span className="text-lg">{getRankEmoji(friend.rank)}</span>
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative">
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-primary-foreground ${
                        friend.rank === 1 ? 'gradient-hero shadow-glow-primary' : 'gradient-activity'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {friend.avatar}
                    </motion.div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${
                      friend.status === "online" ? "bg-green-500" : "bg-muted-foreground"
                    }`} />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">@{friend.username}</p>
                  </div>
                  
                  {/* Steps */}
                  <div className="text-right">
                    <p className="font-bold text-primary flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {friend.stepsToday.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">steps</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredFriends.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <p className="text-muted-foreground">No friends found 🔍</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different search</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Friends;