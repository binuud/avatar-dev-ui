import { Component, inject } from "@angular/core";
import { QuantumAiCamera } from "../../lib/quatumUI/quantum-ai-camera/quantum-ai-camera";
import { SensorEventsSvc } from "../../core/services/sensor-events-svc";
import { ContextMesssage } from "../../gen/v1/conscious/contextMessage.pb";

@Component({
  imports: [QuantumAiCamera],
  selector: "app-manage-robots-page",
  styleUrl: "./manage-robots-page.scss",
  templateUrl: "./manage-robots-page.html",
})
export class ManageRobotsPage {
  aiEventsSvc = inject(SensorEventsSvc);

  constructor() {
    this.aiEventsSvc.connectSensorEvents();
  }

  sendEvent($event: ContextMesssage) {
    this.aiEventsSvc.sendEvent($event);
  }
}
