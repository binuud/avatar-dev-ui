import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigEntry } from "./config-entry";

describe("ConfigEntry", () => {
  let component: ConfigEntry;
  let fixture: ComponentFixture<ConfigEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
