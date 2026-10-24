import { inject, Service, signal, WritableSignal } from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import { LocalStorageService } from "./local-storage-service";
import { AvatarService, ControlRequest, ControlResponse, GetRequest, GetResponse } from "../../gen/v1/avatar/avatarService.pb";


@Service()
export class AvatarSrv {
  
  localStorageSvc = inject(LocalStorageService);
  public  static STORAGE_KEY = "AvatarSrv";
  private ws: WebSocket | null = null;
  private  WS_ENDPOINT = '/api/avatar/ws';

  // A signal to store incoming messages 
  public avatarControl: WritableSignal<ControlResponse> = signal({});
  public isConnected: WritableSignal<boolean> = signal(false);

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  constructor() {
    this.connect(this.WS_ENDPOINT);
  }

  get(name: string): Promise <GetResponse> {
    const req: GetRequest = {
      name: name,
    } 
    return AvatarService.Get(req, this.initReq);
  }


  /**
   * control()
   * bidirectional stream is not supported on generated code
   * so using websocket here
   * sends message via websocket
   * @param req 
   */
  control(req: ControlRequest) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg: string = JSON.stringify(req);
      this.ws.send(msg);
    } else {
      // try connecting 
      this.connect(this.WS_ENDPOINT);
      console.error('WebSocket is not open');
    }
  }

  connect(url: string): void {

    if (this.ws) {
      return; // Already connected or connecting
    }
    console.log('Trying to open websocket to avatar');
    this.ws = new WebSocket(url);

    this.ws.onopen = (event) => {
      this.isConnected.set(true);
      console.log('WebSocket connection to Avatar opened:', event);
    };

    // we got an incoming message
    this.ws.onmessage = (event) => {
      const data:ControlResponse = JSON.parse(event.data);
      this.avatarControl.set(data)
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  }

  close(): void {
    // this.messageSub.unsubscribe();
    if (this.ws) {
      this.ws.close();
      this.isConnected.set(false);
    }
  }

}
