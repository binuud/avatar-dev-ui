import { Component, input } from "@angular/core";

import { MarkdownModule } from "ngx-markdown";
import { ChatEntity } from "../../../core/models/ai-interfaces";


@Component({
  imports: [MarkdownModule],
  selector: "app-chat-response",
  styleUrl: "./chat-response.scss",
  templateUrl: "./chat-response.html",
})
export class ChatResponse {
  chatEntity = input.required<ChatEntity>();
  type = input.required<'HISTORY' | 'ACTIVE'>();
}
