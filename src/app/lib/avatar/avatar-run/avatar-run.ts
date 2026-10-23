import { Component, computed, inject, input, signal, WritableSignal } from "@angular/core";
import { Avatar } from "../../../gen/v1/avatar/avatar.pb";
import { AvatarSrv } from "../../../core/services/avatar-srv";

import { ActivatedRoute } from "@angular/router";
import { QuantumUiRender } from "../../quatumUI/quantum-ui-render/quantum-ui-render";
import { AvatarCard } from "../avatar-card/avatar-card";

@Component({
  imports: [QuantumUiRender, AvatarCard],
  selector: "app-avatar-run",
  styleUrl: "./avatar-run.scss",
  templateUrl: "./avatar-run.html",
})
export class AvatarRun {
  
  private route = inject(ActivatedRoute);
  avatarSvc = inject(AvatarSrv)

  id = input.required<string>(); 
  name: string = "";

  avatar:  WritableSignal<Avatar> = signal({});

  constructor() {
    const param = this.route.snapshot.paramMap.get('id')
    if (param) {
      this.name = param;
      this.get();
    }
  }

  /**
   * list()
   * get list of avatars from server
   */ 
  async get() {
    
    try {
      await this.avatarSvc.get(this.name).then(response => {
        console.dir(response);
        if (response.avatar) {
          this.avatar.set(response.avatar);
        }
      });
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {}

  }
}
