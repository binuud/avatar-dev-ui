import { Component, computed, inject } from "@angular/core";
import { LocalStorageService } from "../../core/services/local-storage-service";
import { SettingsSvc } from "../../core/services/settings-svc";
import { ConfigEntries } from "./components/config-entries/config-entries";

@Component({
  imports: [ConfigEntries],
  selector: "app-settings-page",
  styleUrl: "./settings-page.scss",
  templateUrl: "./settings-page.html",
})
export class SettingsPage {
  settingsSvc = inject(SettingsSvc);

  localStorageSvc = inject(LocalStorageService);

  clear() {
    this.localStorageSvc.clear();
  }
}
