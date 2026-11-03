import { Component, inject, input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AvatarSrv } from "../../../core/services/avatar-srv";
import { AvatarCard } from "../avatar-card/avatar-card";

@Component({
  imports: [AvatarCard],
  selector: "app-avatar-details",
  styleUrl: "./avatar-details.scss",
  templateUrl: "./avatar-details.html",
})
export class AvatarDetails {

  private route = inject(ActivatedRoute);
  avatarSvc = inject(AvatarSrv)

  id = input.required<string>(); 
  name: string = "";

  constructor() {
    const param = this.route.snapshot.paramMap.get('id')
    if (param) {
      this.name = param;
      this.get();

      // reset the avatar control status
      this.avatarSvc.avatarControl.set({});
    }
  }

  /**
   * list()
   * get list of avatars from server
   */ 
  async get() {
    this.avatarSvc.get(this.name);
  }

  build($event: string) {
    this.avatarSvc.build(this.name);
  }
  
}
