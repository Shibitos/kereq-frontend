import {Role} from "./role.model";

export class User {
  id?: number;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  country: string;
  joinDate: string;
}
