import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigEntries } from "./config-entries";

describe("ConfigEntries", () => {
  let component: ConfigEntries;
  let fixture: ComponentFixture<ConfigEntries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigEntries],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigEntries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
