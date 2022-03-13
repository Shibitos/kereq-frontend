import {Injectable} from '@angular/core';
import {User} from "../models/user.model";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class UserCacheService {

  users: Map<number, User> = new Map<number, User>();

  constructor(private userService: UserService) { }

  async getUser(id: number) : Promise<User | undefined> {
    let user = this.users.get(id);
    if (!user) {
      let loaded = await this.loadUser(id);
      if (loaded) {
        this.addUser(loaded);
        user = loaded;
      }
    }
    return user;
  }

  addUser(user: User) {
    if (user && user.id) {
      this.users.set(user.id, user);
    }
  }

  async loadUser(id: number) : Promise<User | undefined> {
    return await this.userService.getUser(id).toPromise();
  }
}
