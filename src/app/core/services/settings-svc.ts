import {
  computed,
  DestroyRef,
  inject,
  Service,
  signal,
  WritableSignal,
} from "@angular/core";
import { InitReq } from "../../gen/fetch.pb";
import {
  SettingsListResponse,
  SettingsListRequest,
  SettingsSaveRequest,
  Settings,
} from "../../gen/v1/settings/settingsService.pb";
import { ToastSrv } from "./toast-srv";
import { SettingsInterfaces } from "../../pages/settings-page/models/settings-interfaces";
import {
  LocalStorageService,
  SignalStateService,
} from "./local-storage-service";

export interface SettingsState {
  initiaConfigurationStatus: boolean;
}

const Initial_SettingsState: SettingsState = {
  initiaConfigurationStatus: false,
};

@Service()
export class SettingsSvc extends SignalStateService<SettingsState> {
  toastService = inject(ToastSrv);
  localStorageSvc = inject(LocalStorageService);

  public static STORAGE_KEY = "SettingsSvc";

  settings: WritableSignal<SettingsListResponse> = signal<SettingsListResponse>(
    { groups: {} },
  );

  initReq: InitReq = {
    pathPrefix: "/api",
  };

  // state: WritableSignal<SettingsState> = signal({
  //   initiaConfigurationStatus: false,
  // });

  loaded = computed<boolean>(() => {
    const groups = this.settings().groups;
    if (groups && "_HIDDEN" in groups && groups["_HIDDEN"].configs) {
      return true;
    }
    return false;
  });

  constructor() {
    super(SettingsSvc.STORAGE_KEY, Initial_SettingsState);
    this.list({});
    this.loadState();
  }

  onSelectChange(
    groupKey: string | undefined,
    fieldName: string | undefined,
    newValue: string | undefined,
  ): void {
    if (fieldName != "LLM_PROVIDER") return;
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
      // save settings on backend
      Settings.Save(req, this.initReq).then((response) => {
        this.toastService.notifySuccess("Settings Saved");
        console.dir(response);
        this.list({});
      });
    }
  }

  getValue(groupKey: string, configKey: string): string | undefined {
    const groups = this.settings().groups;
    if (groups && groups[groupKey] && groups[groupKey].configs) {
      const entry = groups[groupKey].configs.find(
        (configItem) => configItem.name === configKey,
      );
      if (entry) {
        return entry.value;
      }
    }
    return undefined;
  }

  /**
   * list
   * @param req
   * gets the map of config entries from server
   */
  list(req: SettingsListRequest) {
    Settings.List(req, this.initReq).then((response) => {
      this.settings.set(response);
      const initConfigDone = this.getValue("_HIDDEN", "INITIAL_CONFIGURED");
      // INITIAL_CONFIGURED value is a string -- remember
      if (initConfigDone && initConfigDone == "true") {
        this.patchState({ initiaConfigurationStatus: true });
      } else {
        this.patchState({ initiaConfigurationStatus: false });
      }
    });
  }
}
