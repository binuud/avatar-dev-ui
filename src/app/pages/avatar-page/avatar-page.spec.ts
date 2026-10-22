import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AvatarPage } from "./avatar-page";

describe("AvatarPage", () => {
  let component: AvatarPage;
  let fixture: ComponentFixture<AvatarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
