import { Service } from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import {
  AvatarStoreListRequest,
  AvatarStoreListResponse,
  AvatarStoreService,
} from "../../gen/v1/avatar/avatarStoreService.pb";

@Service()
export class AvatarStoreSrv {
  public static STORAGE_KEY = "AvatarStoreService";

  initReq: InitReq = {
    pathPrefix: "/api",
  };

  list(req: AvatarStoreListRequest): Promise<AvatarStoreListResponse> {
    return AvatarStoreService.List(req, this.initReq);
  }

  async sync() {
    await AvatarStoreService.Sync({}, this.initReq);
  }
}
