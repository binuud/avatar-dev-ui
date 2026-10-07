import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MultiStateButton } from "./multi-state-button";

describe("MultiStateButton", () => {
  let component: MultiStateButton;
  let fixture: ComponentFixture<MultiStateButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiStateButton],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiStateButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
