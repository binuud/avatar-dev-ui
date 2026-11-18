import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditMemorySettings } from "./edit-memory-settings";

describe("EditMemorySettings", () => {
  let component: EditMemorySettings;
  let fixture: ComponentFixture<EditMemorySettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMemorySettings],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMemorySettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
