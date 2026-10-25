import { TestBed } from "@angular/core/testing";
import { SettingsSvc } from "./settings-svc";

describe("SettingsSvc", () => {
  let service: SettingsSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsSvc);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
