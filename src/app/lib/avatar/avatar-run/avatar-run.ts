import { Component, computed, inject, input, signal, WritableSignal } from "@angular/core";
import { Avatar, AvatarControl, AvatarControlAvatarAction } from "../../../gen/v1/avatar/avatar.pb";
import { AvatarSrv } from "../../../core/services/avatar-srv";
import { ActivatedRoute } from "@angular/router";
import { QuantumUiRender } from "../../quatumUI/quantum-ui-render/quantum-ui-render";
import { MarkdownModule } from "ngx-markdown";
import { ControlRequest } from "../../../gen/v1/avatar/avatarService.pb";

declare var bootstrap: any; 

@Component({
  imports: [QuantumUiRender, MarkdownModule],
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

  start() {
    // const bsCollapse = new bootstrap.Collapse('#avatarInfoContent', {
    //   toggle: true
    // })
    const req: ControlRequest = {
      "control": {
        "meta": this.avatar().meta,
        "action": AvatarControlAvatarAction.Run
      }
    }
    this.avatarSvc.control(req);
  }

  getTimeElapsed(control: AvatarControl): number {
    let s1 = Number(control.createdAt?.seconds);
    let s2 = Number(control.completedAt?.seconds);
    return (s2-s1);
  }
}
