import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AvatarCard } from "./avatar-card";

describe("AvatarCard", () => {
  let component: AvatarCard;
  let fixture: ComponentFixture<AvatarCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
