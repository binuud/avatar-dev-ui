import { Component, inject } from "@angular/core";
import { ChatPromptInput } from "../chat-prompt-input/chat-prompt-input";
import { ConnectionErrorMessage } from "../connection-error-message/connection-error-message";
import { ChatHistory } from "../chat-history/chat-history";
import { ConsciousService } from "../../../core/services/conscious-service";

@Component({
  imports: [ChatPromptInput, ConnectionErrorMessage, ChatHistory],
  selector: "app-chat-block",
  styleUrl: "./chat-block.scss",
  templateUrl: "./chat-block.html",
})
export class ChatBlock {

  aiSvc = inject(ConsciousService);
    
}
