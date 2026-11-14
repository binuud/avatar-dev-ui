import { Service } from "@angular/core";
import { AbstractControl, FormArray, ValidatorFn, FormControl, FormGroup, Validators, ValidationErrors } from "@angular/forms";
import { JsonSchema7 } from "../../../../core/external/jsonSchema7";

@Service()
export class JsonSchemaFormService {

  buildControl(schema: JsonSchema7, initialValue: any = null): AbstractControl {
    switch (schema.type) {
      case 'array':
        return this.buildFormArray(schema, Array.isArray(initialValue) ? initialValue : []);
      case 'object':
        return this.buildFormGroup(schema, initialValue ?? {});
      default:
        return this.buildPrimitiveControl(schema, initialValue);
    }
  }


  private buildFormArray(schema: JsonSchema7, values: any[]): FormArray {
    const validators: ValidatorFn[] = [];

    if (schema.minItems !== undefined) {
      validators.push(this.minItemsValidator(schema.minItems));
    }
    if (schema.maxItems !== undefined) {
      validators.push(this.maxItemsValidator(schema.maxItems));
    }
    if (schema.uniqueItems) {
      validators.push(this.uniqueItemsValidator());
    }

    // const controls = values.map(val => {
    //   if (Array.isArray(schema.items)) {
    //     return schema.items ? this.buildControl(schema.items[0], val) : new FormControl(val)
    //   } else {
    //     return schema.items ? this.buildControl(schema.items, val) : new FormControl(val)
    //   }
    // });

    // const controls = this.buildControl(schema.items, ) : new FormControl(val);
    const formArray = new FormArray<FormControl<string>>([
        new FormControl('', { nonNullable: true }),
    ]);
    return formArray;
  }

  private buildFormGroup(schema: JsonSchema7, value: Record<string, any>): FormGroup {
    const group: Record<string, AbstractControl> = {};
    const properties = schema.properties ?? {};
    const requiredFields = new Set(schema.required ?? []);

    for (const [key, propSchema] of Object.entries(properties)) {
      const control = this.buildControl(propSchema, value[key]);
      if (requiredFields.has(key)) {
        control.addValidators(Validators.required);
      }
      group[key] = control;
    }
    return new FormGroup(group);
  }

  private buildPrimitiveControl(schema: JsonSchema7, value: any): FormControl {
    const validators: ValidatorFn[] = [];
    if (schema.minLength !== undefined) validators.push(Validators.minLength(schema.minLength));
    if (schema.maxLength !== undefined) validators.push(Validators.maxLength(schema.maxLength));
    if (schema.minimum !== undefined) validators.push(Validators.min(schema.minimum));
    if (schema.maximum !== undefined) validators.push(Validators.max(schema.maximum));

    return new FormControl(value ?? (schema.type === 'boolean' ? false : ''), validators);
  }

  // --- JSON Schema 7 Array Validators ---

  private minItemsValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const arr = control as FormArray;
      return arr.length < min ? { minItems: { requiredLength: min, actualLength: arr.length } } : null;
    };
  }

  private maxItemsValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const arr = control as FormArray;
      return arr.length > max ? { maxItems: { maxLength: max, actualLength: arr.length } } : null;
    };
  }

  private uniqueItemsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const values = (control as FormArray).value;
      const serialized = values.map((v: any) => JSON.stringify(v));
      const hasDuplicates = new Set(serialized).size !== serialized.length;
      return hasDuplicates ? { uniqueItems: true } : null;
    };
  }
}
