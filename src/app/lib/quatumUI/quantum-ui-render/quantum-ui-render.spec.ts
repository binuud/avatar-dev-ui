import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QuantumUiRender } from "./quantum-ui-render";

describe("QuantumUiRender", () => {
  let component: QuantumUiRender;
  let fixture: ComponentFixture<QuantumUiRender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantumUiRender],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantumUiRender);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
