import { Component, inject } from "@angular/core";
import { AvatarList } from "../../lib/avatar/avatar-list/avatar-list";
import { AvatarStoreSrv } from "../../core/services/avatar-store-srv";

@Component({
  imports: [AvatarList],
  selector: "app-avatar-page",
  styleUrl: "./avatar-page.scss",
  templateUrl: "./avatar-page.html",
})
export class AvatarPage {
  avatarStoreSvc = inject(AvatarStoreSrv);
}
