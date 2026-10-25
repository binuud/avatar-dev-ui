import { Service, signal, WritableSignal } from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import { SettingsListResponse, SettingsListRequest, Settings } from "../../gen/v1/settings/settingsService.pb";

@Service()
export class SettingsSvc {

  settings: WritableSignal<SettingsListResponse> = signal({})

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  constructor() {
    this.list({});
  }

  /**
   * list
   * @param req 
   * gets the map of config entries from server
   */
  list(req: SettingsListRequest) {
    
    Settings.List(req, this.initReq).then(response => {
      this.settings.set(response);
      console.dir(response);
    });

  }
}
