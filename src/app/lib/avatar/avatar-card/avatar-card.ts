import { Component, input } from "@angular/core";
import { Avatar } from "../../../gen/v1/avatar/avatar.pb";
import { RouterLink } from "@angular/router";

@Component({
  imports: [RouterLink],
  selector: "app-avatar-card",
  styleUrl: "./avatar-card.scss",
  templateUrl: "./avatar-card.html",
})
export class AvatarCard {
  item = input.required<Avatar>();
}
