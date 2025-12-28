import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Patient } from '../../types';
import { useAppStore } from '../../stores/appStore';
import { IndianRupee, FileText, User, Calendar, Receipt } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface BillingModalProps {
  patient: Patient;
  onClose: () => void;
}

export default function BillingModal({ patient, onClose }: BillingModalProps) {
  const [consultationFee, setConsultationFee] = useState('500');
  const [medicationCost, setMedicationCost] = useState('250');
  const [additionalCharges, setAdditionalCharges] = useState('0');
  const [generating, setGenerating] = useState(false);
  const { updatePatient } = useAppStore();
  const { toast } = useToast();

  const totalAmount =
    parseFloat(consultationFee || '0') +
    parseFloat(medicationCost || '0') +
    parseFloat(additionalCharges || '0');

  const handleGenerateBill = async () => {
    setGenerating(true);
    try {
      await updatePatient(patient.id, {
        billAmount: totalAmount,
        status: 'billed',
      });

      toast({
        title: '✓ Bill Generated',
        description: `Total: ₹${totalAmount.toLocaleString('en-IN')} for ${patient.name}`,
      });

      onClose();
    } catch (error) {
      toast({
        title: '✗ Billing Failed',
        description: 'Failed to generate bill. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg glass-card">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500 bg-[length:200%_100%] animate-gradient" />

        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <span className="text-gradient">Generate Bill</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient Info Summary */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">{patient.name}</span>
              <span className="token-badge text-sm ml-auto">{patient.tokenNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(patient.visitDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Prescription Summary */}
          {patient.prescription && (
            <div className="p-4 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <Label className="text-sm font-bold">Prescription Summary</Label>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{patient.prescription}</p>
            </div>
          )}

          {/* Billing Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-foreground uppercase tracking-wide">Billing Details</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation" className="text-sm font-semibold">Consultation Fee (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="consultation"
                  type="number"
                  placeholder="0.00"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className="pl-10 h-11 bg-muted/30 border-border/60 focus:bg-white transition-all"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medication" className="text-sm font-semibold">Medication Cost (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="medication"
                  type="number"
                  placeholder="0.00"
                  value={medicationCost}
                  onChange={(e) => setMedicationCost(e.target.value)}
                  className="pl-10 h-11 bg-muted/30 border-border/60 focus:bg-white transition-all"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional" className="text-sm font-semibold">Additional Charges (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="additional"
                  type="number"
                  placeholder="0.00"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(e.target.value)}
                  className="pl-10 h-11 bg-muted/30 border-border/60 focus:bg-white transition-all"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-primary/10 to-emerald-500/10 border-2 border-emerald-500/30 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">Total Amount</span>
              <span className="text-3xl font-bold text-gradient">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button
              onClick={handleGenerateBill}
              className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
              disabled={generating}
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4 mr-2" />
                  Generate Bill
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} className="border-2">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
