import { ComponentFixture, TestBed } from "@angular/core/testing";
import { JsonSchemaArrayInput } from "./json-schema-array-input";

describe("JsonSchemaArrayInput", () => {
  let component: JsonSchemaArrayInput;
  let fixture: ComponentFixture<JsonSchemaArrayInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonSchemaArrayInput],
    }).compileComponents();

    fixture = TestBed.createComponent(JsonSchemaArrayInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
