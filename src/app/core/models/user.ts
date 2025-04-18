import { Role } from './role';

export class User {
  id!: number;
  img!: string;
  email!: string;
  password!: string;
  first_name!: string;
  last_name!: string;
  role!: Role;
  token!: string;
}
