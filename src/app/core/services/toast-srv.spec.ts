import { TestBed } from "@angular/core/testing";
import { ToastSrv } from "./toast-srv";

describe("ToastSrv", () => {
  let service: ToastSrv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastSrv);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
