import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Stethoscope, UserCircle, Mail, Lock, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthService, useAuth } from '../lib/auth';
import { UserRole } from '../types';
import { useToast } from '../hooks/use-toast';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import { motion, AnimatePresence } from 'framer-motion';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('receptionist');

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, profile } = await AuthService.signInWithPassword(email, password);
      login(AuthService.mapUser(user, profile));
      toast({
        title: '✓ Welcome back!',
        description: `Logged in as ${profile.name}`,
      });
    } catch (error: any) {
      toast({
        title: '✗ Login failed',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, profile } = await AuthService.register(
        email,
        password,
        name,
        role
      );
      login(AuthService.mapUser(user, profile));
      toast({
        title: '✓ Account created!',
        description: `Welcome to Direction, ${name}`,
      });
    } catch (error: any) {
      toast({
        title: '✗ Registration failed',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden bg-background/50">
      <AnimatedBackground />

      <div className="container relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Brand & Hero Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:block space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/40 ring-4 ring-white/50"
              >
                <Stethoscope className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-7xl font-black tracking-tight text-gradient">
                Direction
              </h1>
              <p className="text-2xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                Precision in Healthcare. <br />
                The next generation of clinic management.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: ShieldCheck, label: "HIPAA Compliant", desc: "Enterprise-grade security" },
                { icon: Activity, label: "Real-time Analytics", desc: "Live clinic monitoring" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="glass-card p-6 border-white/20"
                >
                  <item.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold text-foreground">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/20 group">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=600&fit=crop&q=90"
                alt="Modern clinic reception"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent flex items-end p-8">
                <p className="text-white font-medium text-lg drop-shadow-md">Trusted by 500+ clinics worldwide</p>
              </div>
            </div>
          </motion.div>

          {/* Auth Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent items-center justify-center shadow-xl mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-black text-gradient">Direction</h1>
            </div>

            <Card className="glass-card p-2 md:p-4 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient" />

              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {mode === 'login' ? 'Welcome back' : 'Join Direction'}
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  {mode === 'login'
                    ? 'Manage your practice with ease'
                    : 'Get started with the world\'s smartest clinic system'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                      {mode === 'register' && (
                        <div className="space-y-1.5">
                          <Label htmlFor="reg-name">Full Name</Label>
                          <div className="relative group">
                            <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                              id="reg-name"
                              placeholder="Dr. Sarah Johnson"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-11 h-12 bg-white/50 border-white/40 focus:bg-white transition-all rounded-xl"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative group">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="doctor@direction.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-11 h-12 bg-white/50 border-white/40 focus:bg-white transition-all rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      {mode === 'register' && (
                        <div className="space-y-1.5">
                          <Label htmlFor="role">Your Role</Label>
                          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                            <SelectTrigger className="h-12 bg-white/50 border-white/40 focus:bg-white rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-white/30 backdrop-blur-xl">
                              <SelectItem value="doctor" className="h-11">👨‍⚕️ Doctor / Practitioner</SelectItem>
                              <SelectItem value="receptionist" className="h-11">👩‍💼 Clinic Administration</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          {mode === 'login' && (
                            <Button variant="link" className="px-0 h-auto text-xs font-semibold text-primary">
                              Forgot password?
                            </Button>
                          )}
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-11 h-12 bg-white/50 border-white/40 focus:bg-white transition-all rounded-xl"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 shadow-xl shadow-primary/20 transition-all font-bold text-lg rounded-xl group"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                          </div>
                        )}
                      </Button>

                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-transparent px-2 text-muted-foreground font-bold">Or</span>
                        </div>
                      </div>

                      <div className="text-center text-sm">
                        <span className="text-muted-foreground font-medium">
                          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        </span>
                        <Button
                          type="button"
                          variant="link"
                          className="px-2 h-auto font-bold text-primary hover:text-accent decoration-2"
                          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        >
                          {mode === 'login' ? 'Register Now' : 'Sign In'}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Footer Trust */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Secure & HIPAA Compliant System
              </p>
              <p className="text-[10px] text-muted-foreground mt-2 opacity-60">
                © 2025 Direction Healthcare Systems. All rights reserved.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
