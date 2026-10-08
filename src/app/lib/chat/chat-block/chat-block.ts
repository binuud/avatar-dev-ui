import { Component, inject } from "@angular/core";
import { ChatPromptInput } from "../chat-prompt-input/chat-prompt-input";
import { OpenAiService } from "../services/open-ai-service";
import { ConnectionErrorMessage } from "../connection-error-message/connection-error-message";

@Component({
  imports: [ChatPromptInput, ConnectionErrorMessage],
  selector: "app-chat-block",
  styleUrl: "./chat-block.scss",
  templateUrl: "./chat-block.html",
})
export class ChatBlock {

    aiChatSvc = inject(OpenAiService);
    
}
