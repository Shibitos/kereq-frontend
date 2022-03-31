import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {PageUtil} from "../../utils/page.util";
import {AuthService} from "../../services/auth.service";
import {CommunicatorService} from "../../services/communicator.service";
import {UserCacheService} from "../../services/user-cache.service";
import {NotificationModel} from "../../models/notification.model";

@Component({
  selector: 'app-notification-header',
  templateUrl: './notification-header.component.html',
  styleUrls: ['./notification-header.component.scss']
})
export class NotificationHeaderComponent implements OnInit {

  private static MAX_CONTENT_SHORT_LENGTH: number = 55;

  loggedUser: User;
  unreadNotificationsCount: number = 0;
  filterTerm: string;

  notifications: NotificationModel[] = [];
  notificationsTemp: NotificationModel[] = [];
  notificationsPageTool: PageUtil<NotificationModel>;

  constructor(private authService: AuthService,
              private communicatorService: CommunicatorService,
              private userCacheService: UserCacheService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(u => {
      if (u.id) {
        this.loggedUser = u;
        this.communicatorService.notificationsSubject.subscribe(this.onNotification.bind(this));
      }
    });
    this.notificationsPageTool = new PageUtil<NotificationModel>(this.communicatorService.getNotificationsHistory.bind(this.communicatorService), this.notificationsTemp, 10, undefined, true, this.parseSortNotifications.bind(this));
    this.communicatorService.chatBarInitialized.subscribe(this.init.bind(this));
    this.communicatorService.notificationReadSubject.subscribe(this.onNotificationRead.bind(this));
  }

  init() {
    this.notificationsPageTool.init();
  }

  parseSortNotifications(notifications: NotificationModel[]) {
    notifications.forEach(notification => {
      this.loadNotificationSourceUser(notification);
      let notIndex = this.notifications.findIndex(not => not.id === notification.id);
      if (notIndex > -1) {
        this.notifications.splice(notIndex, 1);
      }
      this.notifications.push(notification);
    });
    this.calculateUnreadNotificationsCount();
    this.sortNotifications();
  }

  loadNotificationSourceUser(notification: NotificationModel) {
    if (notification.sourceUserId) {
      let sourceUser = this.userCacheService.getUser(notification.sourceUserId);
      if (sourceUser) {
        sourceUser.then(usr => {
          if (usr) {
            notification.sourceUser = usr;
          }
        });
      } else {
        console.error('User not found', notification.sourceUserId);
      }
    }
  }

  onNotification(notification: NotificationModel) {
    let notIndex = this.notifications.findIndex(not => not.id === notification.id);
    if (notIndex == -1) {
      this.loadNotificationSourceUser(notification);
      this.notifications.push(notification);
      this.calculateUnreadNotificationsCount();
      this.sortNotifications();
    }
  }

  onNotificationRead(notification: NotificationModel) {
    let notIndex = this.notifications.findIndex(not => not.id === notification.id);
    if (notIndex > -1) {
      this.notifications[notIndex].read = true;
      this.calculateUnreadNotificationsCount();
    }
  }

  calculateUnreadNotificationsCount() {
    this.unreadNotificationsCount = 0;
    for (let notification of this.notifications) {
      if (!notification.read) {
        this.unreadNotificationsCount += 1;
      }
    }
  }

  sortNotifications() {
    this.notifications.sort((a: NotificationModel, b: NotificationModel) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  markRead(notification: NotificationModel) {
    if (!notification.read) {
      this.communicatorService.markNotificationRead(notification);
    }
  }

  markAllRead() {
    for (let notification of this.notifications) {
      if (!notification.read) {
        this.communicatorService.markNotificationRead(notification);
      }
    }
  }
}
