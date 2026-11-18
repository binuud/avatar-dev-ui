import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ManageMemoryPage } from "./manage-memory-page";

describe("ManageMemoryPage", () => {
  let component: ManageMemoryPage;
  let fixture: ComponentFixture<ManageMemoryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMemoryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageMemoryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
