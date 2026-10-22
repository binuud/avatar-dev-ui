import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AvatarList } from "./avatar-list";

describe("AvatarList", () => {
  let component: AvatarList;
  let fixture: ComponentFixture<AvatarList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarList],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
