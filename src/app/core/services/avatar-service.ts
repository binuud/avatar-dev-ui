import { inject, Service } from "@angular/core";
import { LocalStorageService } from "./local-storage-service";
import { InitReq } from "../../gen/fetch.pb";
import { AvatarStoreListRequest, AvatarStoreListResponse, AvatarStoreService } from "../../gen/v1/avatar/avatarStoreService.pb";

@Service()
export class AvatarService {

  localStorageSvc = inject(LocalStorageService);
  public  static STORAGE_KEY = "AvatarService";

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  list(req: AvatarStoreListRequest): Promise <AvatarStoreListResponse> {
    return AvatarStoreService.List(req, this.initReq);
  }
  
}
