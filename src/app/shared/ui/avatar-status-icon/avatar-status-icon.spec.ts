import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AvatarStatusIcon } from "./avatar-status-icon";

describe("AvatarStatusIcon", () => {
  let component: AvatarStatusIcon;
  let fixture: ComponentFixture<AvatarStatusIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarStatusIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarStatusIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
