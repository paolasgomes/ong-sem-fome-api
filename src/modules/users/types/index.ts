type Role = 'admin' | 'logistica' | 'financeiro';

interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
  created_at: string;
  updated_at: string | null;
}

export type { IUser };
