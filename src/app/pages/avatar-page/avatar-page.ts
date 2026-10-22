import { Component } from "@angular/core";
import { AvatarList } from "../../lib/avatar/avatar-list/avatar-list";

@Component({
  imports: [AvatarList],
  selector: "app-avatar-page",
  styleUrl: "./avatar-page.scss",
  templateUrl: "./avatar-page.html",
})
export class AvatarPage {}
