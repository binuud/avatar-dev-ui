import { inject, Service, signal, WritableSignal } from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import { LocalStorageService } from "./local-storage-service";
import { AvatarService, ControlRequest, ControlResponse, GetRequest, GetResponse } from "../../gen/v1/avatar/avatarService.pb";
import { Avatar, AvatarControlAvatarAction } from "../../gen/v1/avatar/avatar.pb";


@Service()
export class AvatarSrv {
  
  localStorageSvc = inject(LocalStorageService);
  public  static STORAGE_KEY = "AvatarSrv";
  private ws: WebSocket | null = null;
  private  WS_ENDPOINT = '/api/avatar/ws';

  // A signal to store incoming messages 
  public avatarControl: WritableSignal<ControlResponse> = signal({});
  public isConnected: WritableSignal<boolean> = signal(false);
  public avatar:  WritableSignal<Avatar> = signal({});

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  get(name: string) {
    const req: GetRequest = {
      name: name,
    } 
    try {
      AvatarService.Get(req, this.initReq).then(response => {
        // console.dir(response);
        if (response.avatar) {
          this.avatar.set(response.avatar);
        }
      });
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {}
  }

  sendAction(action: AvatarControlAvatarAction) {
    const req: ControlRequest = {
      "control": {
        "meta": this.avatar().meta,
        "action": action
      }
    }
    this.sendControl(req);
  }

  /**
   * sendControl()
   * bidirectional stream is not supported on generated code
   * so using websocket here
   * sends message via websocket
   * @param req 
   */
  sendControl(req: ControlRequest) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg: string = JSON.stringify(req);
      this.ws.send(msg);
    } else {
      console.error('WebSocket is not open');
    }
  }

  connect(): void {

    if (this.ws) {
      return; // Already connected or connecting
    }
    console.log('Trying to open websocket to avatar');
    this.ws = new WebSocket(this.WS_ENDPOINT);

    this.ws.onopen = (event) => {
      this.isConnected.set(true);
      // send the avatar initialize action on connet
      // so the server is ready to accept commands
      console.log('WebSocket connection to Avatar opened:', event);
      this.sendAction(AvatarControlAvatarAction.INIT)
    };

    // we got an incoming message
    this.ws.onmessage = (event) => {
      const data:ControlResponse = JSON.parse(event.data);
      this.avatarControl.set(data)
    };

    this.ws.onerror = (error) => {
      this.isConnected.set(false);
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = (event) => {
      this.isConnected.set(false);
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
