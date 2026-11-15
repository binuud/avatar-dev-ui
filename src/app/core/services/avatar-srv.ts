import { computed, effect, inject, Service, Signal, signal, WritableSignal } from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import { LocalStorageService } from "./local-storage-service";
import { AvatarService, BuildRequest, ControlRequest, ControlResponse, GetRequest, GetResponse } from "../../gen/v1/avatar/avatarService.pb";
import { Avatar, } from "../../gen/v1/avatar/avatar.pb";
import { AvatarAction, AvatarStatus } from "../../gen/v1/avatar/avatarControl.pb";
import { ToastSrv } from "./toast-srv";


// AvatarSrv

// Avatar State Transition

// New Runs
// UI -> Run Button -> Avatar(Conenction Open)
// UI -> WebSocket-Connect -> Avatar
// Avatar (ConnectionOpen) -> UI -> Avatar(INIT)

// Subsequent Runs
// UI -> Run Button -> Avatar(INIT)
// Avatar -> UI (INIT)
// UI -> Avatar (RUN)
// Avatar -> UI (interrupt) -> Handle (Interrupt) -> Avatar (Run-stepnumber)

@Service()
export class AvatarSrv {

  toastService = inject(ToastSrv);
  localStorageSvc = inject(LocalStorageService);
  public  static STORAGE_KEY = "AvatarSrv";
  private ws: WebSocket | null = null;
  private  WS_ENDPOINT = '/api/avatar/ws';

  // A signal to store incoming messages 
  public avatarControl: WritableSignal<ControlResponse> = signal({});
  public isConnected: WritableSignal<boolean> = signal(false);
  public avatar:  WritableSignal<Avatar> = signal({});

  public currentStep: Signal<number> = computed(() => {
    const myAvatarControl = this.avatarControl();
    console.dir(myAvatarControl.control);
    const myStep = myAvatarControl.control?.currentStep;
    console.log("Current step changed " + myStep)
    if (myAvatarControl && myStep && myStep >= 0) {
      return myStep;
    }
    return 0;
  });

  constructor() {
    
    const eff = effect(() => {
      // handle states of avatar
      if (this.isConnected()) {
        if (this.avatarControl()) {
          // triggered when we receive data from server
          if (this.avatarControl().control?.status == AvatarStatus.STATUS_INIT) {
            console.log("Avatar status changed to init");
            this.sendStart();
          } 
        }
      }
    });
  }

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

  async build(name: string): Promise<any> {
    const req: BuildRequest = {
      name: name,
    } 
    try {
      return AvatarService.Build(req, this.initReq).then(response => {
        // console.dir(response);
        if (response.avatar) {
          this.avatar.set(response.avatar);
        }
        this.toastService.notifySuccess("Build Success");
      });
    } catch (error) {
      this.toastService.notifyError("error");
    }  finally {}
  }

  sendAction(action: AvatarAction) {
    console.log("Sending action " + action + " to avatar");
    const req: ControlRequest = {
      control: {
        name: this.avatar().meta?.name,
        avatarUuid: this.avatar().meta?.uuid,
        action: action
      }
    }
    this.sendControl(req);
  }

  sendStart() {
    this.sendAction(AvatarAction.ACTION_BEGIN);
  }

  sendInit() {
    this.sendAction(AvatarAction.ACTION_INIT)
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
      this.sendInit();
    };

    // we got an incoming message
    this.ws.onmessage = (event) => {
      const data:ControlResponse = JSON.parse(event.data);
      console.log("Event from server --> control")
      this.avatarControl.set(data);
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
      this.ws = null;
    }
  }

}
