import { Component, inject } from "@angular/core";
import { ToastSrv } from "../../services/toast-srv";

@Component({
  imports: [],
  selector: "app-toast-list",
  styleUrl: "./toast-list.scss",
  templateUrl: "./toast-list.html",
})
export class ToastList {
  readonly toastService = inject(ToastSrv);
}
