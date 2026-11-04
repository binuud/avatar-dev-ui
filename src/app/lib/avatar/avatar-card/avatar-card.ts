import { Component, input, output } from "@angular/core";
import { Avatar } from "../../../gen/v1/avatar/avatar.pb";
import { RouterLink } from "@angular/router";
import { MarkdownModule } from "ngx-markdown";
import { QuantumUiRender } from "../../quatumUI/quantum-ui-render/quantum-ui-render";

@Component({
  imports: [RouterLink, MarkdownModule, QuantumUiRender],
  selector: "app-avatar-card",
  styleUrl: "./avatar-card.scss",
  templateUrl: "./avatar-card.html",
})
export class AvatarCard {
  
  avatar = input.required<Avatar>();
  buildClick = output<string>(); 

  showLaunch = input<boolean>(false);
  showDetails = input<boolean>(false);

  build() {
    this.buildClick.emit("build");
  }
}
