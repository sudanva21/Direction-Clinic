import { Button } from '../ui/button';
import { LogOut, Stethoscope, User, Settings } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface HeaderProps {
  onNavigateProfile?: () => void;
}

export default function Header({ onNavigateProfile }: HeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="relative z-10 border-b border-border/40 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-white/50 transition-transform hover:scale-110">
              <Stethoscope className="w-7 h-7 text-white" />
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-20 blur-md animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">Direction</h1>
              <p className="text-xs text-muted-foreground font-medium">Clinic Management System</p>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              onClick={onNavigateProfile}
              className="group hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onNavigateProfile}
                className="sm:hidden rounded-xl border border-border/50 hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Settings className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 h-10 px-4 rounded-xl border-border/50 shadow-sm hover:shadow-md hover:border-red-200 hover:text-red-600 transition-all font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
