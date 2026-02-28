export interface Technician {
  id: string;
  name: string;
  email: string | null;
  commission: number;
  /** Active or inactive in the system */
  active: boolean;
  hiredAt: string | null;
}
