import { TestBed } from "@angular/core/testing";
import { SpinnerVerbSvc } from "./spinner-verb-svc";

describe("SpinnerVerbSvc", () => {
  let service: SpinnerVerbSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerVerbSvc);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
