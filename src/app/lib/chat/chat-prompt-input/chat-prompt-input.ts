import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, Signal, ViewChild, WritableSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChatResponse } from "../chat-response/chat-response";
import { ContextMesssage, ContextMesssageContextType } from "../../../gen/v1/conscious/contextMessage.pb";
import { ConsciousService } from "../../../core/services/conscious-service";
import { Model } from "../../../gen/v1/conscious/common.pb";
import { AiInterfaces, ChatEntity } from "../../../core/models/ai-interfaces";
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from "../../../core/services/local-storage-service";
import { ViewportScroller } from "@angular/common";
import { FileUpload } from "../../ux/file-upload/file-upload";
import { ActionButton } from "../../../core/components/action-button/action-button";
import { RouterLink } from "@angular/router";


export interface MultiStateButtonConfig {
  id: string;           // Unique identifier for the state (e.g., 'idle', 'loading', 'success')
  text?: string;        // Text to display for this state
  iconClass: string;    // Optional CSS class for the icon (FontAwesome, Material Icons, etc.)
  disabled: boolean;    // Whether the button should be disabled in this state
  title?: string;       // title shown on hover
}

export interface ChatPromptInputState {
  userPrompt: string;
  model: string;
  mode: ContextMesssageContextType;
  reasoning?: string;
  response?: string;
  disabled: boolean;
  fileName: string;
  showFileUpload: boolean;
}

@Component({
  imports: [ActionButton, FormsModule, ChatResponse, FileUpload, RouterLink],
  selector: "app-chat-prompt-input",
  styleUrl: "./chat-prompt-input.scss",
  templateUrl: "./chat-prompt-input.html",
})

export class ChatPromptInput {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  localStorageSvc = inject(LocalStorageService);
  scroller = inject(ViewportScroller);
  aiSvc = inject(ConsciousService);

  public  static STORAGE_KEY = "ChatPromptInput";

  chatModes = ContextMesssageContextType;

  defaultBtnState: MultiStateButtonConfig ={ id: "new", iconClass: "fa-solid fa-play", disabled: false};

  btnConfigMap = new Map<string, MultiStateButtonConfig>([
    ["Query",             { id: "new", iconClass: "fa-solid fa-play", disabled: false }],
    ["Image",             { id: "Image", iconClass: "fa-solid fa-image", disabled: false }],
    ["ImageEdit",         { id: "Image", iconClass: "fa-solid fa-palette", disabled: false }],
    ["ImageQuery",        { id: "ImageQuery", iconClass: "fa-solid fa-circle-question", disabled: false }],
    ["submitted_wait",    { id: "submitted_wait", iconClass: "fa-solid fa-circle-notch fa-spin", disabled: false }],
    ["submitted",         { id: "submitted", iconClass: "fa-solid fa-stop", disabled: false }]
  ]);


  state: WritableSignal<ChatPromptInputState> = signal({
    userPrompt: "",
    model: "",
    mode: ContextMesssageContextType.LLM_QUERY,
    disabled: false,
    fileName: "",
    showFileUpload: false,
  });

  btnStateSig: WritableSignal<string> = signal("new");
  btnConfigSig = computed(() => this.btnConfigMap.get(this.btnStateSig()) ?? this.defaultBtnState );

  currentChat:  WritableSignal<ChatEntity> = signal(AiInterfaces.NewChatEntity("",""));

  constructor() {
    this.loadState();
  }

  loadState() {

    const value = this.localStorageSvc.getItem(ChatPromptInput.STORAGE_KEY);
    if (value != "undefined" && value && value?.length ) {
      this.updateState(JSON.parse(value));
    } 
    this.setMode(this.state().mode);
  }

  emptyCurrentPrompt() {
    // let prompt = this.currentChat().prompt;
    // prompt.userPrompt = "";
    this.updateState({userPrompt: ""});
  }

  saveState() {
    this.localStorageSvc.setItem(ChatPromptInput.STORAGE_KEY, JSON.stringify(this.state()));
  }

  closeCurrentChat() {
    this.aiSvc.addToHistory();
  }

  toggleFileUpload() {
    this.updateState({showFileUpload: !this.state().showFileUpload});
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
    this.saveState();
  }

  fileUploaded(event: string) {
    console.log("received file name " + event);
    this.updateState({fileName: event});
  }

  /**
   * setMode()
   * allow generation mode to be selected
   * it can be query or image generation
   * @param mode all
   */
  setMode(mode: ContextMesssageContextType) {
    this.updateState({mode: mode})
    if (mode == ContextMesssageContextType.LLM_QUERY) {
      this.btnStateSig.set('Query');
    } else if (mode == ContextMesssageContextType.IMAGE_GENERATION) {
      this.btnStateSig.set('Image');
    } else if (mode == ContextMesssageContextType.IMAGE_EDIT) {
      this.btnStateSig.set('ImageEdit');
    } else if (mode == ContextMesssageContextType.LLM_IMAGE_DESCRIBE) {
      this.btnStateSig.set('ImageQuery');
    }
  }
  
  selectModel(model: Model) {
    this.updateState({model: model.id});
  }

  private scrollToBottom(): void {
    console.log("Scroll to bottom");
    // setTimeout(() => {
    //   try {
    //     this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    //   } catch (err) {}
    // }, 50);
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth' // Creates a fluid animation effect
    });
  }

  scrollToId(id: string) {
    this.scroller.scrollToAnchor("chatPromptBlock");
  }

  /**
   * onEnter
   * this is to fix the problem of enter not triggerend event on action button
   * since I am using action button, with a promise to the service function
   * the promise is used for animation events, I need to jump the event on text area 
   * to the jump button
   * @param event 
   * @param actionBtnComponent 
   * @returns 
   */
  onEnter(event: Event, actionBtnComponent: any): void {
    const keyboardEvent = event as KeyboardEvent;

    // Allow Shift+Enter to still create a new line
    if (keyboardEvent.shiftKey) {
      return;
    }

    // Prevent adding a new line to the textarea
    keyboardEvent.preventDefault();

    // Find the native button inside <app-action-button> and click it
    // Note: If actionBtnComponent is an ElementRef, use actionBtnComponent.nativeElement
    const nativeBtn = actionBtnComponent?.elementRef?.nativeElement?.querySelector('button') 
                  || document.querySelector('app-action-button button');
                  
    if (nativeBtn && !nativeBtn.disabled) {
      (nativeBtn as HTMLButtonElement).click();
    }
  }

  /**
   * submit()
   * when user submits on the chat interface
   * checks the current mode, if it is query, then invoke chat completion
   * if the mode is image generation, calls the image generate function
   */
  async submit(): Promise<any> {

    this.scrollToId("currentContext");
    const req = this.createNewContextMessage();
    this.aiSvc.updateCurrentContext({
      in: req,
      out: {}
    })
    this.emptyCurrentPrompt();

    const mode = this.state().mode;
    this.scrollToBottom();
    // this.setMode(this.state().mode);
    this.currentChat.set(AiInterfaces.NewChatEntity("", this.state().model));
    this.updateState({userPrompt: ""});
    // this.btnStateSig.set("submitted");
    if (mode == ContextMesssageContextType.LLM_QUERY ) {
      console.log("New Chat Completion");
      return this.aiSvc.generateRequest(req);
    } else if (mode == ContextMesssageContextType.IMAGE_GENERATION ) {
      console.log("New image generation");
      return this.aiSvc.inRequest(req);
    } else if (mode == ContextMesssageContextType.LLM_IMAGE_DESCRIBE ) {
      console.log("Describe image request");
      return this.aiSvc.inRequest(req);
    } else if (mode == ContextMesssageContextType.IMAGE_EDIT ) {
      console.log("Edit image request");
      return this.aiSvc.inRequest(req);
    }

  }

  createNewContextMessage():ContextMesssage {
    return {
      uuid: uuidv4(),
      prompt: this.state().userPrompt,
      model: this.state().model,
      type: this.state().mode,
      data: this.state().fileName
    }
  }

}



