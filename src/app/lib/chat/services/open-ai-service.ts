import { Service, signal, WritableSignal } from "@angular/core";
import OpenAI from 'openai';
import { Model } from "openai/resources";
import { Stream } from "openai/streaming";




type ChatOperation = 'Query' | 'Chat' | 'Embedding' | 'Embed' | 'Tts' | 'Image' | 'Video'; 

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
}

@Service()
export class OpenAiService {
  
  private  OPENAI_API_ENDPOINT = 'http://127.0.0.1:11434/v1';

  private openAiClient: OpenAI;
  
  state: WritableSignal<OpenAiServiceState> =  signal({
    connected: false,
    loading: false,
    modelList: [],
    prompt: {
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
    }
  });

  constructor() {
    this.openAiClient = new OpenAI({
      baseURL: this.OPENAI_API_ENDPOINT,
      // required but ignored
      apiKey:"ollama", 
      dangerouslyAllowBrowser: true 
    });
    
    this.getModels();
  }

  updateState(newState: Partial<OpenAiServiceState>) {
    this.state.update(state => ({ 
      ...state, 
      ...newState
    }));
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

  
  // Initiates a streaming chat completion
  // @param prompt The user input text
  // @param model the ai model to be used
  async getStreamingCompletion(prompt: string, model : string): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    try {
      return await this.openAiClient.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        stream: true, // Must be true for streaming
      });
    } catch (error) {
      console.error('Error initiating OpenAI stream:', error);
      throw error;
    }
  }

}
