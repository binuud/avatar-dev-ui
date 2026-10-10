import { Component, inject } from "@angular/core";
import { ChatResponse } from "../chat-response/chat-response";
import { ConsciousService } from "../../../core/services/conscious-service";

@Component({
  imports: [ChatResponse],
  selector: "app-chat-history",
  styleUrl: "./chat-history.scss",
  templateUrl: "./chat-history.html",
})
export class ChatHistory {

  aiSvc = inject(ConsciousService);

}
