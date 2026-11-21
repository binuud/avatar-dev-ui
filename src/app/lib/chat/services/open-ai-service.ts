import { inject, Service, signal, WritableSignal } from "@angular/core";
import OpenAI from "openai";
import { ChatCompletionMessageParam, Model } from "openai/resources";
import { Stream } from "openai/streaming";

import { GlobalConfig } from "../../../config/global-config";
import { Conscious } from "../../../gen/v1/conscious/consciousService.pb";
import { InitReq } from "../../../gen/fetch.pb";
import {
  PromptInterface,
  ChatEntity,
  AiInterfaces,
} from "../../../core/models/ai-interfaces";
import { ContextMesssage } from "../../../gen/v1/conscious/contextMessage.pb";
import { LocalStorageAbstract } from "../../../core/abstractClasses/local-storage-abstract";

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

const Initial_OpenAiServiceState: OpenAiServiceState = {
  connected: false,
  loading: false,
  modelList: [],
  history: [],
  messageHistory: [],
  prompt: AiInterfaces.GetEmptyPrompt(),
};

@Service()
export class OpenAiService extends LocalStorageAbstract<OpenAiServiceState> {
  public static STORAGE_KEY = "OpenAiService";
  private OPENAI_API_ENDPOINT = GlobalConfig.LLM_HOST + "/v1/";

  private openAiClient: OpenAI;

  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "You are a helpful and concise coding assistant.",
    },
  ];

  constructor() {
    super(OpenAiService.STORAGE_KEY, Initial_OpenAiServiceState);
    this.openAiClient = new OpenAI({
      baseURL: this.OPENAI_API_ENDPOINT,
      // required but ignored
      apiKey: "ollama",
      dangerouslyAllowBrowser: true,
    });
  }

  selectModel(model: Model) {
    const prompt = this.state().prompt;
    prompt.model = model.id;
    this.patchState({ prompt: prompt });
  }

  // getModels from backend
  // finally the openai service will be proxied by backend
  async getModels() {
    this.openAiClient.models
      .list()
      .then((response) => {
        console.log("Available models:", response.data);

        // backend is working fine
        // enable connected state to true
        this.patchState({ connected: true, modelList: response.data });
      })
      .catch((err) => {
        this.patchState({ connected: true });
        console.error("Error in model listing ", err);
      });
  }

  /**
   * getStreamingCompletion()
   * Initiates a streaming chat completion
   */
  async getStreamingCompletion(
    prompt: string,
    model: string,
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    try {
      return await this.openAiClient.chat.completions.create({
        model: model,
        messages: [
          ...this.state().messageHistory,
          { role: "user", content: prompt },
        ],
        stream: true, // Must be true for streaming
      });
    } catch (error) {
      console.error("Error initiating OpenAI stream:", error);
      throw error;
    }
  }

  /**
   * addToHistory()
   * add current chatEntity to history of  State
   */
  async generateImage(
    prompt: string,
    model: string,
  ): Promise<string | undefined> {
    try {
      const response = await this.openAiClient.images.generate({
        model: model, // Or 'dall-e-3' / 'gpt-image-2.5-sunburst'
        prompt: prompt,
        n: 1,
        // size: '256x256',
        size: "1024x1024",
        response_format: "b64_json", // Safe approach for rendering base64
      });
      const responseJson = JSON.parse(String(response));
      if (responseJson && responseJson.data && responseJson.data[0].b64_json) {
        // Returns the base64 string or the URL depending on your response_format configuration
        console.log("Got image data");
        return responseJson.data[0].b64_json;
      }
      return "";
    } catch (error) {
      console.error("Error generating image via OpenAI:", error);
      throw error;
    }
  }

  /**
   * addToHistory()
   * add current chatEntity to history of  State
   */
  addToHistory(chatEntity: ChatEntity) {
    let messages: ChatCompletionMessageParam[] = [
      { role: "user", content: chatEntity.prompt.userPrompt },
      { role: "assistant", content: chatEntity.response },
    ];
    this.patchState({
      history: [...this.state().history, chatEntity],
      messageHistory: [...this.state().messageHistory, ...messages],
    });
  }

  /**
   * clearMemory()
   * clears the memory, subsequent chat request
   * do not send the saved history or previous chat messagse
   * but messages can still be displayed for user
   */
  clearMemory() {
    this.patchState({
      messageHistory: [],
    });
  }

  /**
   * clearChatHistory()
   * clears the memory, and history used for displaying previous chat messages
   */
  clearChatHistory() {
    this.patchState({
      history: [],
      messageHistory: [],
    });
  }

  async streamChat(prompt: string, model: string): Promise<Response> {
    const url = `/api/chat?prompt=${encodeURIComponent(prompt)}`;
    try {
      return await fetch(url);
    } catch (error) {
      console.error("Error initiating streamChat stream:", error);
      throw error;
    }
  }

  async newStreamChat(
    prompt: string,
    myCallback: (resp: ContextMesssage) => void,
    model: string,
  ): Promise<void> {
    const req: ContextMesssage = {
      prompt: prompt,
      model: model,
    };
    const initReq: InitReq = {
      pathPrefix: "/api",
    };

    return await Conscious.InStream(req, myCallback, initReq).then(
      (resp) => {},
    );
  }
}
