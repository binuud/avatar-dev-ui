import { Component, inject, signal, WritableSignal } from "@angular/core";
import { AvatarStoreListRequest } from "../../../gen/v1/avatar/avatarStoreService.pb";
import { Avatar } from "../../../gen/v1/avatar/avatar.pb";
import { AvatarStoreSrv } from "../../../core/services/avatar-store-srv";
import { AvatarCard } from "../avatar-card/avatar-card";

@Component({
  imports: [AvatarCard],
  selector: "app-avatar-list",
  styleUrl: "./avatar-list.scss",
  templateUrl: "./avatar-list.html",
})

export class AvatarList {

  avatars:  WritableSignal<Avatar[]> = signal([]);

  avatarStoreSvc = inject(AvatarStoreSrv)

  constructor() {
    this.list();
  }

  /**
   * list()
   * get list of avatars from server
   */ 
  async list() {
    const req: AvatarStoreListRequest = {
      limit: 100,
      offset: 0
    }
    try {
      await this.avatarStoreSvc.list(req).then(response => {
        console.dir(response);
        if (response.avatars) {
          this.avatars.set(response.avatars);
        }
      });
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {

    }
  }

}
