import { ComponentFixture, TestBed } from "@angular/core/testing";
import { JsonSchemaRender } from "./json-schema-render";

describe("JsonSchemaRender", () => {
  let component: JsonSchemaRender;
  let fixture: ComponentFixture<JsonSchemaRender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonSchemaRender],
    }).compileComponents();

    fixture = TestBed.createComponent(JsonSchemaRender);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
