import { Component, computed, ElementRef, inject, signal, Signal, ViewChild, WritableSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChatResponse } from "../chat-response/chat-response";
import { contextMesssage } from "../../../gen/v1/conscious/contextMessage.pb";
import { ConsciousService } from "../../../core/services/conscious-service";
import { Model } from "../../../gen/v1/conscious/common.pb";
import { AiInterfaces, ChatEntity } from "../../../core/models/ai-interfaces";

export interface MultiStateButtonConfig {
  id: string;          // Unique identifier for the state (e.g., 'idle', 'loading', 'success')
  text?: string;        // Text to display for this state
  iconClass: string;  // Optional CSS class for the icon (FontAwesome, Material Icons, etc.)
  disabled: boolean;  // Whether the button should be disabled in this state
  title?: string;       // title shown on hover
}

export interface ChatPromptInputState {
  userPrompt: string;
  model: string;
  mode: string;
  contextMesssage?: contextMesssage;
  reasoning?: string;
  response?: string;
  disabled: boolean;
}

@Component({
  imports: [FormsModule, ChatResponse],
  selector: "app-chat-prompt-input",
  styleUrl: "./chat-prompt-input.scss",
  templateUrl: "./chat-prompt-input.html",
})

export class ChatPromptInput {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  aiSvc = inject(ConsciousService);
  // aiChatSvc = inject(OpenAiService);


  defaultBtnState: MultiStateButtonConfig ={ id: "new", iconClass: "fa-solid fa-play", disabled: false};

  btnConfigMap = new Map<string, MultiStateButtonConfig>([
    ["Query",       { id: "new", iconClass: "fa-solid fa-play", disabled: false }],
    ["Image",       { id: "new", iconClass: "fa-solid fa-image", disabled: false }],
    ["submitted_wait", { id: "submitted", iconClass: "fa-solid fa-circle-notch fa-spin", disabled: false }],
    ["submitted", { id: "submitted", iconClass: "fa-solid fa-stop", disabled: false }]
  ]);


  state: WritableSignal<ChatPromptInputState> = signal({
    userPrompt: "",
    model: "",
    mode: "Query",
    disabled: false
  });

  chatStreamResponse: WritableSignal<string> = signal("");
  imageUrl: WritableSignal<string> = signal("");
  chatMode: WritableSignal<string> = signal("Query"); 
  btnStateSig: WritableSignal<string> = signal("new");
  btnConfigSig = computed(() => this.btnConfigMap.get(this.btnStateSig()) ?? this.defaultBtnState );

  currentChat:  WritableSignal<ChatEntity> = signal(AiInterfaces.NewChatEntity("",""));

  constructor() {

  }

  updateCurrentChat(newState: Partial<ChatEntity>) {
    this.currentChat.update(state => ({ 
      ...state, 
      ...newState
    }));
  }

  updateState(newState: Partial<ChatPromptInputState>) {
    this.state.update(state => ({ 
      ...state, 
      ...newState
    }));
  }

  /**
   * setMode()
   * allow generation mode to be selected
   * it can be query or image generation
   * @param mode all
   */
  setMode(mode: string) {
    this.chatMode.set(mode)
    if (mode == 'Query') {
      this.btnStateSig.set('Query');
    } else if (mode == 'Image') {
      this.btnStateSig.set('Image');
    }
  }
  
  selectModel(model: Model) {
    this.updateState({model: model.id});
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }, 50);
  }
  

  // async generateImage() {

  //   this.currentChatSig.set({
  //       uuid: uuidv4(),
  //       prompt: {
  //         role: "",
  //         mode: "Image",
  //         userPrompt: this.prompt,
  //         systemPrompt: "",
  //         model: this.aiChatSvc.state().prompt.model,
  //         options: {
  //           seed: 0,
  //           num_predict: 0,
  //           temperature: 0
  //         },
  //         control: ""
  //       },
  //       response: "",
  //       reasoning: "",
  //       image: ""
  //     });

  //   try {
  //     const base64Data = await this.aiChatSvc.generateImage(this.prompt, this.aiChatSvc.state().prompt.model);
  //     if (base64Data) {
  //       console.log("Setting image");
  //       const imageUrl = `data:image/png;base64,${base64Data}`;
  //       this.updateCurrentChatSig({
  //         image: imageUrl 
  //       });
  //     }
  //     this.prompt = ""

  //   } catch (error) {
  //     alert('Failed to generate image. Check console for details.');
  //     this.updateCurrentChatSig({
  //       response: 'Failed to generate image. Check console for details.'
  //     })
  //     this.prompt = ""
  //     this.addToHistory();
  //   } finally {
  //     this.addToHistory();
  //   }  
  // }

  /**
   *  this.loading = false;
   *  update history
   *  clear the current chat entity
   */
  addToHistory() {
    this.aiSvc.addToHistory(this.currentChat());
    const mode = this.chatMode();
    this.btnStateSig.set(mode);
    this.currentChat.set(AiInterfaces.NewChatEntity("", this.state().model));
    this.updateState({userPrompt: ""});
  }


  /**
   * submit()
   * when user submits on the chat interface
   * checks the current mode, if it is query, then invoke chat completion
   * if the mode is image generation, calls the image generate function
   */
  async submit() {

    const mode = this.chatMode();
    if (mode == "Query" ) {
      this.getChatResponse();
      this.btnStateSig.set("submitted");
    } else if (mode == "Image" ) {
      console.log("new image generation");
      // this.generateImage();
      this.btnStateSig.set("submitted");
    }
    
    this.scrollToBottom();

  }


  async getChatResponse(): Promise<void> {

    const req: contextMesssage = {
      prompt: this.state().userPrompt,
      model: this.state().model,
    }

    this.currentChat.set(AiInterfaces.NewChatEntity(this.state().userPrompt, this.state().model));
  
    try {
      await this.aiSvc.inStreamRequest(req, this.chatStreamCallback);
    } catch (error) {
      console.error(error);
    } finally {
      this.addToHistory();
    }

  }

  /**
   * chatStreamCallback()
   * callback function, for streaming llm chat completions
   * when streaming call is done, this callback needs to be called
   * to update the ui
   * @param resp 
   */  
  chatStreamCallback = (resp: contextMesssage) => {
    // Append the newly arrived word to our signal string instantly

    const response = this.currentChat().response + resp.response;
    this.updateCurrentChat({
      response: response 
    })
  };

}

