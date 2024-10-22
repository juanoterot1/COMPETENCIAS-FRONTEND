// user.model.ts
export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  id_role: number;
  role: Role;
}
