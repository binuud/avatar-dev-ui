import { inject, Service, signal, WritableSignal } from "@angular/core";
import { Conscious } from "../../gen/v1/conscious/consciousService.pb";
import { ContextMesssage, UploadRequest, UploadResponse } from "../../gen/v1/conscious/contextMessage.pb";
import { InitReq } from "../../gen/fetch.pb";
import { Model } from "../../gen/v1/conscious/common.pb";
import { LocalStorageService } from "./local-storage-service";
import { Memory, SingleContext } from "../../gen/v1/conscious/memory.pb";
import { ToastSrv } from "./toast-srv";


export interface ConsciousServiceState {

  // if ui can connect to the backend
  // ai service
  connected: boolean;

  // if an api inference call is currently running
  loading: boolean;

  // list of models from the backend
  modelList: Model[];

  // history maintained for display purpose
  memory: Memory;

  // message History is sent in each chat request
  // this allows inference to maintian status of previous chats
  messageHistory?: string[];

}

@Service()
export class ConsciousService {

  toastService = inject(ToastSrv);
  localStorageSvc = inject(LocalStorageService);
  public  static STORAGE_KEY = "ConsciousService";

  initReq: InitReq = {
      pathPrefix: "/api"
  }
  
  state: WritableSignal<ConsciousServiceState> =  signal({
    connected: false,
    loading: false,
    modelList: [],
    memory: {
      contexts: [],
    },
    messageHistory: [],
  });

  currentContext: WritableSignal<SingleContext> = signal({
    in: {},
    out: {}
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
    // console.dir(this.state);
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

  updateCurrentContext(newState: Partial<SingleContext>) {
    this.currentContext.update(state => ({ 
      ...state, 
      ...newState
    }));
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

    
  /**
   *  this.loading = false;
   *  update history
   *  clear the current chat entity
   */
  addToHistory() {
    
    // add current context to memory
    this.appendContextToMemory(this.currentContext());

    // emtpy the current context
    this.updateCurrentContext({
      in: {},
      out: {}
    })

  }
  
  /**
   * inRequest
   * non streaming call for image request, describe image
   * model routing etc
   * @param req 
   * @returns 
   */
  async inRequest(req: ContextMesssage): Promise<any> {
     try {
      return  Conscious.In(req, this.initReq).then(response => {
        if (response.responseImage) {
          console.dir("got image as ai response");
          response.responseImage =  "/static" + response.responseImage;
        } 
        this.updateCurrentContext({
          out: response 
        });
      }).catch(error => {
        this.toastService.notifyError(error['message']);
        this.addToHistory();
      }).finally(() => {
        this.addToHistory()
      });
    } catch (error) {
      console.error(error);
    } 
  }
  

  async generateRequest(req: ContextMesssage): Promise<any> {
    try {
      // await this.aiSvc.inStreamRequest(req, this.chatStreamCallback);
      return Conscious.Generate(req, this.chatStreamCallback, this.initReq).catch(error => {
        this.toastService.notifyError(error['message']);
      }).finally(() => {
        console.log("finally triggered on generateRequest");
        this.addToHistory()
      });
    } catch (error) {
      this.toastService.notifyError("error while generateRequest");
    } finally {
      // this.addToHistory();
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
      response.responseImage =  "/static" + response.responseImage;
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


  inStreamRequest(req: ContextMesssage, myCallback: (resp: ContextMesssage) => void) {
    return Conscious.InStream(req, myCallback, this.initReq);
  }

  uploadFile(req: UploadRequest): Promise <UploadResponse> {
    return Conscious.FileUpload(req, this.initReq);
  }

  appendContextToMemory(context: SingleContext) {
    let memory = this.state().memory;
    if (memory.contexts === undefined) {
      memory.contexts = [];
    }
    memory.contexts.push(context);
    this.updateState({
      memory : memory,
    });
  }

  /**
   * setModel()
   * changes the model for the current session
   */
  setModel() {

    Conscious.ClearMemory({}, this.initReq);
    this.updateState({
      messageHistory: [],
    })
    this.toastService.notifySuccess("Model Changed");
  }

  /**
   * clearMemory()
   * clears the memory from consious server
   * display history is maintained
   */
  clearMemory() {

    Conscious.ClearMemory({}, this.initReq);
    this.updateState({
      messageHistory: [],
    })
    this.toastService.notifySuccess("Cleared Memory");
  }
  
  /**
   * clearDisplayHistory()
   * clears chat display history alone
   */
  clearDisplayHistory() {
    this.updateState({
      memory: {},
      messageHistory: [],
    })
  }
  
  /**
   * reloadTools()
   * reload the tools for the current memory session
   */
  async reloadTools() {
    await Conscious.ReloadTools({}, this.initReq).then(()=>{
      this.toastService.notifySuccess("Tools Reloaded");
    })
    
  }
}
