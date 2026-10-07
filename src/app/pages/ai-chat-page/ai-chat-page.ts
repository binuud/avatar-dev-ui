import { Component } from "@angular/core";
import { ChatBlock } from "../../lib/chat/chat-block/chat-block";

@Component({
  imports: [ChatBlock],
  selector: "app-ai-chat-page",
  styleUrl: "./ai-chat-page.scss",
  templateUrl: "./ai-chat-page.html",
})
export class AiChatPage {}
