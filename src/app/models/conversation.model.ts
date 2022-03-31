import {ChatMessage} from "./chat-message.model";
import {User} from "./user.model";

export class Conversation {
  id: string;
  firstUserId: number;
  secondUserId: number;
  lastMessage: ChatMessage;
  firstUserMessageCount: number;
  secondUserMessageCount: number;
  recipient: User; //Transient
  lastMessageContentShort: string; //Transient
}
