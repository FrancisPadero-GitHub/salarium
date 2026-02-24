export type CommissionRate = 0.5 | 0.75 | 1.0;

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionRate: CommissionRate;
  /** Active or inactive in the system */
  active: boolean;
  hiredAt: string; // ISO date string
}
