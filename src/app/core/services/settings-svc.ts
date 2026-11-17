import { inject, Service, signal, WritableSignal } from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import { SettingsListResponse, SettingsListRequest, SettingsSaveRequest, Settings } from "../../gen/v1/settings/settingsService.pb";
import { ToastSrv } from "./toast-srv";

@Service()
export class SettingsSvc {

  toastService = inject(ToastSrv);
  settings: WritableSignal<SettingsListResponse> = signal({})

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  constructor() {
    this.list({});
  }

  saveSettingsSection(groupKey: string) {
    const groups = this.settings().groups;
    if (groups && groups[groupKey]) {
      const configsToBeSaved = groups[groupKey].configs;
      if (!configsToBeSaved) return;
      const req: SettingsSaveRequest = {
        groupKey: groupKey,
        configs: {
          configs: configsToBeSaved
        },
      }

      Settings.Save(req, this.initReq).then(response => {
        this.toastService.notifySuccess("Settings Saved");
        console.dir(response);
      });
    }

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
