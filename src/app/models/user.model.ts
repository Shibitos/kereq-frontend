import {Role} from "./role.model";

export class User {
  id?: string;
  login: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  country: string;
  joinDate: string;
}
