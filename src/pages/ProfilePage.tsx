import { useState } from 'react';
import Header from '../components/layout/Header';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import { useAuth } from '../lib/auth.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, Shield, Camera, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';

export default function ProfilePage({ onBack }: { onBack: () => void }) {
    const { user, login } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            toast({
                title: '⚠ Name Required',
                description: 'Please enter your name.',
                variant: 'destructive',
            });
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ name })
                .eq('id', user?.id);

            if (error) throw error;

            if (user) {
                login({ ...user, name });
            }

            toast({
                title: '✓ Profile Updated',
                description: 'Your profile information has been saved successfully.',
            });
        } catch (error: any) {
            toast({
                title: '✗ Update Failed',
                description: error.message || 'Failed to update profile.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" } as any
        }
    };

    return (
        <div className="relative min-h-screen bg-background/50">
            <AnimatedBackground />
            <div className="relative z-10">
                <Header />

                <motion.main
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="container mx-auto px-4 py-12 flex justify-center"
                >
                    <div className="w-full max-w-2xl">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="mb-6 gap-2 hover:bg-white/50 transition-all font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>

                        <Card className="glass-card shadow-2xl border-white/40 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary animate-gradient" />

                            <CardHeader className="pb-8 pt-10 text-center relative">
                                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-white/50 shadow-xl mb-6 relative group overflow-hidden">
                                    <User className="w-12 h-12 text-primary" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <CardTitle className="text-4xl font-black text-foreground tracking-tight">Your <span className="text-gradient">Profile</span></CardTitle>
                                <CardDescription className="text-lg font-medium">Manage your professional clinic identity</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-8 px-8 pb-10">
                                <div className="grid gap-6">
                                    {/* Name Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="h-14 pl-12 rounded-2xl bg-white/50 border-white/40 focus:bg-white focus:ring-primary/20 transition-all text-lg font-medium"
                                                placeholder="Dr. John Doe"
                                            />
                                        </div>
                                    </div>

                                    {/* Email (Read Only) */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                value={user?.email}
                                                disabled
                                                className="h-14 pl-12 rounded-2xl bg-muted/30 border-white/20 text-muted-foreground cursor-not-allowed text-lg font-medium opacity-70"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 ml-1 flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            Verified professional account
                                        </p>
                                    </div>

                                    {/* Role (Read Only) */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Assigned Role</Label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                                            <Input
                                                value={user?.role?.toUpperCase()}
                                                disabled
                                                className="h-14 pl-12 rounded-2xl bg-muted/30 border-white/20 text-accent cursor-not-allowed text-lg font-black tracking-widest opacity-70"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving || name === user?.name}
                                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-2xl shadow-primary/20 text-lg font-black transition-all transform active:scale-[0.98] group"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" />
                                                Update Profile
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900 text-sm">Security Policy</h4>
                                        <p className="text-xs text-emerald-800/70 font-medium leading-relaxed">Your data is stored securely in our HIPAA-compliant database. Contact administration for role changes.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.main>
            </div>
        </div>
    );
}
