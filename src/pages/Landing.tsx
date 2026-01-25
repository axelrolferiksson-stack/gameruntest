import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Smartphone, Activity, Heart, Shield, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Activity,
    title: "Earn Screen Time",
    description: "Kids earn minutes by being active - walking, running, or playing outside.",
  },
  {
    icon: Shield,
    title: "Parent Control",
    description: "Full control over screen time limits and instant lock/unlock capabilities.",
  },
  {
    icon: Heart,
    title: "Healthy Habits",
    description: "Build lasting habits that balance technology with physical activity.",
  },
];

const benefits = [
  "Automatic activity tracking",
  "Real-time sync between devices",
  "Customizable challenges",
  "Reward system for kids",
  "Detailed activity reports",
  "No screen time without movement",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 lg:px-8">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full gradient-activity opacity-20 blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full gradient-reward opacity-20 blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-glass border border-border/50 mb-8"
            >
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Parental Screen Time Control</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Move More,</span>
              <br />
              <span className="text-gradient-hero">Screen More</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
              The smart parental control app that rewards kids with screen time 
              for staying active. No movement, no phone access.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/parent">
                <Button size="xl" variant="hero">
                  I'm a Parent
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/child">
                <Button size="xl" variant="outline">
                  I'm a Kid
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-[500px] bg-card rounded-[3rem] shadow-card border-8 border-foreground/10 overflow-hidden">
                <div className="h-full gradient-activity flex items-center justify-center">
                  <div className="text-center text-primary-foreground p-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
                    >
                      <Activity className="w-12 h-12" />
                    </motion.div>
                    <p className="font-display font-bold text-3xl mb-2">2,450</p>
                    <p className="text-sm opacity-80">steps today</p>
                    <p className="mt-4 font-semibold">+15 min earned!</p>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 gradient-activity opacity-30 blur-3xl -z-10 scale-150" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple system that encourages healthy habits while giving parents peace of mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border/50"
              >
                <div className="w-14 h-14 rounded-2xl gradient-activity flex items-center justify-center mb-6 shadow-glow-primary">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Everything you need to balance screen time
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                MoveTime combines parental controls with activity tracking to create 
                a healthy relationship between kids and their devices.
              </p>
              <ul className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full gradient-activity flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-foreground font-medium">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl gradient-reward p-8 shadow-glow-secondary">
                <div className="h-full bg-card rounded-2xl p-6 flex flex-col justify-center">
                  <div className="text-center">
                    <div className="font-display text-6xl font-bold text-gradient-hero mb-4">
                      85%
                    </div>
                    <p className="text-muted-foreground">
                      of parents report their kids are more active after using MoveTime
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl gradient-hero rounded-3xl p-12 text-center shadow-glow-primary"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to get your kids moving?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of families who have transformed screen time into active time.
          </p>
          <Link to="/parent">
            <Button size="xl" variant="glass">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display font-bold text-xl text-foreground">
            Move<span className="text-primary">Time</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MoveTime. Helping kids stay active.
          </p>
        </div>
      </footer>
    </div>
  );
}
