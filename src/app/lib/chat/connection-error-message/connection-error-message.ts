import { Component, inject } from "@angular/core";
import { OpenAiService } from "../services/open-ai-service";

@Component({
  imports: [],
  selector: "app-connection-error-message",
  styleUrl: "./connection-error-message.scss",
  templateUrl: "./connection-error-message.html",
})
export class ConnectionErrorMessage {

  aiChatSvc = inject(OpenAiService);

}
