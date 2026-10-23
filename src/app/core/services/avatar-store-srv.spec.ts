import { TestBed } from "@angular/core/testing";
import { AvatarStoreSrv } from "./avatar-store-srv";

describe("AvatarStoreSrv", () => {
  let service: AvatarStoreSrv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarStoreSrv);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
