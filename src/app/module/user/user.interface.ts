type Role = 'user' | 'admin';
type Status = 'active' | 'inactive';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
  shippingAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isBlocked?: boolean;
}
