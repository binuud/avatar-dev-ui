import { inject, Service } from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import { LocalStorageService } from "./local-storage-service";
import { AvatarService, GetRequest, GetResponse } from "../../gen/v1/avatar/avatarService.pb";


@Service()
export class AvatarSrv {
  
  localStorageSvc = inject(LocalStorageService);
  public  static STORAGE_KEY = "AvatarSrv";

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  get(name: string): Promise <GetResponse> {
    const req: GetRequest = {
      name: name,
    } 
    return AvatarService.Get(req, this.initReq);
  }
}
