import { effect, Service, signal, WritableSignal } from "@angular/core";
import { ContextMesssage } from "../../gen/v1/conscious/contextMessage.pb";

@Service()
export class SensorEventsSvc {
  private ws: WebSocket | null = null;
  private WS_ENDPOINT = "/api/conscious/sensorEvents/ws";
  public isConnected: WritableSignal<boolean> = signal(false);

  public sensorEvent: WritableSignal<ContextMesssage> = signal({});

  constructor() {
    const eff = effect(() => {
      // handle states of avatar
      if (this.isConnected()) {
        if (this.sensorEvent()) {
          // triggered when we receive data from server
          console.log(`got data from server`);
        }
      }
    });
  }

  /**
   * sendEvent()
   * bidirectional stream is not supported on generated code
   * so using websocket here
   * sends message via websocket
   * @param req
   */
  sendEvent(req: ContextMesssage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg: string = JSON.stringify(req);
      this.ws.send(msg);
    } else {
      console.error("WebSocket is not open");
    }
  }

  connectSensorEvents(): void {
    if (this.ws) {
      return; // Already connected or connecting
    }
    console.log("Trying to open websocket to conscious server");
    this.ws = new WebSocket(this.WS_ENDPOINT);

    this.ws.onopen = (event) => {
      this.isConnected.set(true);
      // send the avatar initialize action on connet
      // so the server is ready to accept commands
      console.log("WebSocket connection to Avatar opened:", event);
      this.sendEvent({
        name: "Test",
      });
    };

    // we got an incoming message
    this.ws.onmessage = (event) => {
      const data: ContextMesssage = JSON.parse(event.data);
      console.log(`Event ${data.type} from sensor events server --> control`);
      this.sensorEvent.set(data);
    };

    this.ws.onerror = (error) => {
      this.isConnected.set(false);
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = (event) => {
      this.isConnected.set(false);
      console.log("WebSocket connection closed:", event);
    };
  }
}
