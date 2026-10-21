import { Component, computed, ElementRef, inject, signal, Signal, ViewChild, WritableSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChatResponse } from "../chat-response/chat-response";
import { ContextMesssage, ContextMesssageContextType } from "../../../gen/v1/conscious/contextMessage.pb";
import { ConsciousService } from "../../../core/services/conscious-service";
import { Model } from "../../../gen/v1/conscious/common.pb";
import { AiInterfaces, ChatEntity } from "../../../core/models/ai-interfaces";
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from "../../../core/services/local-storage-service";
import { SystemMetrics } from "../../../gen/v1/conscious/metrics.pb";
import { SystemMetricsService } from "../../../core/services/system-metrics-service";
import { DecimalPipe, ViewportScroller } from "@angular/common";
import { FileUpload } from "../../ux/file-upload/file-upload";
import { BytesPipe } from "../../../shared/pipes/bytes-pipe";
import { SingleContext } from "../../../gen/v1/conscious/memory.pb";

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
  imports: [FormsModule, ChatResponse, DecimalPipe, FileUpload, BytesPipe],
  selector: "app-chat-prompt-input",
  styleUrl: "./chat-prompt-input.scss",
  templateUrl: "./chat-prompt-input.html",
})

export class ChatPromptInput {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  localStorageSvc = inject(LocalStorageService);
  scroller = inject(ViewportScroller);
  
  public  static STORAGE_KEY = "ChatPromptInput";

  chatModes = ContextMesssageContextType;

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
    mode: ContextMesssageContextType.LLM_QUERY,
    disabled: false,
    fileName: "",
    showFileUpload: false,
  });

  currentContext: WritableSignal<SingleContext> = signal({
    in: {},
    out: {}
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

  emptyCurrentPrompt() {
    // let prompt = this.currentChat().prompt;
    // prompt.userPrompt = "";
    this.updateState({userPrompt: ""});
  }

  saveState() {
    this.localStorageSvc.setItem(ChatPromptInput.STORAGE_KEY, JSON.stringify(this.state()));
  }

  closeCurrentChat() {
    this.addToHistory();
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

  updateCurrentContext(newState: Partial<SingleContext>) {
    this.currentContext.update(state => ({ 
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
   *  this.loading = false;
   *  update history
   *  clear the current chat entity
   */
  addToHistory() {

    this.scrollToBottom();
    // add current context to memory
    this.aiSvc.appendContextToMemory(this.currentContext());

    // emtpy the current context
    this.updateCurrentContext({
      in: {},
      out: {}
    })
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

    this.scrollToId("currentContext");
    const mode = this.state().mode;
    if (mode == ContextMesssageContextType.LLM_QUERY ) {
      console.log("New Chat Completion");
      this.getChatResponse();
      this.btnStateSig.set("submitted");
    } else if (mode == ContextMesssageContextType.IMAGE_GENERATION ) {
      console.log("New image generation");
      this.generateImage();
      this.btnStateSig.set("submitted");
    } else if (mode == ContextMesssageContextType.LLM_IMAGE_DESCRIBE ) {
      console.log("Describe image request");
      this.describeFile();
      this.btnStateSig.set("submitted");
    }
    
    this.scrollToBottom();

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



  async getChatResponse(): Promise<void> {

    const req = this.createNewContextMessage();
    this.updateCurrentContext({
      in: req,
      out: {}
    })
    this.emptyCurrentPrompt();
    // this.currentChat.set(AiInterfaces.NewChatEntity(this.state().userPrompt, this.state().model));
    // let newChatEntity = AiInterfaces.NewChatEntity(this.state().userPrompt, this.state().model);
    // newChatEntity.fileName = this.currentChat().fileName;
    // this.currentChat.set(newChatEntity);

    try {
      // await this.aiSvc.inStreamRequest(req, this.chatStreamCallback);
      await this.aiSvc.generateRequest(req, this.chatStreamCallback);
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
  chatStreamCallback = (response: ContextMesssage) => {
    // Append the newly arrived word to our signal string instantly

    if (response.responseImage) {
      response.responseImage =  "/static/" + response.responseImage;
      this.updateCurrentContext({
        out: response 
      })
    } else {
      let outContext = this.currentContext().out;
      if (outContext && outContext.response) {
        // if the streaming is completed, we send the complete stream in the response
        if (!response.completedAt) {
          response.response = outContext.response + response.response;
        }
      }
      this.updateCurrentContext({
        out: response 
      })
    }
  };

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
   * generateImage()
   * to generate an image using the image generation feature of conscious server
   */ 
  async generateImage() {

    const req = this.createNewContextMessage();
    this.updateCurrentContext({
      in: req,
      out: {}
    })
    this.emptyCurrentPrompt();
  
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
    this.updateCurrentContext({
      in: req,
      out: {}
    })
    this.emptyCurrentPrompt();

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



