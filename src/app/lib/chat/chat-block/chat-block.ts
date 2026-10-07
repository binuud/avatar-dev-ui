import { Component } from "@angular/core";
import { ChatPromptInput } from "../chat-prompt-input/chat-prompt-input";

@Component({
  imports: [ChatPromptInput],
  selector: "app-chat-block",
  styleUrl: "./chat-block.scss",
  templateUrl: "./chat-block.html",
})
export class ChatBlock {}
