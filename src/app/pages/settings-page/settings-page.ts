import { Component, inject } from "@angular/core";
import { LocalStorageService } from "../../core/services/local-storage-service";
import { KeyValuePipe } from "@angular/common";
import { SettingsSvc } from "../../core/services/settings-svc";
import { ConfigEntry } from "./components/config-entry/config-entry";

@Component({
  imports: [KeyValuePipe, ConfigEntry],
  selector: "app-settings-page",
  styleUrl: "./settings-page.scss",
  templateUrl: "./settings-page.html",
})
export class SettingsPage {

  settingsSvc = inject(SettingsSvc);
 
  localStorageSvc = inject(LocalStorageService);

  clear() {
    this.localStorageSvc.clear()  
  }

}
