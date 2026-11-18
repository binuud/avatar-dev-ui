import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MemoryDetails } from "./memory-details";

describe("MemoryDetails", () => {
  let component: MemoryDetails;
  let fixture: ComponentFixture<MemoryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(MemoryDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
