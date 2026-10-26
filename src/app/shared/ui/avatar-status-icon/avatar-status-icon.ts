import { Component, input } from "@angular/core";

@Component({
  imports: [],
  selector: "app-avatar-status-icon",
  styleUrl: "./avatar-status-icon.scss",
  templateUrl: "./avatar-status-icon.html",
})
export class AvatarStatusIcon {
  status = input<string>();
}
