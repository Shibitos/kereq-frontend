import {User} from "./user.model";

export class NotificationModel {
  id: string;
  sourceUserId: number;
  title: string;
  content: string;
  date: Date;
  read: boolean;
  sourceUser: User; //Transient
  contentShort: string; //Transient
}
