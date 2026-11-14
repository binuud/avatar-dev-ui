import { Component, inject, input, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { JsonSchema7 } from "../../../core/external/jsonSchema7";
import { CommonModule } from "@angular/common";

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: "app-json-schema-render",
  styleUrl: "./json-schema-render.scss",
  templateUrl: "./json-schema-render.html",
})

export class JsonSchemaRender {

  fb = inject(FormBuilder);
  schema = input.required<string>();
  formTitle = input.required<string>();
  showSubmit = input.required<boolean>();
  uiSubmitEvent = output<string>(); 
  dynamicForm: FormGroup = new FormGroup({});

  propertyKeys :string[] = [];
  properties: { [property: string]: JsonSchema7 }  = {};
  //computed(() => Object.keys(this.properties()));
  
  constructor() {
    console.log(this.schema);  
  }

  ngOnInit(): void {
    // Initialize form controls based on the config array
    const schemaObj = JSON.parse(this.schema()) as JsonSchema7;
    
    if (schemaObj.properties) {
      this.properties = schemaObj.properties;
    }
    if (!this.properties) return;
    
    this.propertyKeys = Object.keys(this.properties);

    let myForm: FormGroup =  new FormGroup({});
    this.propertyKeys.forEach((propName) => {
      this.dynamicForm.setControl(propName, new FormControl('', [Validators.required]));
      console.log(propName);
    });
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      const data = this.dynamicForm.value;
      // console.log('Form Submitted:', data);
      const rawFormValues = this.dynamicForm.getRawValue();
      // Convert the JavaScript object into a clean, formatted JSON string
      const jsonOutput = JSON.stringify(rawFormValues, null, 2);
      this.uiSubmitEvent.emit(jsonOutput);
    }
  }
}
