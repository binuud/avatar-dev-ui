import { Component, Input } from "@angular/core";



export interface MultiStateButtonState {
  id: string;          // Unique identifier for the state (e.g., 'idle', 'loading', 'success')
  text?: string;        // Text to display for this state
  iconClass?: string;  // Optional CSS class for the icon (FontAwesome, Material Icons, etc.)
  disabled?: boolean;  // Whether the button should be disabled in this state
  title?: string;       // title shown on hover
}

@Component({
  imports: [],
  selector: "app-multi-state-button",
  styleUrl: "./multi-state-button.scss",
  templateUrl: "./multi-state-button.html",
})

export class MultiStateButton {

  // style of the button
  @Input()  btnClass: string = "";
  @Input() disabled: boolean = false;

}
