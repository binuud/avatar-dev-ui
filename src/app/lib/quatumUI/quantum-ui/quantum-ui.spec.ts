import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QuantumUI } from "./quantum-ui";

describe("QuantumUI", () => {
  let component: QuantumUI;
  let fixture: ComponentFixture<QuantumUI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantumUI],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantumUI);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
