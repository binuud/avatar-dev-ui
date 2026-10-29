import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AvatarDetails } from "./avatar-details";

describe("AvatarDetails", () => {
  let component: AvatarDetails;
  let fixture: ComponentFixture<AvatarDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
