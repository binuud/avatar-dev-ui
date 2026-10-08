import { Component, inject } from "@angular/core";
import { ChatResponse } from "../chat-response/chat-response";
import { OpenAiService } from "../services/open-ai-service";

@Component({
  imports: [ChatResponse],
  selector: "app-chat-history",
  styleUrl: "./chat-history.scss",
  templateUrl: "./chat-history.html",
})
export class ChatHistory {

  aiChatSvc = inject(OpenAiService);

}
