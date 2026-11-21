import { Component, computed, effect, inject, signal } from "@angular/core";
import { SettingsSvc } from "../../core/services/settings-svc";
import { SpinnerVerbSvc } from "../../core/services/spinner-verb-svc";
import { ConfigEntries } from "../settings-page/components/config-entries/config-entries";
import { Router } from "@angular/router";

@Component({
  imports: [ConfigEntries],
  selector: "app-welcome-page",
  styleUrl: "./welcome-page.scss",
  templateUrl: "./welcome-page.html",
})
export class WelcomePage {
  settingsSvc = inject(SettingsSvc);
  spinnerVerbsSvc = inject(SpinnerVerbSvc);
  private router = inject(Router);

  constructor() {
    effect(() => {
      console.log("Input form changed");
      const state = this.settingsSvc.state();
      if (state.initiaConfigurationStatus == true) {
        console.log("Initial Configuration done, moving to home page");
        this.router.navigate(["/chat"]);
      } else {
        console.log("Initial Configuration not done");
      }
    });
  }
}
