import { Component, inject, input, output } from "@angular/core";
import { Avatar } from "../../../gen/v1/avatar/avatar.pb";
import { RouterLink } from "@angular/router";
import { MarkdownModule } from "ngx-markdown";
import { QuantumUiRender } from "../../quatumUI/quantum-ui-render/quantum-ui-render";
import { ActionButton } from "../../../core/components/action-button/action-button";
import { AvatarSrv } from "../../../core/services/avatar-srv";

@Component({
  imports: [ActionButton, RouterLink, MarkdownModule, QuantumUiRender],
  selector: "app-avatar-card",
  styleUrl: "./avatar-card.scss",
  templateUrl: "./avatar-card.html",
})
export class AvatarCard {

  avatarSvc = inject(AvatarSrv)

  avatar = input.required<Avatar>();

  // buildClick = output<string>(); 

  showLaunch = input<boolean>(false);
  showDetails = input<boolean>(false);

  async build(avatarName: string | undefined): Promise <any> {
    
    if (avatarName) {
      return this.avatarSvc.build(avatarName);
    }

  }
}
