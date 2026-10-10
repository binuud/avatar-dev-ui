import { Component, inject } from "@angular/core";
import { ConsciousService } from "../../../core/services/conscious-service";


@Component({
  imports: [],
  selector: "app-connection-error-message",
  styleUrl: "./connection-error-message.scss",
  templateUrl: "./connection-error-message.html",
})
export class ConnectionErrorMessage {

  aiSvc = inject(ConsciousService);

}
