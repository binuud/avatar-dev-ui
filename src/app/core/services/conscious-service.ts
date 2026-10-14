import { inject, Service, signal, WritableSignal } from "@angular/core";
import { Conscious } from "../../gen/v1/conscious/consciousService.pb";
import { contextMesssage, UploadRequest, UploadResponse } from "../../gen/v1/conscious/contextMessage.pb";
import { InitReq } from "../../gen/fetch.pb";
import { Model } from "../../gen/v1/conscious/common.pb";
import { OpenAiService } from "../../lib/chat/services/open-ai-service";
import { LocalStorageService } from "./local-storage-service";
import { ChatEntity } from "../models/ai-interfaces";


export interface ConsciousServiceState {

  // if ui can connect to the backend
  // ai service
  connected: boolean;

  // if an api inference call is currently running
  loading: boolean;

  // list of models from the backend
  modelList: Model[];

  // history maintained for display purpose
  history: ChatEntity[];

  // message History is sent in each chat request
  // this allows inference to maintian status of previous chats
  messageHistory?: string[];

}

@Service()
export class ConsciousService {

  localStorageSvc = inject(LocalStorageService);
  public  static STORAGE_KEY = "ConsciousService";

  initReq: InitReq = {
      pathPrefix: "/api"
  }
  
  state: WritableSignal<ConsciousServiceState> =  signal({
    connected: false,
    loading: false,
    modelList: [],
    history: [],
    messageHistory: [],
  });

  constructor() {
    this.loadState();
    this.getModels();
  }

  loadState() {

    const value = this.localStorageSvc.getItem(ConsciousService.STORAGE_KEY);
    
    if (value != "undefined" && value && value?.length ) {
      this.updateState(JSON.parse(value));
    } 
    console.log('ConsciousService service load state');
    
    // connection state has to be from live data
    // this.updateState({connected: false});
    console.dir(this.state);
  }

  saveState() {
    this.localStorageSvc.setItem(ConsciousService.STORAGE_KEY, JSON.stringify(this.state()));
  }

  updateState(newState: Partial<ConsciousServiceState>) {
    this.state.update(state => ({ 
      ...state, 
      ...newState
    }));
    this.saveState();
  }

  /**
   * 
   */
  async getModels() {

    Conscious.GetModels({}, this.initReq).then(response => {

      console.log("Available models:", response.models);

      // backend is working fine
      // enable connected state to true
      this.updateState({connected: true, modelList: response.models});

    }).catch(err => {
      this.updateState({connected: true});
      console.error("Error in model listing ", err);
    });
  }

  
  inRequest(req: contextMesssage): Promise <contextMesssage> {
    return Conscious.In(req, this.initReq);
  }
  
  inStreamRequest(req: contextMesssage, myCallback: (resp: contextMesssage) => void) {
    return Conscious.InStream(req, myCallback, this.initReq);
  }

  uploadFile(req: UploadRequest): Promise <UploadResponse> {
    return Conscious.FileUpload(req, this.initReq);
  }

  /**
   * addToHistory()
   * add current chatEntity to history of  State
   */
  addToHistory(chatEntity: ChatEntity) {

    // let messages: ChatCompletionMessageParam[] = [
    //   {role: 'user', content: chatEntity.prompt.userPrompt},
    //   {role: 'assistant', content: chatEntity.response}
    // ];
    this.updateState({
      history: [...this.state().history, chatEntity],
      // messageHistory: [...this.state().messageHistory, ...messages]
    });
  }

  /**
   * clearMemory()
   * clears the memory, subsequent chat request
   * do not send the saved history or previous chat messagse
   * but messages can still be displayed for user
   */
  clearMemory() {
    this.updateState({
      messageHistory: [],
    })
  }

  /**
   * clearChatHistory()
   * clears the memory, and history used for displaying previous chat messages
   */
  clearChatHistory() {
    this.updateState({
      history: [],
      messageHistory: [],
    })
  }



}
