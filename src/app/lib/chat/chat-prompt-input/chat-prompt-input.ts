import { Component, computed, ElementRef, inject, signal, Signal, ViewChild, WritableSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { v4 as uuidv4 } from 'uuid';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { ChatEntity, OpenAiService, PromptInterface } from "../services/open-ai-service";
import { ChatResponse } from "../chat-response/chat-response";

export interface MultiStateButtonConfig {
  id: string;          // Unique identifier for the state (e.g., 'idle', 'loading', 'success')
  text?: string;        // Text to display for this state
  iconClass: string;  // Optional CSS class for the icon (FontAwesome, Material Icons, etc.)
  disabled: boolean;  // Whether the button should be disabled in this state
  title?: string;       // title shown on hover
}




@Component({
  imports: [FormsModule, MarkdownModule, ChatResponse],
  selector: "app-chat-prompt-input",
  styleUrl: "./chat-prompt-input.scss",
  templateUrl: "./chat-prompt-input.html",
})
export class ChatPromptInput {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  aiChatSvc = inject(OpenAiService);

  prompt: string = "";

  defaultBtnState: MultiStateButtonConfig ={ id: "new", iconClass: "fa-solid fa-play", disabled: false};

  btnConfigMap = new Map<string, MultiStateButtonConfig>([
    ["new",       { id: "new", iconClass: "fa-solid fa-play", disabled: false }],
    ["submitted_wait", { id: "submitted", iconClass: "fa-solid fa-circle-notch fa-spin", disabled: false }],
    ["submitted", { id: "submitted", iconClass: "fa-solid fa-stop", disabled: false }]
  ]);


  btnStateSig: WritableSignal<string> = signal("new");
  btnConfigSig = computed(() => this.btnConfigMap.get(this.btnStateSig()) ?? this.defaultBtnState );

  currentChatSig:  WritableSignal<ChatEntity> = signal({uuid: "", response: "", reasoning: "", prompt: this.aiChatSvc.getEmptyPrompt(),});

  constructor() {

  }

  updateCurrentChatSig(newState: Partial<ChatEntity>) {
    this.currentChatSig.update(state => ({ 
      ...state, 
      ...newState
    }));
    
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }, 50);
  }
  
  /**
   * getChatResponse()
   * calls the streaming response api, and updates response signal on this component
   */
  getChatResponse() {

   
    let model = this.aiChatSvc.state().prompt.model;
    if (this.prompt && model) {
      console.log("Sending chat request");
      this.btnStateSig.set("submitted_wait");
      this.currentChatSig.set({
        uuid: uuidv4(),
        prompt: {
          role: "",
          mode: "Query",
          userPrompt: this.prompt,
          systemPrompt: "",
          model: this.aiChatSvc.state().prompt.model,
          options: {
            seed: 0,
            num_predict: 0,
            temperature: 0
          },
          control: ""
        },
        response: "",
        reasoning: ""
      });

      this.processChatResponseStream(this.prompt, model);
      this.prompt = ""
    }
  }

  async processChatResponseStream(prompt: string, model: string) {

    try {
      const stream = await this.aiChatSvc.getStreamingCompletion(this.prompt, model);
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        const content = delta.content || '';
        let reasoning = ""
        if (delta && 'reasoning' in delta && delta.reasoning) {
          reasoning = "" + delta.reasoning;
        }
         if (delta && 'reasoning_content' in delta && delta.reasoning_content) {
          reasoning = "" + delta.reasoning_content;
         }
        
        if (content) {
          const response = this.currentChatSig().response + content;
          this.updateCurrentChatSig({
            response: response 
          })
        } else if (reasoning) {
          reasoning = this.currentChatSig().reasoning + reasoning;
          this.updateCurrentChatSig({
            reasoning: reasoning 
          })
        }

      }
    } catch (error) {
      this.updateCurrentChatSig({
        response: 'An error occurred while streaming response. Please try again after some time.'
      })
      this.addToHistory();
    } finally {
      // this.loading = false;
      // update history
      // clear the current chat entity
      this.addToHistory();
    }
  } 

  /**
   *  this.loading = false;
   *  update history
   *  clear the current chat entity
   */
  addToHistory() {
    this.aiChatSvc.addToHistory(this.currentChatSig());
    this.btnStateSig.set("new");
    this.currentChatSig.set({uuid: "", response: "", reasoning: "", prompt: this.aiChatSvc.getEmptyPrompt()});
  }

  /**
   * submit()
   * when user submits on the chat interface
   */
  submit() {
    if (this.btnStateSig() == "new" ) {
      console.log("new chat");
      this.getChatResponse();
    }
    this.scrollToBottom();
  }
}
