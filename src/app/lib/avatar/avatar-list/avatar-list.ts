import { Component, inject, signal, WritableSignal } from "@angular/core";
import { AvatarService } from "../../../core/services/avatar-service";
import { AvatarStoreListRequest } from "../../../gen/v1/avatar/avatarStoreService.pb";
import { Avatar } from "../../../gen/v1/avatar/avatar.pb";

@Component({
  imports: [],
  selector: "app-avatar-list",
  styleUrl: "./avatar-list.scss",
  templateUrl: "./avatar-list.html",
})

export class AvatarList {

  avatars:  WritableSignal<Avatar[]> = signal([]);

  avatarSvc = inject(AvatarService)

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
      await this.avatarSvc.list(req).then(response => {
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
