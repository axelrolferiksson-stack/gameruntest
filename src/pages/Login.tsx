import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, User, ArrowLeft, Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type UserType = 'parent' | 'child' | null;
type AuthMode = 'select' | 'login' | 'signup';

export default function Login() {
  const [userType, setUserType] = useState<UserType>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSelectType = (type: UserType) => {
    setUserType(type);
    setAuthMode('login');
  };

  const handleBack = () => {
    if (authMode === 'signup') {
      setAuthMode('login');
    } else {
      setUserType(null);
      setAuthMode('select');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        const { error } = await signUp(email, password, displayName, userType!);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created successfully!');
          navigate(userType === 'parent' ? '/parent' : '/child');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back!');
          navigate(userType === 'parent' ? '/parent' : '/child');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full gradient-activity opacity-20 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full gradient-reward opacity-20 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-activity flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Move<span className="text-primary">Time</span>
          </h1>
          <p className="text-muted-foreground mt-2">Move more, screen more</p>
        </motion.div>

        {/* Back button */}
        {authMode !== 'select' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>
        )}

        {/* Select User Type */}
        {authMode === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-center text-xl font-semibold text-foreground mb-6">
              Who are you?
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectType('parent')}
              className="w-full p-6 rounded-2xl bg-card border border-border/50 shadow-card flex items-center gap-4 text-left hover:border-primary/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">I'm a Parent</h3>
                <p className="text-sm text-muted-foreground">Manage your children's screen time</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectType('child')}
              className="w-full p-6 rounded-2xl bg-card border border-border/50 shadow-card flex items-center gap-4 text-left hover:border-primary/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl gradient-activity flex items-center justify-center">
                <User className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">I'm a Kid</h3>
                <p className="text-sm text-muted-foreground">Track activity & earn screen time</p>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Login/Signup Form */}
        {authMode !== 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
          >
            <h2 className="text-center text-xl font-semibold text-foreground mb-6">
              {authMode === 'login' ? 'Welcome back!' : 'Create your account'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              {authMode === 'login' ? (
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
