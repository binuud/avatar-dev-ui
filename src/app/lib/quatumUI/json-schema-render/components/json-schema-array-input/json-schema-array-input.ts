import { CommonModule } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { JsonSchema7 } from "../../../../../core/external/jsonSchema7";
import { JsonSchemaFormService } from "../../service/json-schema-form-service";

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: "app-json-schema-array-input",
  styleUrl: "./json-schema-array-input.scss",
  templateUrl: "./json-schema-array-input.html",
})
export class JsonSchemaArrayInput {
  
  schema = input.required<JsonSchema7>();
  propId = input.required<string>();
  dynamicForm = input.required<FormGroup>();
  formArray!: FormArray;

  // @Input() schema: JsonSchema7 = sampleSchema;
  private schemaService = inject(JsonSchemaFormService);
  

  ngOnInit(): void {
    this.formArray = this.dynamicForm().controls[this.propId()] as FormArray;
  }

  addItem(): void {
    const maxItems = this.schema().maxItems;
    if (maxItems) {
      if (this.formArray.length >= maxItems) return;
    }
    const schemaItems = this.schema().items;
    let newControl: AbstractControl//  = this.schema().items;
    if (schemaItems) {
      if (Array.isArray(schemaItems)) {
        newControl = this.schemaService.buildControl(schemaItems[0])
      } else {
        newControl = this.schemaService.buildControl({ type: 'string' });
      }
      this.formArray.push(newControl);
    } else {
     //  newControl = this.schemaService.buildControl({ type: 'string' });
    }


    this.formArray.markAsDirty();
  }

  removeItem(index: number): void {
    this.formArray.removeAt(index);
    this.formArray.markAsDirty();
  }
}
