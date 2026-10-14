import { v4 as uuidv4 } from 'uuid';
import { contextMesssageContextType } from '../../gen/v1/conscious/contextMessage.pb';

// for tracking current chat inference
export interface ChatEntity {
  uuid: string;
  prompt: PromptInterface;
  mode: contextMesssageContextType;
  response: string;
  responseImage: string;
  reasoning: string;
  image: string;
  fileName: string;
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

export type ChatOperation = 'Query' | 'Chat' | 'Embedding' | 'Embed' | 'Tts' | 'Image' | 'Video'; 

export interface PromptOptions {

  // seed sets the initial random tensor
  // use same seed for deterministic output
  seed: number;

  num_predict: number;

  // how close the prompt has to be adhered to
  temperature: number;
}

export class AiInterfaces {

  static GetEmptyPrompt(): PromptInterface {
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

  static NewChatEntity(prompt: string | "", model: string): ChatEntity {
    return({
        uuid: uuidv4(),
        prompt: {
          role: "",
          mode: "Query",
          userPrompt: prompt,
          systemPrompt: "",
          model: model,
          options: {
            seed: 0,
            num_predict: 0,
            temperature: 0
          },
          control: ""
        },
        mode: contextMesssageContextType.LLM_QUERY,
        response: "",
        responseImage: "",
        reasoning: "",
        image: "",
        fileName: "",
    });
  }
}
