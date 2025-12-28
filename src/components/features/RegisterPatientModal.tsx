import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useAppStore } from '../../stores/appStore';
import { useToast } from '../../hooks/use-toast';
import { Ticket, User, Calendar, Phone, MapPin, FileText } from 'lucide-react';

interface RegisterPatientModalProps {
  onClose: () => void;
}

export default function RegisterPatientModal({ onClose }: RegisterPatientModalProps) {
  const { addPatient, generateTokenNumber } = useAppStore();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    address: '',
    symptoms: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    try {
      const tokenNumber = await generateTokenNumber();
      
      await addPatient({
        tokenNumber,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        symptoms: formData.symptoms,
        visitDate: new Date().toISOString().split('T')[0],
        status: 'waiting',
        assignedDoctor: 'Auto-assigned',
      });
      
      toast({
        title: '✓ Patient Registered',
        description: `${formData.name} has been assigned token ${tokenNumber}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: '✗ Registration Failed',
        description: 'Failed to register patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name && formData.age && formData.phone && formData.address;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient" />
        
        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <span className="text-gradient">Register New Patient</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            Fill in patient details to generate a token and add them to today's queue
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground uppercase tracking-wide">Personal Information</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter patient name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="h-11 bg-muted/30 border-border/60 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-semibold">Age *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="pl-10 h-11 bg-muted/30 border-border/60 focus:bg-white transition-all"
                    required
                    min="0"
                    max="150"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-semibold">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                  <SelectTrigger className="h-11 bg-muted/30 border-border/60 focus:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="pl-10 h-11 bg-muted/30 border-border/60 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold">Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="pl-10 h-11 bg-muted/30 border-border/60 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-foreground uppercase tracking-wide">Medical Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symptoms" className="text-sm font-semibold">Symptoms / Reason for Visit</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe the symptoms or reason for consultation..."
                value={formData.symptoms}
                onChange={(e) => handleChange('symptoms', e.target.value)}
                rows={4}
                className="resize-none bg-muted/30 border-border/60 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button 
              type="submit" 
              disabled={!isFormValid || submitting} 
              className="flex-1 h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4 mr-2" />
                  Register Patient & Generate Token
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-2">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
