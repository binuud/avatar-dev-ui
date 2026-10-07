import { Service } from "@angular/core";
import OpenAI from 'openai';
import { Model } from "openai/resources";

@Service()
export class OpenAiService {
  
  private  OPENAI_API_ENDPOINT = 'http://127.0.0.1:11434/v1';
  private openAiClient: OpenAI;
  modelList: Model[] = [];
  
  constructor() {
    this.openAiClient = new OpenAI({
      baseURL: this.OPENAI_API_ENDPOINT,
      // required but ignored
      apiKey:"ollama", 
      dangerouslyAllowBrowser: true 
    });
    
    this.getModels();
  }

  // getModels from backend
  // finally the openai service will be proxied by backend
  async getModels() {

    this.openAiClient.models.list().then(response => {
      console.log("Available models:", response.data);
      this.modelList.length = 0;
      this.modelList.push(...response.data);
      // backend is working fine
      // this.updateState({connected: true});
      
    }).catch(err => {
      // this.updateState({connected: false});
      console.error("Error in model listing ", err);
    });
  
  }

}
