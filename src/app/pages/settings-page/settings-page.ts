import { Component, computed, inject } from "@angular/core";
import { LocalStorageService } from "../../core/services/local-storage-service";
import { JsonPipe, KeyValuePipe } from "@angular/common";
import { SettingsSvc } from "../../core/services/settings-svc";
import { ConfigEntry } from "./components/config-entry/config-entry";

@Component({
  imports: [ConfigEntry],
  selector: "app-settings-page",
  styleUrl: "./settings-page.scss",
  templateUrl: "./settings-page.html",
})
export class SettingsPage {
  settingsSvc = inject(SettingsSvc);

  localStorageSvc = inject(LocalStorageService);

  // Derive an array so Angular tracks reference changes cleanly
  groupList = computed(() => {
    const groups = this.settingsSvc.settings().groups ?? {};
    return Object.entries(groups).map(([key, value]) => ({
      key,
      value,
    }));
  });

  clear() {
    this.localStorageSvc.clear();
  }
}
