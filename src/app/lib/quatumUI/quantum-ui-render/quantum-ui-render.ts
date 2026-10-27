import { Component, inject, input, OnInit, output, signal } from "@angular/core";
import { QuantumUI, UiComponentUiType } from "../../../gen/v1/quantumUI/quantumUI.pb";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";


@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: "app-quantum-ui-render",
  styleUrl: "./quantum-ui-render.scss",
  templateUrl: "./quantum-ui-render.html",
})
export class QuantumUiRender implements OnInit {

  fb = inject(FormBuilder);

  ui = input.required<QuantumUI>();
  uiSubmitEvent = output<string>(); 

  dynamicForm: FormGroup = new FormGroup({});

  componentTypes = UiComponentUiType;


  ngOnInit(): void {
    // Initialize form controls based on the config array
    let components = this.ui().components;
    if (!components) return;
    // let myForm: FormGroup =  new FormGroup({});
    components.forEach(item => {
      if (item.id) {
        this.dynamicForm.setControl(item.id, new FormControl('', [Validators.required]));
      }
    });
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      const data = this.dynamicForm.value;
      console.log('Form Submitted:', data);
      const rawFormValues = this.dynamicForm.getRawValue();
      // Convert the JavaScript object into a clean, formatted JSON string
      const jsonOutput = JSON.stringify(rawFormValues, null, 2);
      this.uiSubmitEvent.emit(jsonOutput);
    }
  }



}
