import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AvatarRun } from "./avatar-run";

describe("AvatarRun", () => {
  let component: AvatarRun;
  let fixture: ComponentFixture<AvatarRun>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarRun],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarRun);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
