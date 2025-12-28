import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Patient } from '../../types';
import { useAppStore } from '../../stores/appStore';
import { User, Phone, MapPin, Calendar, FileText, Pill, Activity, Stethoscope } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface PatientDetailsModalProps {
  patient: Patient;
  onClose: () => void;
}

export default function PatientDetailsModal({ patient, onClose }: PatientDetailsModalProps) {
  const [prescription, setPrescription] = useState(patient.prescription || '');
  const [saving, setSaving] = useState(false);
  const { updatePatient } = useAppStore();
  const { toast } = useToast();

  const handleSavePrescription = async () => {
    if (!prescription.trim()) {
      toast({
        title: '⚠ Missing Prescription',
        description: 'Please enter prescription details before saving.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      await updatePatient(patient.id, {
        prescription,
        status: 'completed',
      });
      
      toast({
        title: '✓ Prescription Saved',
        description: `Successfully saved prescription for ${patient.name}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: '✗ Save Failed',
        description: 'Failed to save prescription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStartConsultation = async () => {
    try {
      await updatePatient(patient.id, { status: 'in-consultation' });
      toast({
        title: '✓ Consultation Started',
        description: `Now consulting with ${patient.name}`,
      });
    } catch (error) {
      toast({
        title: '✗ Failed to Start',
        description: 'Failed to start consultation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="token-badge text-base">
              {patient.tokenNumber}
            </div>
            <span className="text-gradient">{patient.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient Information Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-border/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Age & Gender</p>
                <p className="font-bold text-foreground">{patient.age} years • {patient.gender}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-border/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Phone Number</p>
                <p className="font-bold text-foreground">{patient.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-border/50 hover:shadow-md transition-all sm:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Address</p>
                <p className="font-bold text-foreground">{patient.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-border/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Visit Date</p>
                <p className="font-bold text-foreground">{new Date(patient.visitDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-border/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Status</p>
                <p className="font-bold text-foreground capitalize">{patient.status.replace('-', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          {patient.symptoms && (
            <div className="p-5 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <Label className="text-base font-bold text-foreground">Reported Symptoms</Label>
              </div>
              <p className="text-foreground leading-relaxed">{patient.symptoms}</p>
            </div>
          )}

          {/* Prescription Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <Label htmlFor="prescription" className="text-lg font-bold text-foreground">
                Doctor's Prescription
              </Label>
            </div>
            <Textarea
              id="prescription"
              placeholder="Enter detailed prescription including:&#10;• Medications and dosages&#10;• Treatment instructions&#10;• Follow-up recommendations&#10;• Any special precautions"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              rows={8}
              className="resize-none border-2 focus:border-accent bg-muted/30 focus:bg-white transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            {patient.status === 'waiting' && (
              <Button 
                onClick={handleStartConsultation} 
                variant="outline"
                className="flex-1 border-2 hover:bg-blue-50 hover:border-blue-500 transition-all"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Start Consultation
              </Button>
            )}
            
            {(patient.status === 'in-consultation' || patient.status === 'waiting') && (
              <Button
                onClick={handleSavePrescription}
                disabled={!prescription.trim() || saving}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Pill className="w-4 h-4 mr-2" />
                    Save Prescription & Complete
                  </>
                )}
              </Button>
            )}

            <Button variant="outline" onClick={onClose} className="border-2">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
