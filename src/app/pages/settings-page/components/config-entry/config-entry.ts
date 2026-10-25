import { Component, inject, input } from "@angular/core";
import { Config, ConfigType } from "../../../../gen/v1/settings/settings.pb";

@Component({
  imports: [],
  selector: "app-config-entry",
  styleUrl: "./config-entry.scss",
  templateUrl: "./config-entry.html",
})
export class ConfigEntry {
  group = input.required<string>();
  entry = input.required<Config>();

  configTypes = ConfigType;
}
