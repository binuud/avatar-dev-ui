import { Component, computed, inject, signal, Signal, WritableSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultiStateButton } from "../../../shared/ui/multi-state-button/multi-state-button";
import { count } from "rxjs";
import { OpenAiService } from "../services/open-ai-service";

export interface MultiStateButtonConfig {
  id: string;          // Unique identifier for the state (e.g., 'idle', 'loading', 'success')
  text?: string;        // Text to display for this state
  iconClass: string;  // Optional CSS class for the icon (FontAwesome, Material Icons, etc.)
  disabled: boolean;  // Whether the button should be disabled in this state
  title?: string;       // title shown on hover
}

@Component({
  imports: [FormsModule],
  selector: "app-chat-prompt-input",
  styleUrl: "./chat-prompt-input.scss",
  templateUrl: "./chat-prompt-input.html",
})
export class ChatPromptInput {

  aiChatSvc = inject(OpenAiService);

  prompt: string = "";

  defaultBtnState: MultiStateButtonConfig ={ id: "new", iconClass: "fa-solid fa-play", disabled: false};

  btnConfigMap = new Map<string, MultiStateButtonConfig>([
    ["new",       { id: "new", iconClass: "fa-solid fa-play", disabled: false }],
    ["submitted_wait", { id: "submitted", iconClass: "fa-solid fa-circle-notch fa-spin", disabled: true }],
    ["submitted", { id: "submitted", iconClass: "fa-solid fa-stop", disabled: false }]
  ]);


  btnStateSig: WritableSignal<string> = signal("new");
  btnConfigSig = computed(() => this.btnConfigMap.get(this.btnStateSig()) ?? this.defaultBtnState );

  constructor() {

  }
  


  submit() {
    if (this.btnStateSig() == "new" ) {
      this.btnStateSig.set("submitted_wait");
    }
  }
}
