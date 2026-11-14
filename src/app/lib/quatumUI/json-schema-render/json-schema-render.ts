import { Component, inject, input, output } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { JsonSchema7 } from "../../../core/external/jsonSchema7";
import { CommonModule } from "@angular/common";
import { JsonSchemaArrayInput } from "./components/json-schema-array-input/json-schema-array-input";
import { JsonSchemaFormService } from "./service/json-schema-form-service";

@Component({
  imports: [CommonModule, ReactiveFormsModule, JsonSchemaArrayInput],
  selector: "app-json-schema-render",
  styleUrl: "./json-schema-render.scss",
  templateUrl: "./json-schema-render.html",
})

export class JsonSchemaRender {

  dynamicForm: FormGroup = new FormGroup({});
  schemaService = inject(JsonSchemaFormService);
  fb = inject(FormBuilder);
  schema = input.required<string>();
  formTitle = input.required<string>();
  showSubmit = input.required<boolean>();
  uiSubmitEvent = output<string>(); 


  propertyKeys :string[] = [];
  properties: { [property: string]: JsonSchema7 }  = {};

  
  constructor() {
    // console.log(this.schema);  
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
      // this.dynamicForm.setControl(propName, new FormControl('', [Validators.required]));
      this.dynamicForm.setControl(propName, this.schemaService.buildControl(this.properties[propName]));
    });
  }

  getFormArray(controlName: string): FormArray {
    return this.dynamicForm.get(controlName) as FormArray;
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      const data = this.dynamicForm.value;
      // console.log('Form Submitted:', data);
      const rawFormValues = this.dynamicForm.getRawValue();
      // Convert the JavaScript object into a clean, formatted JSON string
      const jsonOutput = JSON.stringify(rawFormValues, null, 2);
      console.dir(jsonOutput);
      this.uiSubmitEvent.emit(jsonOutput);
    }
  }


}
