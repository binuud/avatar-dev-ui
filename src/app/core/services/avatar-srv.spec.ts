import { TestBed } from "@angular/core/testing";
import { AvatarSrv } from "./avatar-srv";

describe("AvatarSrv", () => {
  let service: AvatarSrv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarSrv);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
