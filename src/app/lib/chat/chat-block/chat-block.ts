import { Component, computed, inject } from "@angular/core";
import { ChatPromptInput } from "../chat-prompt-input/chat-prompt-input";
import { ConnectionErrorMessage } from "../connection-error-message/connection-error-message";
import { ChatHistory } from "../chat-history/chat-history";
import { ConsciousService } from "../../../core/services/conscious-service";
import { QuantumAiCamera } from "../../quatumUI/quantum-ai-camera/quantum-ai-camera";
import {
  ContextMesssage,
  ContextMesssageContextType,
} from "../../../gen/v1/conscious/contextMessage.pb";
import { SensorEventsSvc } from "../../../core/services/sensor-events-svc";
import { Detection } from "../../../core/models/ai-interfaces";

@Component({
  imports: [
    ChatPromptInput,
    ConnectionErrorMessage,
    ChatHistory,
    QuantumAiCamera,
  ],
  selector: "app-chat-block",
  styleUrl: "./chat-block.scss",
  templateUrl: "./chat-block.html",
})
export class ChatBlock {
  aiSvc = inject(ConsciousService);
  aiEventsSvc = inject(SensorEventsSvc);

  constructor() {
    this.aiEventsSvc.connectSensorEvents();
  }

  sendEvent($event: ContextMesssage) {
    this.aiEventsSvc.sendEvent($event);
  }
}
