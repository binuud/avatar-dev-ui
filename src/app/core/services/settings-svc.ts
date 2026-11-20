import { inject, Service, signal, WritableSignal } from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import {
  SettingsListResponse,
  SettingsListRequest,
  SettingsSaveRequest,
  Settings,
} from "../../gen/v1/settings/settingsService.pb";
import { ToastSrv } from "./toast-srv";
import { SettingsInterfaces } from "../../pages/settings-page/models/settings-interfaces";
import { ConfigList } from "../../gen/v1/settings/settings.pb";

@Service()
export class SettingsSvc {
  toastService = inject(ToastSrv);
  settings: WritableSignal<SettingsListResponse> = signal<SettingsListResponse>(
    { groups: {} },
  );

  initReq: InitReq = {
    pathPrefix: "/api",
  };

  constructor() {
    this.list({});
  }

  onSelectChange(
    groupKey: string | undefined,
    fieldName: string | undefined,
    newValue: string | undefined,
  ): void {
    if (groupKey && fieldName && newValue && newValue in SettingsInterfaces) {
      const providerKey = newValue as keyof typeof SettingsInterfaces;
      const mySettings = structuredClone(this.settings());
      const groups = mySettings.groups;

      if (groups && groups[groupKey] && groups[groupKey].configs) {
        groups[groupKey].configs[1].value = SettingsInterfaces[providerKey];
        this.settings.set(mySettings);
      }
    }
  }

  // updateGroup(groupKey: string, newConfig: ConfigList) {
  //   this.settings.update((currentState) => ({
  //     groups: {
  //       ...currentState.groups, // Keep existing keys (handles undefined safely)
  //       [groupKey]: newConfig, // Set or overwrite the specific key
  //     },
  //   }));
  // }

  saveSettingsSection(groupKey: string) {
    const groups = this.settings().groups;
    if (groups && groups[groupKey]) {
      const configsToBeSaved = groups[groupKey].configs;
      if (!configsToBeSaved) return;
      const req: SettingsSaveRequest = {
        groupKey: groupKey,
        configs: {
          configs: configsToBeSaved,
        },
      };

      Settings.Save(req, this.initReq).then((response) => {
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
    Settings.List(req, this.initReq).then((response) => {
      this.settings.set(response);
      console.dir(response);
    });
  }
}
