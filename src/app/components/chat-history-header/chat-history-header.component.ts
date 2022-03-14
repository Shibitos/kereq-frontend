import {Component, OnInit} from '@angular/core';
import {ChatMessage} from "../../models/chat-message.model";
import {PageUtil} from "../../utils/page.util";
import {Conversation} from "../../models/conversation.model";
import {CommunicatorService} from "../../services/communicator.service";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {UserCacheService} from "../../services/user-cache.service";
import {ChatWindowEventService} from "../../services/chat-window-event.service";

@Component({
  selector: 'app-chat-history-header',
  templateUrl: './chat-history-header.component.html',
  styleUrls: ['./chat-history-header.component.scss']
})
export class ChatHistoryHeaderComponent implements OnInit {

  private static MAX_CONTENT_SHORT_LENGTH: number = 55;

  loggedUser: User;
  unreadMessagesCount: number = 0;
  filterTerm: string;

  conversations: Conversation[] = [];
  conversationsTemp: Conversation[] = [];
  conversationsPageTool: PageUtil<Conversation>;

  constructor(private authService: AuthService,
              private communicatorService: CommunicatorService,
              private chatWindowEventService: ChatWindowEventService,
              private userCacheService: UserCacheService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(u => {
      if (u.id) {
        this.loggedUser = u;
        this.communicatorService.messagesSubject.subscribe(this.onMessage.bind(this));
      }
    });
    this.conversationsPageTool = new PageUtil<Conversation>(this.communicatorService.getChatHistory.bind(this.communicatorService), this.conversationsTemp, 10, undefined, true, this.parseSortConversations.bind(this));
    this.communicatorService.chatBarInitialized.subscribe(this.init.bind(this));
    this.communicatorService.messageReadSubject.subscribe(this.onMessageRead.bind(this));
  }

  init() {
    this.conversationsPageTool.init();
  }

  parseSortConversations(conversations: Conversation[]) {
    conversations.forEach(conversation => {
      let recipientId = (conversation.firstUserId == this.loggedUser.id) ? conversation.secondUserId : conversation.firstUserId;
      let recipient = this.userCacheService.getUser(recipientId);
      if (recipient) {
        recipient.then(rec => {
          if (rec) {
            conversation.recipient = rec;
          }
        });
      } else {
        console.error('User not found', recipientId);
      }
      conversation.lastMessageContentShort = ChatHistoryHeaderComponent.getShortMessageContent(conversation.lastMessage.content);
      let convIndex = this.conversations.findIndex(con => con.id === conversation.id);
      if (convIndex > -1) {
        this.conversations.splice(convIndex, 1);
      }
      this.conversations.push(conversation);
    });
    this.calculateUnreadMessagesCount();
    this.sortConversations();
  }

  onMessage(chatMessage: ChatMessage) {
    let conversation : Conversation;
    let convIndex = this.conversations.findIndex(con => con.id === chatMessage.conversationId);
    if (convIndex > -1) {
      this.conversations[convIndex].lastMessage = chatMessage;
      this.conversations[convIndex].lastMessageContentShort = ChatHistoryHeaderComponent.getShortMessageContent(chatMessage.content);
    } else {
      conversation = new Conversation();
      conversation.id = chatMessage.conversationId;
      conversation.firstUserId = Math.min(chatMessage.senderId, chatMessage.recipientId);
      conversation.secondUserId = Math.max(chatMessage.senderId, chatMessage.recipientId);
      conversation.lastMessage = chatMessage;
      conversation.lastMessageContentShort = ChatHistoryHeaderComponent.getShortMessageContent(chatMessage.content);
      this.conversations.push(conversation);
    }
    this.calculateUnreadMessagesCount();
    this.sortConversations();
  }

  onMessageRead(chatMessage: ChatMessage) {
    let convIndex = this.conversations.findIndex(con => con.id === chatMessage.conversationId);
    if (convIndex > -1) {
      this.conversations[convIndex].lastMessage.read = true;
      this.calculateUnreadMessagesCount();
    }
  }

  calculateUnreadMessagesCount() {
    this.unreadMessagesCount = 0;
    for (let conversation of this.conversations) {
      if (conversation.lastMessage.senderId !== this.loggedUser.id && !conversation.lastMessage.read) {
        this.unreadMessagesCount += 1;
      }
    }
  }

  sortConversations() {
    this.conversations.sort((a: Conversation, b: Conversation) => new Date(b.lastMessage.sendDate).getTime() - new Date(a.lastMessage.sendDate).getTime());
  }

  filterConversations(conversations: Conversation[], term: string) {
    return (conversations || []).filter(conversation => {
      let fullName = conversation.recipient.firstName + ' ' + conversation.recipient.lastName;
      return new RegExp(term, 'gi').test(fullName);
    });
  }

  openChatWindow(recipient: User) {
    this.chatWindowEventService.openWindow(recipient);
  }

  private static getShortMessageContent(content: string) : string {
    let short = content.substr(0, ChatHistoryHeaderComponent.MAX_CONTENT_SHORT_LENGTH);
    if (short.length < content.length) {
      short += '...';
    }
    return short;
  }
}
