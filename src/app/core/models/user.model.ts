export interface User {
  showDetails: boolean;
  id: number;
  username: string;
  password?: string;
  full_name: string;
  phone: string;
  mail: string;
  role_id: number;
  dni: string;
  created_at: string;
  updated_at: string;
}