import {User} from "./user.model";

export class Post {
  id?: number;
  user: User;
  createdAt: Date;
  content: string;
}
