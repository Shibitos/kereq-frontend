import {User} from "./user.model";

export class Comment {
  id?: number;
  user: User;
  createdAt: Date;
  content: string;
}
