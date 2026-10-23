import { Component, input } from "@angular/core";
import { QuantumUI, UiComponentUiType } from "../../../gen/v1/quantumUI/quantumUI.pb";


@Component({
  imports: [],
  selector: "app-quantum-ui-render",
  styleUrl: "./quantum-ui-render.scss",
  templateUrl: "./quantum-ui-render.html",
})
export class QuantumUiRender {

  ui = input.required<QuantumUI>();

  componentTypes = UiComponentUiType;
  // ui: QuantumUI = {
  // "components": [
  //   {
  //   "id": "firstName",
  //   "label": "First Name",
  //   "placeHolder": "Enter your first name",
  //   "type": UiComponentUiType.INPUT,
  //   "width": 50
  //   },
  //   {
  //   "id": "lastName",
  //   "label": "Last Name",
  //   "placeHolder": "Enter your last name",
  //   "type": UiComponentUiType.INPUT,
  //   "width": 50
  //   },
  //   {
  //   "id": "prompt",
  //   "label": "Prompt",
  //   "placeHolder": "Prompt",
  //   "type": UiComponentUiType.TEXTAREA,
  //   "width": 100
  //   },
  //   {
  //   "type": UiComponentUiType.PLAINTEXT,
  //   "value": "lorem ipsum dolor sit amet consectetur adipiscing elit optio ducimus temporibus ullamco ipsum dolor omnis aut et fugiat fugiat et voluptas et vero est autem minim possimus et libero facere imperdiet nihil consequatur eiusmod nostrud voluptas vero aliquip possimus duis qui dolorum et cupiditate elit minus quas ea voluptas consequatur",
  //   "width": 100
  //   }
  // ],
  // "description": "This is a test pane",
  // "name": "First Pane",
  // "title": "Avatar Pane"
  // }
}
