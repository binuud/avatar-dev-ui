import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ManageRobotsPage } from "./manage-robots-page";

describe("ManageRobotsPage", () => {
  let component: ManageRobotsPage;
  let fixture: ComponentFixture<ManageRobotsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRobotsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRobotsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
