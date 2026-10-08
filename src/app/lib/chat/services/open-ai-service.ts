import { inject, Service, Signal, signal, WritableSignal } from "@angular/core";
import OpenAI from 'openai';
import { Chat, ChatCompletionMessageParam, Model } from "openai/resources";
import { Stream } from "openai/streaming";
import { LocalStorageService } from "../../../core/services/local-storage-service";




export type ChatOperation = 'Query' | 'Chat' | 'Embedding' | 'Embed' | 'Tts' | 'Image' | 'Video'; 

// for tracking current chat inference
export interface ChatEntity {
  uuid: string;
  prompt: PromptInterface;
  response: string;
  reasoning: string;
  image: string;
}

export interface PromptInterface  {
  role: string;
  mode: ChatOperation;
  userPrompt: string;
  systemPrompt: string;
  model: string;
  options: PromptOptions;
  control: string;
}


export interface PromptOptions {

  // seed sets the initial random tensor
  // use same seed for deterministic output
  seed: number;

  num_predict: number;

  // how close the prompt has to be adhered to
  temperature: number;
}

export interface OpenAiServiceState {

  // if ui can connect to the backend
  // ai service
  connected: boolean;

  // if an api inference call is currently running
  loading: boolean;

  // list of models from the backend
  modelList: Model[];

  // current prompt
  prompt: PromptInterface;

  // history maintained for display purpose
  history: ChatEntity[];

  // message History is sent in each chat request
  // this allows inference to maintian status of previous chats
  messageHistory: ChatCompletionMessageParam[];

}

@Service()
export class OpenAiService {
  
  localStorageSvc = inject(LocalStorageService);

  public  static STORAGE_KEY = "OpenAiService";
  private  OPENAI_API_ENDPOINT = 'http://127.0.0.1:11434/v1';

  private openAiClient: OpenAI;

  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: 'You are a helpful and concise coding assistant.' }
  ];
  
  state: WritableSignal<OpenAiServiceState> =  signal({
    connected: false,
    loading: false,
    modelList: [],
    history: [],
    messageHistory: [],
    prompt: this.getEmptyPrompt(),
  });

  constructor() {
    this.openAiClient = new OpenAI({
      baseURL: this.OPENAI_API_ENDPOINT,
      // required but ignored
      apiKey:"ollama", 
      dangerouslyAllowBrowser: true 
    });
    
    this.loadState();
    this.getModels();
  }

  saveState() {
    this.localStorageSvc.setItem(OpenAiService.STORAGE_KEY, JSON.stringify(this.state()));
  }

  loadState() {

    const value = this.localStorageSvc.getItem(OpenAiService.STORAGE_KEY);
    
    if (value != "undefined" && value && value?.length ) {
      this.updateState(JSON.parse(value));
    } 
    console.log('OpenAiService service load state');
    
    // connection state has to be from live data
    this.updateState({connected: false});
    console.dir(this.state);
  }

  getEmptyPrompt(): PromptInterface {
    return({
      role: "user",
      mode: "Chat",
      userPrompt: "",
      systemPrompt: "",
      model: "",
      options: {
        seed: 0,
        temperature: 0.8,
        num_predict: 5000,
      },
      control: "",
    });
  }

  updateState(newState: Partial<OpenAiServiceState>) {
    this.state.update(state => ({ 
      ...state, 
      ...newState
    }));
    this.saveState();
  }

  selectModel(model: Model) {
    const prompt = this.state().prompt;
    prompt.model = model.id;
    this.updateState({prompt: prompt});
  }

  // getModels from backend
  // finally the openai service will be proxied by backend
  async getModels() {

    this.openAiClient.models.list().then(response => {

      console.log("Available models:", response.data);

      // backend is working fine
      // enable connected state to true
      this.updateState({connected: true, modelList: response.data});
      
    }).catch(err => {
      this.updateState({connected: false});
      console.error("Error in model listing ", err);
    });
  
  }
  
  /**
   * getStreamingCompletion()
   * Initiates a streaming chat completion
   */
  async getStreamingCompletion(prompt: string, model : string): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    try {
      return await this.openAiClient.chat.completions.create({
        model: model,
        messages: [...this.state().messageHistory, { role: 'user', content: prompt }],
        stream: true, // Must be true for streaming
      });
    } catch (error) {
      console.error('Error initiating OpenAI stream:', error);
      throw error;
    }
  }

  /**
   * addToHistory()
   * add current chatEntity to history of  State
   */
  async generateImage(prompt: string, model : string): Promise<string | undefined> {
    try {
      const response = await this.openAiClient.images.generate({
        model: model, // Or 'dall-e-3' / 'gpt-image-2.5-sunburst'
        prompt: prompt,
        n: 1,
        // size: '256x256',
        size: '1024x1024',
        response_format: 'b64_json'  // Safe approach for rendering base64
      });
      const responseJson = JSON.parse(String(response));
      if (responseJson && responseJson.data && responseJson.data[0].b64_json) {
        // Returns the base64 string or the URL depending on your response_format configuration
        console.log("Got image data");
        return responseJson.data[0].b64_json; 
      }
      return "";

    } catch (error) {
      console.error('Error generating image via OpenAI:', error);
      throw error;
    }
  }

  /**
   * addToHistory()
   * add current chatEntity to history of  State
   */
  addToHistory(chatEntity: ChatEntity) {

    let messages: ChatCompletionMessageParam[] = [
      {role: 'user', content: chatEntity.prompt.userPrompt},
      {role: 'assistant', content: chatEntity.response}
    ];
    this.updateState({
      history: [...this.state().history, chatEntity],
      messageHistory: [...this.state().messageHistory, ...messages]
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
