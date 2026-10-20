import { Component, input } from "@angular/core";

import { MarkdownModule } from "ngx-markdown";
import { ChatEntity } from "../../../core/models/ai-interfaces";
import { SingleContext } from "../../../gen/v1/conscious/memory.pb";


@Component({
  imports: [MarkdownModule],
  selector: "app-chat-response",
  styleUrl: "./chat-response.scss",
  templateUrl: "./chat-response.html",
})
export class ChatResponse {
  context = input.required<SingleContext>();
  type = input.required<'HISTORY' | 'ACTIVE'>();

  getTimeElapsed(): number {
    let s1 = Number(this.context().out?.createdAt?.seconds);
    let s2 = Number(this.context().out?.completedAt?.seconds);
    return (s2-s1);
  }

}
