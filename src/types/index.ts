export type UserRole = 'doctor' | 'receptionist';

export type PatientStatus = 'waiting' | 'in-consultation' | 'completed' | 'billed';

export interface Patient {
  id: string;
  tokenNumber: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  visitDate: string;
  status: PatientStatus;
  assignedDoctor?: string;
  symptoms?: string;
  prescription?: string;
  billAmount?: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface DoctorStats {
  totalPatients: number;
  waiting: number;
  completed: number;
}
