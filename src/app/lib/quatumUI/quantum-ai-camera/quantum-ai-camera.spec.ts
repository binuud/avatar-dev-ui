import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QuantumAiCamera } from "./quantum-ai-camera";

describe("QuantumAiCamera", () => {
  let component: QuantumAiCamera;
  let fixture: ComponentFixture<QuantumAiCamera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantumAiCamera],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantumAiCamera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
