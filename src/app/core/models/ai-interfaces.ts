import { v4 as uuidv4 } from "uuid";
import { ContextMesssageContextType } from "../../gen/v1/conscious/contextMessage.pb";
import { SingleContext } from "../../gen/v1/conscious/memory.pb";

// for tracking current chat inference
export interface ChatEntity {
  uuid: string;
  prompt: PromptInterface;
  mode: ContextMesssageContextType;
  response: string;
  responseImage: string;
  reasoning: string;
  image: string;
  fileName: string;
  currentContext: SingleContext;
}

export interface PromptInterface {
  role: string;
  mode: ChatOperation;
  userPrompt: string;
  systemPrompt: string;
  model: string;
  options: PromptOptions;
  control: string;
}

export type ChatOperation =
  "Query" | "Chat" | "Embedding" | "Embed" | "Tts" | "Image" | "Video";

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
    return {
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
    };
  }

  static NewChatEntity(prompt: string | "", model: string): ChatEntity {
    return {
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
          temperature: 0,
        },
        control: "",
      },
      mode: ContextMesssageContextType.LLM_QUERY,
      response: "",
      responseImage: "",
      reasoning: "",
      image: "",
      fileName: "",
      currentContext: {},
    };
  }
}

export interface YoloResponse {
  model: string;
  image_size: {
    width: number;
    height: number;
  };
  count: number;
  detections: Detection[];
}

export interface Detection {
  box_xyxy: [number, number, number, number]; // Bounding box coordinates [x1, y1, x2, y2]
  box_xyxy_normalized: [number, number, number, number];
  confidence: number; // Confidence score
  class_id: number; // Class ID
  label: string; // Object class name
}
