import { Component,inject, input } from "@angular/core";
import { AvatarControl, AvatarControlAvatarAction } from "../../../gen/v1/avatar/avatar.pb";
import { AvatarSrv } from "../../../core/services/avatar-srv";
import { ActivatedRoute } from "@angular/router";
import { QuantumUiRender } from "../../quatumUI/quantum-ui-render/quantum-ui-render";
import { MarkdownModule } from "ngx-markdown";
import { AvatarStatusIcon } from "../../../shared/ui/avatar-status-icon/avatar-status-icon";

declare var bootstrap: any; 

@Component({
  imports: [QuantumUiRender, MarkdownModule, AvatarStatusIcon],
  selector: "app-avatar-run",
  styleUrl: "./avatar-run.scss",
  templateUrl: "./avatar-run.html",
})
export class AvatarRun {
  
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

  start() {
    // const bsCollapse = new bootstrap.Collapse('#avatarInfoContent', {
    //   toggle: true
    // })
    this.avatarSvc.sendAction(AvatarControlAvatarAction.RUN)

  }

  getTimeElapsed(control: AvatarControl): number {
    let s1 = Number(control.createdAt?.seconds);
    let s2 = Number(control.completedAt?.seconds);
    return (s2-s1);
  }
}
