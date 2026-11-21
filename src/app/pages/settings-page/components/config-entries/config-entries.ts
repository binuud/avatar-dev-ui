import { Component, computed, inject } from "@angular/core";
import { SettingsSvc } from "../../../../core/services/settings-svc";
import { ConfigEntry } from "../config-entry/config-entry";

@Component({
  imports: [ConfigEntry],
  selector: "app-config-entries",
  styleUrl: "./config-entries.scss",
  templateUrl: "./config-entries.html",
})
export class ConfigEntries {
  settingsSvc = inject(SettingsSvc);

  // Derive an array so Angular tracks reference changes cleanly
  groupList = computed(() => {
    const groups = this.settingsSvc.settings().groups ?? {};
    return Object.entries(groups).map(([key, value]) => ({
      key,
      value,
    }));
  });
}
