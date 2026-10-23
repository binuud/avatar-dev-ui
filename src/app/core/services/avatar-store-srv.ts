import { inject, Service } from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import { AvatarStoreListRequest, AvatarStoreListResponse, AvatarStoreService } from "../../gen/v1/avatar/avatarStoreService.pb";
import { LocalStorageService } from "./local-storage-service";



@Service()
export class AvatarStoreSrv {
  localStorageSvc = inject(LocalStorageService);
  public  static STORAGE_KEY = "AvatarStoreService";

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  list(req: AvatarStoreListRequest): Promise <AvatarStoreListResponse> {
    return AvatarStoreService.List(req, this.initReq);
  }
}
