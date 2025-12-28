import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import { useAppStore } from '../stores/appStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Clock, CheckCircle, Users, User, Phone, MapPin, Stethoscope, Activity, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import PatientDetailsModal from '../components/features/PatientDetailsModal';
import { Patient } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface DoctorDashboardProps {
  onNavigateProfile?: () => void;
}

export default function DoctorDashboard({ onNavigateProfile }: DoctorDashboardProps) {
  const { getTodayPatients, getPatientsByStatus, fetchPatients, loading } = useAppStore();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const todayPatients = getTodayPatients();
  const waitingPatients = getPatientsByStatus('waiting');
  const inConsultation = getPatientsByStatus('in-consultation');
  const completedToday = todayPatients.filter(p => p.status === 'completed' || p.status === 'billed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-amber-100 text-amber-700 ring-amber-600/30';
      case 'in-consultation':
        return 'bg-blue-100 text-blue-700 ring-blue-600/30';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 ring-emerald-600/30';
      case 'billed':
        return 'bg-purple-100 text-purple-700 ring-purple-600/30';
      default:
        return 'bg-gray-100 text-gray-700 ring-gray-600/30';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative min-h-screen bg-background/50">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header onNavigateProfile={onNavigateProfile} />

        <motion.main
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="glass-card p-8 md:p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                <Stethoscope className="w-full h-full text-primary" strokeWidth={0.5} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    <Activity className="w-3 h-3" />
                    Doctor's Portal
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                    Welcome back, <span className="text-gradient">Doctor</span>
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Calendar className="w-5 h-5" />
                    <p className="text-lg">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="h-44 w-full md:w-80 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/50 group-hover:ring-primary/20 transition-all duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=400&fit=crop&q=90"
                    alt="Doctor consultation"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {[
              { label: 'Waiting Queue', count: waitingPatients.length, icon: Clock, color: 'amber', desc: 'Patients in queue', trend: TrendingUp },
              { label: 'In Consultation', count: inConsultation.length, icon: Stethoscope, color: 'blue', desc: 'Currently consulting', trend: Activity },
              { label: 'Completed Today', count: completedToday.length, icon: CheckCircle, color: 'emerald', desc: 'Consultations finished', trend: CheckCircle }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`stat-card border-l-8 border-l-${stat.color}-500 group`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${stat.color}-500/10 to-transparent rounded-bl-full transition-transform group-hover:scale-125`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</CardTitle>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-500 transition-transform group-hover:rotate-12`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-5xl font-black text-${stat.color}-600 mb-2`}>{stat.count}</div>
                  <p className="text-sm text-muted-foreground font-semibold flex items-center gap-1.5 uppercase tracking-wide">
                    <stat.trend className="w-4 h-4" />
                    {stat.desc}
                  </p>
                </CardContent>
              </motion.div>
            ))}
          </motion.div>

          {/* Today's Queue */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-white/50 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-transparent border-b border-white/40 p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-black tracking-tight">Today's Patient Queue</CardTitle>
                    <CardDescription className="text-base font-medium opacity-80">
                      Manage consultations and digital patient records
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 border border-white/50 shadow-sm backdrop-blur-md">
                    <Users className="w-6 h-6 text-primary" />
                    <span className="font-black text-2xl text-foreground">{todayPatients.length}</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Registered</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {loading ? (
                  <div className="text-center py-24">
                    <div className="w-20 h-20 border-8 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6 shadow-2xl"></div>
                    <p className="text-xl text-muted-foreground font-bold animate-pulse">Syncing patient records...</p>
                  </div>
                ) : todayPatients.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-[2rem] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center shadow-inner">
                      <Users className="w-16 h-16 text-muted-foreground opacity-30" />
                    </div>
                    <p className="text-2xl font-black text-muted-foreground">The queue is empty</p>
                    <p className="text-muted-foreground font-medium mt-2">New registrations will appear here in real-time</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <AnimatePresence>
                      {todayPatients.map((patient, index) => (
                        <motion.div
                          key={patient.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="patient-card group hover:bg-white/80"
                        >
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6 flex-1 min-w-0">
                              <div className="token-badge w-14 h-14 !rounded-2xl shrink-0 cursor-default">
                                {patient.tokenNumber}
                              </div>

                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-4 flex-wrap">
                                  <h3 className="font-black text-2xl text-foreground group-hover:text-primary transition-colors">{patient.name}</h3>
                                  <span className={`status-badge ${getStatusColor(patient.status)}`}>
                                    {patient.status.replace('-', ' ')}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-semibold">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    <span>{patient.age}y • {patient.gender}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-primary" />
                                    <span>{patient.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="truncate max-w-[200px]">{patient.address}</span>
                                  </div>
                                </div>

                                {patient.symptoms && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Activity className="w-4 h-4 text-primary mt-1" />
                                      <p className="text-sm font-medium leading-relaxed">
                                        <span className="font-black uppercase tracking-widest text-[10px] text-primary block mb-1">Chief Complaint</span>
                                        {patient.symptoms}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0 w-full md:w-auto">
                              <Button
                                onClick={() => setSelectedPatient(patient)}
                                size="lg"
                                className="w-full md:w-auto px-8 h-14 rounded-2xl bg-gradient-to-r from-primary to-accent shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-bold group/btn"
                              >
                                <Stethoscope className="w-5 h-5 mr-3 transition-transform group-hover/btn:rotate-12" />
                                Start Consultation
                                <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.main>
      </div>

      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
