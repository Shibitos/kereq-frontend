import {Role} from "./role.model";
import {Photo} from "./photo.model";

export class User {
  id?: number;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  biography: string;
  roles: Role[];
  country: string;
  joinDate: string;
  profilePhoto: Photo;
  online: boolean;
}
