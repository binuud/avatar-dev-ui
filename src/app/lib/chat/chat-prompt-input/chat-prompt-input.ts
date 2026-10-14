import { Component, computed, ElementRef, inject, signal, Signal, ViewChild, WritableSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChatResponse } from "../chat-response/chat-response";
import { contextMesssage, contextMesssageContextType } from "../../../gen/v1/conscious/contextMessage.pb";
import { ConsciousService } from "../../../core/services/conscious-service";
import { Model } from "../../../gen/v1/conscious/common.pb";
import { AiInterfaces, ChatEntity } from "../../../core/models/ai-interfaces";
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from "../../../core/services/local-storage-service";
import { SystemMetrics } from "../../../gen/v1/conscious/metrics.pb";
import { SystemMetricsService } from "../../../core/services/system-metrics-service";
import { DecimalPipe } from "@angular/common";
import { FileUpload } from "../../ux/file-upload/file-upload";

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
  mode: contextMesssageContextType;
  contextMesssage?: contextMesssage;
  reasoning?: string;
  response?: string;
  disabled: boolean;
  fileName: string;
}

@Component({
  imports: [FormsModule, ChatResponse, DecimalPipe, FileUpload],
  selector: "app-chat-prompt-input",
  styleUrl: "./chat-prompt-input.scss",
  templateUrl: "./chat-prompt-input.html",
})

export class ChatPromptInput {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  localStorageSvc = inject(LocalStorageService);
  
  public  static STORAGE_KEY = "ChatPromptInput";

  chatModes = contextMesssageContextType;

  aiSvc = inject(ConsciousService);
  metricsSvc = inject(SystemMetricsService);

  defaultBtnState: MultiStateButtonConfig ={ id: "new", iconClass: "fa-solid fa-play", disabled: false};

  btnConfigMap = new Map<string, MultiStateButtonConfig>([
    ["Query",             { id: "new", iconClass: "fa-solid fa-play", disabled: false }],
    ["Image",             { id: "Image", iconClass: "fa-solid fa-image", disabled: false }],
    ["ImageQuery",        { id: "ImageQuery", iconClass: "fa-solid fa-circle-question", disabled: false }],
    ["submitted_wait",    { id: "submitted_wait", iconClass: "fa-solid fa-circle-notch fa-spin", disabled: false }],
    ["submitted",         { id: "submitted", iconClass: "fa-solid fa-stop", disabled: false }]
  ]);

  metrics: WritableSignal<SystemMetrics> = signal({});
  state: WritableSignal<ChatPromptInputState> = signal({
    userPrompt: "",
    model: "",
    mode: contextMesssageContextType.LLM_QUERY,
    disabled: false,
    fileName: ""
  });

  btnStateSig: WritableSignal<string> = signal("new");
  btnConfigSig = computed(() => this.btnConfigMap.get(this.btnStateSig()) ?? this.defaultBtnState );

  currentChat:  WritableSignal<ChatEntity> = signal(AiInterfaces.NewChatEntity("",""));

  constructor() {
    this.loadState();
    this.getMetricsStream();
  }

  loadState() {

    const value = this.localStorageSvc.getItem(ChatPromptInput.STORAGE_KEY);
    if (value != "undefined" && value && value?.length ) {
      this.updateState(JSON.parse(value));
    } 
    this.setMode(this.state().mode);
    console.dir(this.state);
  }

  saveState() {
    this.localStorageSvc.setItem(ChatPromptInput.STORAGE_KEY, JSON.stringify(this.state()));
  }

  closeCurrentChat() {
    this.addToHistory();
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
  setMode(mode: contextMesssageContextType) {
    this.updateState({mode: mode})
    if (mode == contextMesssageContextType.LLM_QUERY) {
      this.btnStateSig.set('Query');
    } else if (mode == contextMesssageContextType.IMAGE_GENERATION) {
      this.btnStateSig.set('Image');
    } else if (mode == contextMesssageContextType.LLM_IMAGE_DESCRIBE) {
      this.btnStateSig.set('ImageQuery');
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
  
  /**
   *  this.loading = false;
   *  update history
   *  clear the current chat entity
   */
  addToHistory() {
    this.aiSvc.addToHistory(this.currentChat());
    this.setMode(this.state().mode);
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

    const mode = this.state().mode;
    if (mode == contextMesssageContextType.LLM_QUERY ) {
      console.log("New Chat Completion");
      this.getChatResponse();
      this.btnStateSig.set("submitted");
    } else if (mode == contextMesssageContextType.IMAGE_GENERATION ) {
      console.log("New image generation");
      this.generateImage();
      this.btnStateSig.set("submitted");
    } else if (mode == contextMesssageContextType.LLM_IMAGE_DESCRIBE ) {
      console.log("Describe image request");
      this.describeFile();
      this.btnStateSig.set("submitted");
    }
    
    this.scrollToBottom();

  }

  createNewContextMessage():contextMesssage {
    return {
      uuid: uuidv4(),
      prompt: this.state().userPrompt,
      model: this.state().model,
      type: this.state().mode,
      data: this.state().fileName
    }
  }


  async getChatResponse(): Promise<void> {

    const req = this.createNewContextMessage();

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
   * metricsStreamCallback()
   * callback function, for streaming llm chat completions
   * when streaming call is done, this callback needs to be called
   * to update the ui
   * @param resp 
   */  
  metricsStreamCallback = (resp: SystemMetrics) => {
    // Append the newly arrived word to our signal string instantly

    this.metrics.set(resp);
  };

  /**
   * getMetricsStream()
   * get cpu usage, gpu usage metrics from server
   */ 
  async getMetricsStream() {

  
    try {
      await this.metricsSvc.streamMetrics(this.metricsStreamCallback);
    } catch (error) {
      alert(error);
      console.log("metrics server closed connection");
      console.error(error);
      
    } finally {
      console.log("metrics server closed connection");
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

  /**
   * generateImage()
   * to generate an image using the image generation feature of conscious server
   */ 
  async generateImage() {

    const req = this.createNewContextMessage();
    this.currentChat.set(AiInterfaces.NewChatEntity(this.state().userPrompt, this.state().model));
  
    try {
      await this.aiSvc.inRequest(req).then(response => {
        this.updateCurrentChat({
          responseImage: "/static/" + response.responseImage
        });
        console.dir(response);
      });
    } catch (error) {
      alert(error);
      console.error(error);
      this.updateCurrentChat({
        response: 'Failed to generate image. Check console for details.'
      });
      this.addToHistory();
    } finally {
      this.addToHistory();
    }

  }

  /**
   * describeFile()
   * ask llm to query the uploaded image
   */ 
  async describeFile() {

    const req = this.createNewContextMessage();

    let newChatEntity = AiInterfaces.NewChatEntity(this.state().userPrompt, this.state().model);
    newChatEntity.fileName = this.currentChat().fileName;
    this.currentChat.set(newChatEntity);

    try {
      await this.aiSvc.inRequest(req).then(result => {
        this.updateCurrentChat({
          response: result.response
        });
        console.dir(result);
      });
    } catch (error) {
      alert(error);
      console.error(error);
      this.updateCurrentChat({
        response: 'Failed to generate image. Check console for details.'
      });
      this.addToHistory();
    } finally {
      this.addToHistory();
    }
  }

}



