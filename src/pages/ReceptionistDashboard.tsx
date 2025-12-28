import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import { useAppStore } from '../stores/appStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Users, Clock, DollarSign, CheckCircle, TrendingUp, Activity, ChevronRight, UserPlus, CreditCard } from 'lucide-react';
import RegisterPatientModal from '../components/features/RegisterPatientModal';
import BillingModal from '../components/features/BillingModal';
import { Patient } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceptionistDashboardProps {
  onNavigateProfile?: () => void;
}

export default function ReceptionistDashboard({ onNavigateProfile }: ReceptionistDashboardProps) {
  const { getTodayPatients, getPatientsByStatus, fetchPatients, loading } = useAppStore();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPatientForBilling, setSelectedPatientForBilling] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const todayPatients = getTodayPatients();
  const waitingPatients = getPatientsByStatus('waiting');
  const completedPatients = todayPatients.filter(p => p.status === 'completed');
  const billedPatients = todayPatients.filter(p => p.status === 'billed');

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
          {/* Hero Section with Global Action */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="glass-card p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                <Users className="w-full h-full text-primary" strokeWidth={0.5} />
              </div>
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-10">
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    <Activity className="w-3 h-3" />
                    Reception Desk
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                    Quick <span className="text-gradient">Registry</span>
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium max-w-xl">
                    Streamline patient onboarding and manage daily clinic operations with precision.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowRegisterModal(true)}
                    className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 shadow-2xl shadow-primary/30 transition-all font-black text-lg group"
                  >
                    <UserPlus className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" />
                    Register New Patient
                    <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                <div className="h-48 w-full lg:w-96 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-white/50 hover:ring-primary/20 transition-all duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&h=400&fit=crop&q=90"
                    alt="Clinic reception desk"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Today\'s Total', count: todayPatients.length, icon: Users, color: 'primary', desc: 'Patients registered' },
              { label: 'In Queue', count: waitingPatients.length, icon: Clock, color: 'amber', desc: 'Waiting for Doctor' },
              { label: 'Completed', count: completedPatients.length, icon: CheckCircle, color: 'emerald', desc: 'Ready for billing' },
              { label: 'Billed', count: billedPatients.length, icon: DollarSign, color: 'purple', desc: 'Payments processed' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`stat-card border-l-4 border-l-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} group`}
              >
                <div className={`absolute -top-4 -right-4 w-24 h-24 bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 rounded-full blur-2xl transition-transform group-hover:scale-150`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</CardTitle>
                  <stat.icon className={`w-6 h-6 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} group-hover:scale-110 transition-transform`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-4xl font-black text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'} mb-1`}>{stat.count}</div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{stat.desc}</p>
                </CardContent>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Workspace Queue Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Current Queue */}
            <motion.div variants={itemVariants}>
              <Card className="glass-card shadow-xl overflow-hidden h-full">
                <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent border-b border-white/40 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight">Active Queue</CardTitle>
                      <CardDescription className="text-sm font-semibold">Patients awaiting consultation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto shadow-lg"></div>
                      <p className="text-sm font-bold text-muted-foreground animate-pulse">Updating queue...</p>
                    </div>
                  ) : waitingPatients.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed border-muted-foreground/20">
                      <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="font-bold text-muted-foreground opacity-50">Empty Queue</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {waitingPatients.map((patient, index) => (
                          <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 rounded-2xl border border-white/50 bg-white/40 hover:bg-white/60 hover:shadow-lg hover:border-amber-500/20 transition-all group"
                          >
                            <div className="token-badge !w-12 !h-12 !text-xs !bg-gradient-to-br from-amber-500 to-amber-600 !shadow-amber-500/20">
                              {patient.tokenNumber}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-foreground group-hover:text-amber-700 transition-colors uppercase tracking-tight">{patient.name}</p>
                              <p className="text-xs text-muted-foreground font-semibold line-clamp-1">{patient.symptoms || 'General Checkup'}</p>
                            </div>
                            <div className="shrink-0 p-2 rounded-xl bg-amber-50 text-amber-600">
                              <Activity className="w-4 h-4 animate-pulse" />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Pending Billing */}
            <motion.div variants={itemVariants}>
              <Card className="glass-card shadow-xl overflow-hidden h-full">
                <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-white/40 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight">Settlements</CardTitle>
                      <CardDescription className="text-sm font-semibold">Consultations awaiting payment</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {completedPatients.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed border-muted-foreground/20">
                      <CheckCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="font-bold text-muted-foreground opacity-50">No pending bills</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {completedPatients.map((patient, index) => (
                          <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 rounded-2xl border border-white/50 bg-white/40 hover:bg-white/60 hover:shadow-lg hover:border-emerald-500/20 transition-all group"
                          >
                            <div className="token-badge !w-12 !h-12 !text-xs !bg-gradient-to-br from-emerald-500 to-emerald-600 !shadow-emerald-500/20">
                              {patient.tokenNumber}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-foreground group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{patient.name}</p>
                              <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">{patient.prescription ? 'Prescription Ready' : 'Doc Consultation Complete'}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setSelectedPatientForBilling(patient)}
                              className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-black group/btn shrink-0"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              PAY
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Activity Summary */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-transparent border-b border-white/40 p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-2xl font-black tracking-tight">Today's Registry Activity</CardTitle>
                    <CardDescription className="font-semibold text-muted-foreground">Detailed log of all patients processed today</CardDescription>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white/40 border border-white/50 text-xs font-black uppercase tracking-widest text-primary">
                    Live Updates Active
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {todayPatients.length === 0 ? (
                  <div className="text-center py-20 p-8">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                      <Users className="w-10 h-10 text-muted-foreground opacity-20" />
                    </div>
                    <p className="text-xl font-bold text-muted-foreground">No patients logged today</p>
                    <p className="text-sm text-muted-foreground mt-1">Start by clicking the "Register New Patient" button above</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/30 text-left border-b border-white/20">
                        <tr>
                          <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">ID</th>
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Patient Name</th>
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Contact</th>
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {todayPatients.map((patient) => (
                          <tr key={patient.id} className="group hover:bg-white/50 transition-colors">
                            <td className="px-8 py-6">
                              <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary font-black text-sm border border-primary/10 group-hover:scale-110 transition-transform">
                                {patient.tokenNumber.replace('T', '')}
                              </span>
                            </td>
                            <td className="px-6 py-6">
                              <p className="font-bold text-foreground group-hover:text-primary transition-colors text-lg uppercase tracking-tight">{patient.name}</p>
                              <p className="text-xs text-muted-foreground font-semibold">{patient.age}y • {patient.gender}</p>
                            </td>
                            <td className="px-6 py-6">
                              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <Activity className="w-4 h-4 text-primary opacity-50" />
                                {patient.phone}
                              </div>
                            </td>
                            <td className="px-6 py-6 text-center">
                              <span className={`status-badge !text-[9px] !px-4 !py-1 ${getStatusColor(patient.status)}`}>
                                {patient.status.replace('-', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.main>
      </div>

      {showRegisterModal && (
        <RegisterPatientModal onClose={() => setShowRegisterModal(false)} />
      )}

      {selectedPatientForBilling && (
        <BillingModal
          patient={selectedPatientForBilling}
          onClose={() => setSelectedPatientForBilling(null)}
        />
      )}
    </div>
  );
}
