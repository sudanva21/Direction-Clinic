import { create } from 'zustand';
import { Patient } from '../types';
import { supabase } from '../lib/supabase';

interface AppState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPatients: () => Promise<void>;
  getTodayPatients: () => Patient[];
  getPatientsByStatus: (status: string) => Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  generateTokenNumber: () => Promise<string>;
}

export const useAppStore = create<AppState>((set, get) => ({
  patients: [],
  loading: false,
  error: null,

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedPatients: Patient[] = (data || []).map((p) => ({
        id: p.id,
        tokenNumber: p.token_number,
        name: p.name,
        age: p.age,
        gender: p.gender,
        phone: p.phone,
        address: p.address,
        visitDate: p.visit_date,
        status: p.status,
        assignedDoctor: p.assigned_doctor,
        symptoms: p.symptoms,
        prescription: p.prescription,
        billAmount: p.bill_amount ? parseFloat(p.bill_amount) : undefined,
        createdAt: p.created_at,
      }));

      set({ patients: mappedPatients, loading: false });
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      set({ error: error.message, loading: false });
    }
  },

  getTodayPatients: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().patients.filter((p) => p.visitDate === today);
  },

  getPatientsByStatus: (status: string) => {
    const today = new Date().toISOString().split('T')[0];
    return get().patients.filter((p) => p.status === status && p.visitDate === today);
  },

  addPatient: async (patient) => {
    set({ loading: true, error: null });
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('patients')
        .insert({
          token_number: patient.tokenNumber,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          address: patient.address,
          visit_date: patient.visitDate,
          status: patient.status,
          assigned_doctor: patient.assignedDoctor,
          symptoms: patient.symptoms,
          created_by: userData?.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh patients list
      await get().fetchPatients();
    } catch (error: any) {
      console.error('Error adding patient:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePatient: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const dbUpdates: any = {};
      
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.prescription !== undefined) dbUpdates.prescription = updates.prescription;
      if (updates.billAmount !== undefined) dbUpdates.bill_amount = updates.billAmount;
      if (updates.assignedDoctor) dbUpdates.assigned_doctor = updates.assignedDoctor;
      if (updates.symptoms !== undefined) dbUpdates.symptoms = updates.symptoms;

      const { error } = await supabase
        .from('patients')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      // Refresh patients list
      await get().fetchPatients();
    } catch (error: any) {
      console.error('Error updating patient:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  generateTokenNumber: async () => {
    try {
      const { data, error } = await supabase.rpc('get_next_token_number');
      
      if (error) throw error;
      
      return data as string;
    } catch (error: any) {
      console.error('Error generating token:', error);
      // Fallback to client-side generation
      const todayPatients = get().getTodayPatients();
      const nextNumber = todayPatients.length + 1;
      return `T${String(nextNumber).padStart(3, '0')}`;
    }
  },
}));
