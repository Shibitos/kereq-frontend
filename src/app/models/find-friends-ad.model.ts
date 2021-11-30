import {User} from "./user.model";

export class FindFriendsAd {
  user: User;
  minAge: number;
  maxAge: number;
  gender: string;
  description: string;
}
